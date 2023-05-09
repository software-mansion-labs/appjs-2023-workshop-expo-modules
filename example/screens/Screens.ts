import { Platform } from "expo-modules-core";
import ChartBasicData from "./ChartBasicData";
import ViewEvents from "./ViewEvents";
import ViewProps from "./ViewProps";

import NativeModule from "./NativeModule";
import SharedDataSet from "./SharedDataSet";
import SharedObjects from "./SharedObjects";
import ActivityContracts from "./ActivityContracts";
import FirstSteps from "./FirstSteps";
import ViewFunctions from "./ViewFunctions";

export const screens = [
  { name: "First steps", text: "👶 First steps", component: FirstSteps },
  { name: "Native Module", text: "⚙️ Native Module", component: NativeModule },
  {
    name: "Passing Data To View",
    text: "📈 Passing Data To View",
    component: ChartBasicData,
  },
  {
    name: "View Props",
    text: "📚 View Props",
    component: ViewProps,
  },
  {
    name: "View Events",
    text: "🔥 View Events",
    component: ViewEvents,
  },
  {
    name: "View Functions",
    text: "🏞️ View Functions",
    component: ViewFunctions,
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
