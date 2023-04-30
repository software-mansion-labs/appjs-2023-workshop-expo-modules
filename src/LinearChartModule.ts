import { requireNativeModule } from "expo-modules-core";
import { DataMode } from "./LinearChartView";

type SharedDataSetOptions = {
  mode?: DataMode;
  lineWidth?: number;
};

export interface SharedDataSet {
  new (): SharedDataSet;
  new (initValues: Uint8Array): SharedDataSet;
  new (initValues: Uint8Array, options: SharedDataSetOptions): SharedDataSet;

  readonly add: (value: number) => void;
  readonly setDataTransformer: (value: number) => number;
}

interface LinearChartModule {
  readonly SharedDataSet: SharedDataSet;
}

const module = requireNativeModule<LinearChartModule>("LinearChart");

export default module;
