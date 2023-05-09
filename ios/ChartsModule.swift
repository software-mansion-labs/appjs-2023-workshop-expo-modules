import ExpoModulesCore

internal class InvalidSizeException : Exception {
  override var reason: String {
    "Provided size was invalid"
  }
}

internal struct Point: Record {
  @Field(.required)
  var x: Double

  @Field(.required)
  var y: Double
}

public class ChartsModule: Module {
  var x = -1.0

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

    Function("typeOf") { (value: JavaScriptValue) in
      return value.kind.rawValue
    }

    Function("modifyJSObject") { (jsObject: JavaScriptObject) in
      jsObject.setProperty("expo", value: "is awesome")
    }
    
    Function("callJSFunction") { (jsFunction: JavaScriptFunction<Double>) in
      return try jsFunction.call(100, 200)
    }

    AsyncFunction("objectSummary") { (jsObject: [String: Any]) in
      return jsObject.description
    }

    Events("onNewData")

    AsyncFunction("sendOnNewDataEvent") {
      sendEvent("onNewData", [
        "value": 123,
      ])
    }

    Function("calculateDistance") { (p1: Point, p2: Point) in
      return sqrt((p1.y - p2.y) * (p1.y - p2.y) + (p1.x - p2.x) * (p1.x - p2.x))
    }

    Property("x")
      .get { self.x }
      .set { (newValue: Double) in self.x = newValue * newValue }

    Class("Class") {

    }
  }
}
