import ExpoModulesCore
import Charts

class LinearChartView: ExpoView {
  let chartView = LineChartView(frame: .zero)

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    chartView.applyDefaultSettings()

    addSubview(chartView)
  }

  func setSeries(_ series: LinearDataSeries) {
    let dataSet = LineChartDataSet(
      entries: series.values.map { ChartDataEntry(x: $0.x, y: $0.y) },
      label: "label"
    )

    dataSet.applyDefaultSettings()

    dataSet.mode = series.mode.toLineDataSetMode()

    dataSet.valueFont = dataSet.valueFont.withSize(series.textSize)
    dataSet.lineWidth = series.lineWidth

    chartView.applyNewData(dataSet: dataSet)
  }

  func setTouchEnabled(_ value: Bool) {
    chartView.dragEnabled = value
    chartView.doubleTapToZoomEnabled = value
    chartView.pinchZoomEnabled = value
  }

  func setLegendEnabled(_ value: Bool) {
    chartView.legend.enabled = value
    chartView.setNeedsDisplay()
  }
}
