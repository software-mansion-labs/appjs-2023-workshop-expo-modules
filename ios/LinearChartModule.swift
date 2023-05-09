import ExpoModulesCore
import Charts

public class LinearChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("LinearChart")

    View(LinearChartView.self) {

    }
  }
}
