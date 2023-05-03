import ExpoModulesCore

public class FirstModule : Module {
  public func definition() -> ModuleDefinition {
    Name("FirstModule")
    
    AsyncFunction("functionAsync") {
      return "Expo Native Api"
    }
    
    Function("function") {
      return "Expo Native API"
    }
  }
}
