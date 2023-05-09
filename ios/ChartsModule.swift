import ExpoModulesCore

public class ChartsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Charts")

    Function("add") { (a: Int, b: Int) in
      return a + b
    }

    AsyncFunction("addAsync") { (a: Int, b: Int) in
      return a + b
    }

    Function("calculateAverage") { (data: [Double]) in
      return data.reduce(0.0, +) / Double(data.count)
    }
  }
}
