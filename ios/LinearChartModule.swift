import ExpoModulesCore
import Charts

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
    }
  }
}
