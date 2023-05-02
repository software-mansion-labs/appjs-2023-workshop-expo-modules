import { Platform } from "expo-modules-core";
import LinearChartBasicData from "./LinearChartBasicData";
import LinearChartEvents from "./LinearChartEvents";
import LinearChartProps from "./LinearChartProps";
import LinearChartViewFunctions from "./LinearChartViewFunctions";
import NativeModule from "./NativeModule";
import SharedDataSet from "./SharedDataSet";
import SharedObjects from "./SharedObjects";
import ActivityContracts from "./ActivityContracts";
import FirstSteps from "./FirstSteps";

export const screens = [
  { name: "First steps", text: "👶 First steps", component: FirstSteps },
  { name: "Native Module", text: "⚙️ Native Module", component: NativeModule },
  {
    name: "Linear Chart Basic Data",
    text: "📈 Linear Chart Basic Data",
    component: LinearChartBasicData,
  },
  {
    name: "Linear Chart Props",
    text: "📚 Linear Chart Props",
    component: LinearChartProps,
  },
  {
    name: "Linear Chart Events",
    text: "🔥 Linear Chart Events",
    component: LinearChartEvents,
  },
  {
    name: "Linear Chart View Functions",
    text: "🏞️ Linear Chart View Functions",
    component: LinearChartViewFunctions,
  },
  {
    name: "Classes and Shared Objects",
    text: "👷‍♂️ Classes and Shared Objects",
    component: SharedObjects,
  },
  {
    name: "Views and shared objects",
    text: "📊 Views and shared objects",
    component: SharedDataSet,
  },
  {
    name: "Activity contracts",
    text: "📂 Activity contracts",
    component: ActivityContracts,
    platform: "android",
  },
] as const;

export const screenList = screens.filter((x) => {
  if ("platform" in x) {
    return x.platform === Platform.OS;
  }
  return true;
});

type ScreensType = (typeof screens)[number]["name"];

export type TestDetailsProps = {
  functionBody: string;
};

export type RootStackParamList = {
  [key in ScreensType | "Home"]: undefined;
};
