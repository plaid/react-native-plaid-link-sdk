import { NativeModule, requireNativeModule } from "expo";

import {
  ReactNativePlaidLinkSdkModuleEvents,
  FinanceKitSyncBehavior,
} from "./ReactNativePlaidLinkSdk.types";

declare class ReactNativePlaidLinkSdkModule extends NativeModule<ReactNativePlaidLinkSdkModuleEvents> {
  sdkVersion: string;
  createPlaidLinkSession(clientSessionId: string, token: string): Promise<void>;
  createPlaidLayerSession(
    clientSessionId: string,
    token: string,
  ): Promise<void>;
  createPlaidHeadlessSession(
    clientSessionId: string,
    token: string,
  ): Promise<void>;
  openLinkSession(clientSessionId: string, fullScreen: boolean): Promise<void>;
  openLayerSession(clientSessionId: string): Promise<void>;
  startHeadlessSession(clientSessionId: string): Promise<void>;
  submitLayerData(
    clientSessionId: string,
    phoneNumber?: string,
    dateOfBirth?: string,
    params?: Record<string, string>,
  ): Promise<void>;
  destroySession(clientSessionId: string): Promise<void>;
  syncFinanceKit(
    token: string,
    requestAuthorizationIfNeeded: boolean,
    syncBehavior: FinanceKitSyncBehavior,
  ): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativePlaidLinkSdkModule>(
  "ReactNativePlaidLinkSdk",
);
