import { requireNativeModule } from "expo-modules-core";

type FirstModuleType = {
  readonly functionAsync: () => Promise<string>;
  readonly function: () => string;
};

const module = requireNativeModule<FirstModuleType>("FirstModule");

export default module;
