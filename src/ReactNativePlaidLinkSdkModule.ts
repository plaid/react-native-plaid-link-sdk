import { NativeModule, requireNativeModule } from "expo";

import {
  ReactNativePlaidLinkSdkModuleEvents,
  FinanceKitSyncBehavior,
} from "./ReactNativePlaidLinkSdk.types";

declare class ReactNativePlaidLinkSdkModule extends NativeModule<ReactNativePlaidLinkSdkModuleEvents> {
  sdkVersion: string;
  createPlaidLinkSession(token: string): Promise<void>;
  createPlaidLayerSession(token: string): Promise<void>;
  createPlaidHeadlessSession(token: string): Promise<void>;
  openLinkSession(fullScreen: boolean): Promise<void>;
  openLayerSession(): Promise<void>;
  startHeadlessSession(): Promise<void>;
  submitLayerData(
    phoneNumber?: string,
    dateOfBirth?: string,
    params?: Record<string, string>
  ): Promise<void>;
  syncFinanceKit(
    token: string,
    requestAuthorizationIfNeeded: boolean,
    syncBehavior: FinanceKitSyncBehavior
  ): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePlaidLinkSdkModule>(
  "ReactNativePlaidLinkSdk"
);
