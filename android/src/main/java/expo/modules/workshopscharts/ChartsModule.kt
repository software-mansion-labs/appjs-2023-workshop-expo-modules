package expo.modules.workshopscharts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ChartsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Charts")

    Function("add") { a: Int, b: Int ->
      return@Function a + b
    }
  }
}
