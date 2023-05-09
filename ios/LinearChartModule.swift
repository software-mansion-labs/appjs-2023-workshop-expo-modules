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
}

public class LinearChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LinearChart")

    View(LinearChartView.self) {

    }
  }
}
