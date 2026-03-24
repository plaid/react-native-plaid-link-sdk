import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativePlaidLinkSdkModuleEvents } from './ReactNativePlaidLinkSdk.types';

declare class ReactNativePlaidLinkSdkModule extends NativeModule<ReactNativePlaidLinkSdkModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePlaidLinkSdkModule>('ReactNativePlaidLinkSdk');
