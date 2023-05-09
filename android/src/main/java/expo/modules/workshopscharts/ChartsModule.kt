package expo.modules.workshopscharts

import expo.modules.kotlin.exception.CodedException
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
  }
}
