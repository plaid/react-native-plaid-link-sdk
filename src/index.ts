import { Platform } from "react-native";

import {
  LinkExit,
  LinkEvent,
  LinkSuccess,
  LinkTokenConfiguration,
  PlaidLinkSession,
  LayerTokenConfiguration,
  PlaidLayerSession,
  PlaidHeadlessSession,
  SubmissionData,
  FinanceKitSyncBehavior,
} from "./ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "./ReactNativePlaidLinkSdkModule";

type Subscription = ReturnType<typeof NativePlaidModule.addListener>;

let successSub: Subscription | null = null;
let exitSub: Subscription | null = null;
let eventSub: Subscription | null = null;

function cleanupListeners() {
  successSub?.remove();
  exitSub?.remove();
  eventSub?.remove();
  successSub = null;
  exitSub = null;
  eventSub = null;
}

export async function createPlaidLinkSession(
  config: LinkTokenConfiguration,
): Promise<PlaidLinkSession> {
  cleanupListeners();

  successSub = NativePlaidModule.addListener(
    "PlaidLink.onSuccess",
    (success: LinkSuccess) => {
      config.onSuccess(success);
      cleanupListeners();
    },
  );

  exitSub = NativePlaidModule.addListener(
    "PlaidLink.onExit",
    (exit: LinkExit) => {
      config.onExit(exit);
      cleanupListeners();
    },
  );

  eventSub = NativePlaidModule.addListener(
    "PlaidLink.onEvent",
    (event: LinkEvent) => {
      config.onEvent(event);
    },
  );

  await NativePlaidModule.createPlaidLinkSession(config.token);

  config.onLoad?.();

  return {
    open: (fullScreen = false) => NativePlaidModule.openLinkSession(fullScreen),
  };
}

export async function createPlaidLayerSession(
  config: LayerTokenConfiguration,
): Promise<PlaidLayerSession> {
  cleanupListeners();

  successSub = NativePlaidModule.addListener(
    "PlaidLink.onSuccess",
    (success: LinkSuccess) => {
      config.onSuccess(success);
      cleanupListeners();
    },
  );

  exitSub = NativePlaidModule.addListener(
    "PlaidLink.onExit",
    (exit: LinkExit) => {
      config.onExit?.(exit);
      cleanupListeners();
    },
  );

  eventSub = NativePlaidModule.addListener(
    "PlaidLink.onEvent",
    (event: LinkEvent) => {
      config.onEvent?.(event);
    },
  );

  await NativePlaidModule.createPlaidLayerSession(config.token);

  return {
    open: () => NativePlaidModule.openLayerSession(),
    submit: (data: SubmissionData) =>
      NativePlaidModule.submitLayerData(
        data.phoneNumber,
        data.dateOfBirth,
        data.params,
      ),
  };
}

export async function createPlaidHeadlessSession(
  config: LinkTokenConfiguration,
): Promise<PlaidHeadlessSession> {
  cleanupListeners();

  successSub = NativePlaidModule.addListener(
    "PlaidLink.onSuccess",
    (success: LinkSuccess) => {
      config.onSuccess(success);
      cleanupListeners();
    },
  );

  exitSub = NativePlaidModule.addListener(
    "PlaidLink.onExit",
    (exit: LinkExit) => {
      config.onExit(exit);
      cleanupListeners();
    },
  );

  eventSub = NativePlaidModule.addListener(
    "PlaidLink.onEvent",
    (event: LinkEvent) => {
      config.onEvent(event);
    },
  );

  await NativePlaidModule.createPlaidHeadlessSession(config.token);

  if (config.onLoad) {
    config.onLoad();
  }

  return {
    start: () => NativePlaidModule.startHeadlessSession(),
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
