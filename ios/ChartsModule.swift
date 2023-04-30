import ExpoModulesCore

internal class InvalidSizeException : Exception {
  override var reason: String {
    "Provided size was invalid"
  }
}

internal struct Point: Record {
  @Field
  var x: Double

  @Field
  var y: Double
}

internal class SharedList : SharedObject {
  private var data: [Int] = []

  var size: Int {
    data.count
  }

  func add(_ newElement: Int) {
    data.append(newElement)
  }

  subscript(index: Int) -> Int {
    get {
      return data[index]
    }
  }
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
      Constructor { (this: JavaScriptObject, value: Int?) in
        this.setProperty("property", value: value ?? 10)
      }

      Function("modifyProperty") { (this: JavaScriptObject) in
        let p = this.getProperty("property").getInt()
        this.setProperty("property", value: p * p)
      }

      AsyncFunction("modifyPropertyAsync") { (this: JavaScriptObject, promise: Promise) in
        appContext!.executeOnJavaScriptThread {
          let p = this.getProperty("property").getInt()
          this.setProperty("property", value: p * p)
          promise.resolve()
        }
      }

      Function("createAnonymousObject") {
        Object {
          Function("calculate") { (a: Int, b: Int, c: Int) in
            a + b + c
          }
        }
      }
    }

    Class(SharedList.self) {
      Constructor {
        return SharedList()
      }

      Function("add") { (sharedObject: SharedList, newValue: Int) in
        sharedObject.add(newValue)
      }

      Function("get") { (sharedObject: SharedList, index: Int) in
        sharedObject[index]
      }

      Function("size") { (sharedObject: SharedList) in
        sharedObject.size
      }

      AsyncFunction("addAsync") { (sharedObject: SharedList, newValue: Int) in
        sharedObject.add(newValue)
      }

      AsyncFunction("getAsync") { (sharedObject: SharedList, index: Int) in
        sharedObject[index]
      }

      AsyncFunction("sizeAsync") { (sharedObject: SharedList) in
        sharedObject.size
      }
    }
  }
}
