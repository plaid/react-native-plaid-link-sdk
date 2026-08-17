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
import {
  markSessionActivated,
  registerSession,
  removeSession,
} from "./SessionManager";

async function destroySession(clientSessionId: string): Promise<void> {
  try {
    await NativePlaidModule.destroySession(clientSessionId);
  } finally {
    removeSession(clientSessionId);
  }
}

// Activation is marked before the native call so an in-flight open cannot be
// evicted by a concurrent create, and reverted on failure so the session
// becomes replaceable again.
async function activateSession(
  clientSessionId: string,
  action: () => Promise<void>,
): Promise<void> {
  markSessionActivated(clientSessionId, true);
  try {
    await action();
  } catch (error) {
    markSessionActivated(clientSessionId, false);
    throw error;
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
      activateSession(clientSessionId, () =>
        NativePlaidModule.openLinkSession(clientSessionId, fullScreen),
      ),
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
    open: () =>
      activateSession(clientSessionId, () =>
        NativePlaidModule.openLayerSession(clientSessionId),
      ),
    submit: (data: SubmissionData) =>
      activateSession(clientSessionId, () =>
        NativePlaidModule.submitLayerData(
          clientSessionId,
          data.phoneNumber,
          data.dateOfBirth,
          data.params,
        ),
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
    start: () =>
      activateSession(clientSessionId, () =>
        NativePlaidModule.startHeadlessSession(clientSessionId),
      ),
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
