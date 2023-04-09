import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Charts.web.ts
// and on native platforms to Charts.ts
import ChartsModule from './ChartsModule';
import ChartsView from './ChartsView';
import { ChangeEventPayload, ChartsViewProps } from './Charts.types';

// Get the native constant value.
export const PI = ChartsModule.PI;

export function hello(): string {
  return ChartsModule.hello();
}

export async function setValueAsync(value: string) {
  return await ChartsModule.setValueAsync(value);
}

const emitter = new EventEmitter(ChartsModule ?? NativeModulesProxy.Charts);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ChartsView, ChartsViewProps, ChangeEventPayload };
