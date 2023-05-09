package expo.modules.workshopscharts

import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.jni.JavaScriptFunction
import expo.modules.kotlin.jni.JavaScriptObject
import expo.modules.kotlin.jni.JavaScriptValue
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class InvalidSizeException : CodedException(
  message = "Provided size was invalid"
)

class ChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Charts")

    Function("add") { a: Int, b: Int ->
      return@Function a + b
    }

    AsyncFunction("addAsync") { a: Int, b: Int ->
      return@AsyncFunction a + b
    }

    Function("calculateAverage") { data: List<Double> ->
      return@Function data.average()
    }

    AsyncFunction("generateDataAsync") { size: Int ->
      if (size < 0) {
        throw InvalidSizeException()
      }

      return@AsyncFunction IntArray(size) { it }
    }

    Constants(
      "VERY_IMPORTANT_CONSTANT" to 2
    )

    Function("typeOf") { value: JavaScriptValue ->
      return@Function value.kind()
    }

    Function("modifyJSObject") { jsObject: JavaScriptObject ->
      jsObject.setProperty("expo", "is awesome")
    }

    Function("callJSFunction") { jsFunction: JavaScriptFunction<Double> ->
      return@Function jsFunction(100, 200)
    }

    AsyncFunction("objectSummary") { jsObject: Map<String, Any> ->
      return@AsyncFunction jsObject.toString()
    }

    Events("onNewData")

    AsyncFunction("sendOnNewDataEvent") {
      sendEvent("onNewData", mapOf(
        "value" to 123,
      ))
    }
  }
}
