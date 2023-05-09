import ExpoModulesCore
import Charts

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

struct DataEntry : Record {
  @Field
  var x: Double

  @Field
  var y: Double
}

struct LinearDataSeries : Record {
  @Field(.required)
  var values: [DataEntry]

  @Field
  var label: String

  @Field
  var lineWidth = 5.0

  @Field
  var textSize = 10.0

  @Field
  var mode: DataMode = DataMode.LINEAR
}

public class LinearChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LinearChart")

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
    }
  }
}
