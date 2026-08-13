import { Platform } from "react-native";

import {
  LinkTokenConfiguration,
  PlaidLinkSession,
  LayerTokenConfiguration,
  PlaidLayerSession,
  PlaidHeadlessSession,
  SubmissionData,
  FinanceKitSyncBehavior,
} from "./ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "./ReactNativePlaidLinkSdkModule";
import { registerSession, removeSession } from "./SessionManager";

async function destroySession(clientSessionId: string): Promise<void> {
  try {
    await NativePlaidModule.destroySession(clientSessionId);
  } finally {
    removeSession(clientSessionId);
  }
}

export async function createPlaidLinkSession(
  config: LinkTokenConfiguration,
): Promise<PlaidLinkSession> {
  const clientSessionId = registerSession("link", config);

  try {
    await NativePlaidModule.createPlaidLinkSession(
      clientSessionId,
      config.token,
    );
  } catch (error) {
    removeSession(clientSessionId);
    throw error;
  }

  config.onLoad?.();

  return {
    open: (fullScreen = false) =>
      NativePlaidModule.openLinkSession(clientSessionId, fullScreen),
    destroy: () => destroySession(clientSessionId),
  };
}

export async function createPlaidLayerSession(
  config: LayerTokenConfiguration,
): Promise<PlaidLayerSession> {
  const clientSessionId = registerSession("layer", config);

  try {
    await NativePlaidModule.createPlaidLayerSession(
      clientSessionId,
      config.token,
    );
  } catch (error) {
    removeSession(clientSessionId);
    throw error;
  }

  return {
    open: () => NativePlaidModule.openLayerSession(clientSessionId),
    submit: (data: SubmissionData) =>
      NativePlaidModule.submitLayerData(
        clientSessionId,
        data.phoneNumber,
        data.dateOfBirth,
        data.params,
      ),
    destroy: () => destroySession(clientSessionId),
  };
}

export async function createPlaidHeadlessSession(
  config: LinkTokenConfiguration,
): Promise<PlaidHeadlessSession> {
  const clientSessionId = registerSession("headless", config);

  try {
    await NativePlaidModule.createPlaidHeadlessSession(
      clientSessionId,
      config.token,
    );
  } catch (error) {
    removeSession(clientSessionId);
    throw error;
  }

  if (config.onLoad) {
    config.onLoad();
  }

  return {
    start: () => NativePlaidModule.startHeadlessSession(clientSessionId),
    destroy: () => destroySession(clientSessionId),
  };
}

export async function syncFinanceKit(config: {
  token: string;
  requestAuthorizationIfNeeded?: boolean;
  syncBehavior?: FinanceKitSyncBehavior;
}): Promise<void> {
  if (Platform.OS === "android") {
    throw new Error("FinanceKit is only available on iOS");
  }

  await NativePlaidModule.syncFinanceKit(
    config.token,
    config.requestAuthorizationIfNeeded ?? true,
    config.syncBehavior ?? FinanceKitSyncBehavior.LIVE,
  );
}

export {
  PlaidEmbeddedSearchView,
  type PlaidEmbeddedSearchViewProps,
} from "./PlaidEmbeddedSearchView";
export { default } from "./ReactNativePlaidLinkSdkModule";
export * from "./ReactNativePlaidLinkSdk.types";
