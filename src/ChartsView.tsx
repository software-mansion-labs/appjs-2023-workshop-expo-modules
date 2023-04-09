import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ChartsViewProps } from './Charts.types';

const NativeView: React.ComponentType<ChartsViewProps> =
  requireNativeViewManager('Charts');

export default function ChartsView(props: ChartsViewProps) {
  return <NativeView {...props} />;
}
