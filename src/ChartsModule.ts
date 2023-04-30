import {
  Subscription,
  requireNativeModule,
  EventEmitter,
} from "expo-modules-core";
import { NativeModule } from "react-native";

type Point = {
  x: number;
  y: number;
};

interface NativeChartsModule extends NativeModule {
  readonly VERY_IMPORTANT_CONSTANT: number;

  readonly add: (a: number, b: number) => number;
  readonly addAsync: (a: number, b: number) => Promise<number>;
  readonly calculateAverage: (data: number[]) => number;
  readonly generateDataAsync: (size: number) => Promise<number[]>;
  readonly typeOf: (value: any) => string;
  readonly modifyJSObject: (value: object) => void;
  readonly callJSFunction: (
    jsFunction: (a: number, b: number) => number
  ) => number;
  readonly objectSummary: (object: object) => string;

  readonly sendOnNewDataEvent: () => void;
  readonly calculateDistance: (p1: Point, p2: Point) => number;
  x: number;

  readonly Class: Class;
  readonly SharedList: SharedList;

  readonly pickRingtone: () => Promise<string | null>;
}

interface Class {
  new (property?: number): Class;

  readonly property?: number;

  readonly modifyProperty: () => void;
  readonly modifyPropertyAsync: () => Promise<void>;
  readonly createAnonymousObject: () => {
    readonly calculate: (a: number, b: number, c: number) => number;
  };
}

interface SharedList {
  new (): SharedList;

  readonly add: (newValue: number) => void;
  readonly get: (index: number) => number;
  readonly size: () => number;

  readonly addAsync: (newValue: number) => Promise<void>;
  readonly getAsync: (index: number) => Promise<number>;
  readonly sizeAsync: () => Promise<number>;
}

interface ChartsModule extends NativeChartsModule {
  readonly addOnNewDataListener: (
    listener: (event: { value: number }) => void
  ) => Subscription;
}

const module = requireNativeModule<NativeChartsModule>("Charts");
const moduleEventEmitter = new EventEmitter(module);

module["addOnNewDataListener"] = function (
  listener: (event: { value: number }) => void
) {
  return moduleEventEmitter.addListener("onNewData", listener);
};

export default module as ChartsModule;
