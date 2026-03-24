import { registerWebModule, NativeModule } from 'expo';

import { ReactNativePlaidLinkSdkModuleEvents } from './ReactNativePlaidLinkSdk.types';

class ReactNativePlaidLinkSdkModule extends NativeModule<ReactNativePlaidLinkSdkModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativePlaidLinkSdkModule, 'ReactNativePlaidLinkSdkModule');
