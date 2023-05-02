import ExpoModulesCore
import Charts

class ImageSaver: NSObject {
  private let promise: Promise

  init(promise: Promise) {
    self.promise = promise
  }

  func writeToPhotoAlbum(image: UIImage) {
    UIImageWriteToSavedPhotosAlbum(image, self, #selector(saveCompleted), nil)
  }

  @objc func saveCompleted(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
    promise.resolve(error == nil)
  }
}

class LinearChartView: ExpoView, ChartViewDelegate, Observer {
  let chartView = LineChartView(frame: .zero)

  var onDataSelect = EventDispatcher()
  var onScale = EventDispatcher()

  var currentDataSet: SharedDataSet? = nil

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    chartView.applyDefaultSettings()

    chartView.delegate = self

    addSubview(chartView)
  }

  func setSeries(_ series: LinearDataSeries) {
    let dataSet = LineChartDataSet(
      entries: series.values.map { ChartDataEntry(x: $0.x, y: $0.y) },
      label: series.label
    )

    dataSet.applyDefaultSettings()

    dataSet.valueFont = dataSet.valueFont.withSize(series.textSize)
    dataSet.lineWidth = series.lineWidth
    dataSet.mode = series.mode.toLineDataSetMode()
    
    chartView.applyNewData(dataSet: dataSet)
  }

  func setTouchEnabled(_ value: Bool) {
    chartView.dragEnabled = value
  }

  func setLegendEnabled(_ value: Bool) {
    chartView.legend.enabled = value
  }

  func chartValueSelected(_ chartView: ChartViewBase, entry: ChartDataEntry, highlight: Highlight) {
    onDataSelect([
      "x": entry.x,
      "y": entry.y
    ])
  }

  func chartScaled(_ chartView: ChartViewBase, scaleX: CGFloat, scaleY: CGFloat) {
    onScale([
      "scaleX": scaleX,
      "scaleY": scaleY
    ])
  }

  func moveToStart() {
    if let dataSet = chartView.data {
      chartView.moveViewToX(dataSet.xMin - 1)
    }
  }

  func moveToEnd() {
    if let dataSet = chartView.data {
      chartView.moveViewToX(dataSet.xMax - 1)
    }
  }

  func moveToPoint(_ x: Double, _ y: Double) {
    chartView.moveViewTo(xValue: x, yValue: y, axis: .left)
  }

  func saveToGallery(_ promise: Promise) {
    if let imageData = chartView.getChartImage(transparent: true) {
      ImageSaver(promise: promise).writeToPhotoAlbum(image: imageData)
      return
    }
    promise.resolve(false)
  }

  func setDataSet(dataSet: SharedDataSet) {
    currentDataSet?.removeListener(listener: self)
    dataSet.addListener(newDataListener: self)
    currentDataSet = dataSet
  }

  func dataWasUpdated(newDataSet: LineChartDataSet) {
    chartView.applyNewData(dataSet: newDataSet)
  }
}