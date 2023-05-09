package expo.modules.workshopscharts

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FirstModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("FirstModule")

    AsyncFunction("functionAsync") {
      return@AsyncFunction "Expo Native Api"
    }

    Function("function") {
      return@Function "Expo Native API"
    }
  }
}
