import ExpoModulesCore

internal class InvalidSizeException : Exception {
  override var reason: String {
    "Provided size was invalid"
  }
}

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

    AsyncFunction("generateDataAsync") { (size: Int) -> [Int] in
      if size < 0 {
        throw InvalidSizeException()
      }

      var result: [Int] = []
      for i in 0..<size {
        result.append(i)
      }
      return result
    }

    Constants([
      "VERY_IMPORTANT_CONSTANT": 2
    ])
  }
}
