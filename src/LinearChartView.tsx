import { requireNativeViewManager } from "expo-modules-core";
import * as React from "react";
import { ViewProps } from "react-native";

import { Ref } from "react";
import { ProcessedColorValue } from "react-native";
import { SharedDataSet } from "./LinearChartModule";

export type ChangeEventPayload = {
  value: string;
};

export enum DataMode {
  LINEAR = 0,
  STEPPED = 1,
  CUBIC_BEZIER = 2,
  HORIZONTAL_BEZIER = 3,
}

export interface LinearChartViewRef {
  readonly moveToStart: () => Promise<void>;
  readonly moveToEnd: () => Promise<void>;
  readonly moveToPoint: (x: number, y: number) => Promise<void>;
  readonly saveToGallery: () => Promise<boolean>;

  readonly setDataSet: (dataSet: SharedDataSet) => Promise<void>;
}

export interface LinearChartViewProps extends ViewProps {
  data?: {
    label: string;
    values: { x: number; y: number }[];
    mode?: DataMode;
    lineWidth?: number;
    textSize?: number;
  };

  touchEnabled?: boolean;
  legendEnabled?: boolean;

  onDataSelect?: (data: any) => void;
  onScale?: (data: any) => void;

  nativeRef?: Ref<LinearChartViewRef>;
}

export type LinearChartNativeViewProps = Omit<
  LinearChartViewProps,
  "nativeRef"
> & {
  ref?: Ref<LinearChartViewRef>;
  legendTextColor?: ProcessedColorValue | null | undefined;
};

const NativeView: React.ComponentType<LinearChartNativeViewProps> =
  requireNativeViewManager("LinearChart");

export default function ChartsView(props: LinearChartViewProps) {
  const { nativeRef, ...rest } = props;
  // @ts-ignore
  return <NativeView {...rest} ref={nativeRef} />;
}
