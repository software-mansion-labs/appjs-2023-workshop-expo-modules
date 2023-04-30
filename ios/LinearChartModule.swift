import ExpoModulesCore
import Charts

internal struct DataEntry : Record {
  @Field
  var x: Double

  @Field
  var y: Double
}

enum DataMode : Int, Enumerable {
  case LINEAR = 0, STEPPED, CUBIC_BEZIER, HORIZONTAL_BEZIER

  func toLineDataSetMode() -> LineChartDataSet.Mode {
    switch self {
    case .LINEAR: return .linear
    case .CUBIC_BEZIER: return .cubicBezier
    case .HORIZONTAL_BEZIER: return .horizontalBezier
    case .STEPPED: return .stepped
    }
  }
}

internal struct LinearDataSeries : Record {
  @Field
  var values: [DataEntry]

  @Field
  var label: String

  @Field
  var mode: DataMode = DataMode.LINEAR

  @Field
  var lineWidth = 5.0

  @Field
  var textSize = 10.0
}

internal protocol Observer: AnyObject {
  func dataWasUpdated(newDataSet : LineChartDataSet)
}

internal struct SharedDataSetOptions : Record {
  @Field
  var mode: DataMode = DataMode.LINEAR

  @Field
  var lineWidth = 5.0
}

internal class SharedDataSet : SharedObject {
  private var listeners: [Observer] = []

  private var dataSet: LineChartDataSet

  init(_ initValues: Uint8Array?, _ options: SharedDataSetOptions?) {
    dataSet = LineChartDataSet()

    if let initValues = initValues {
      for i in 0..<initValues.length {
        dataSet.append(
          ChartDataEntry(x: Double(i+1), y: Double(initValues[i]))
        )
      }
    }

    dataSet.mode = options?.mode.toLineDataSetMode() ?? .cubicBezier
    dataSet.colors = [Colors.primary]
    dataSet.lineWidth = options?.lineWidth ?? 10
    dataSet.valueTextColor = Colors.text
    dataSet.valueFont = dataSet.valueFont.withSize(12)

    super.init()
  }

  func addListener(newDataListener: Observer) {
    listeners.append(newDataListener)

    if (dataSet.count != 0) {
      newDataListener.dataWasUpdated(newDataSet: dataSet)
    }
  }

  func removeListener(listener: Observer?) {
    if let listener = listener {
      listeners.removeAll(where: { $0 === listener })
    }
  }

  func addData(value: Double) {
    dataSet.append(
      ChartDataEntry(x: Double(dataSet.count + 1), y: value)
    )

    listeners.forEach { $0.dataWasUpdated(newDataSet: dataSet) }
  }
}

public class LinearChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LinearChart")

    Class(SharedDataSet.self) {
      Constructor { (initValues: Uint8Array?, options: SharedDataSetOptions?) in
        return SharedDataSet(initValues, options)
      }

      Function("add") { (sharedObject: SharedDataSet, newY: Double) in
        DispatchQueue.main.async {
          sharedObject.addData(value: newY)
        }
      }
    }

    View(LinearChartView.self) {
      Prop("data") { (view: LinearChartView, series: LinearDataSeries?) in
        if let series = series {
          view.setSeries(series)
        }
      }

      Prop("touchEnabled") { (view: LinearChartView, touchEnabled: Bool?) in
        view.setTouchEnabled(touchEnabled ?? true)
      }

      Prop("legendEnabled") { (view: LinearChartView, legendEnabled: Bool?) in
        view.setLegendEnabled(legendEnabled ?? true)
      }

      Events("onDataSelect", "onScale")

      AsyncFunction("moveToStart") { (view: LinearChartView) in
        view.moveToStart()
      }

      AsyncFunction("moveToEnd") { (view: LinearChartView) in
        view.moveToEnd()
      }

      AsyncFunction("moveToPoint") { (view: LinearChartView, x: Double, y: Double) in
        view.moveToPoint(x, y)
      }

      AsyncFunction("saveToGallery") { (view: LinearChartView, promise: Promise) in
        view.saveToGallery(promise)
      }

      AsyncFunction("setDataSet") { (view: LinearChartView, sharedDataSet: SharedDataSet) in
        view.setDataSet(dataSet: sharedDataSet)
      }
    }
  }
}
