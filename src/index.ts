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
  config: LinkTokenConfiguration
): Promise<PlaidLinkSession> {
  try {
    cleanupListeners();

    successSub = NativePlaidModule.addListener(
      "onSuccess",
      (success: LinkSuccess) => {
        config.onSuccess(success);
        cleanupListeners();
      }
    );

    exitSub = NativePlaidModule.addListener("onExit", (exit: LinkExit) => {
      config.onExit(exit);
      cleanupListeners();
    });

    eventSub = NativePlaidModule.addListener("onEvent", (event: LinkEvent) => {
      config.onEvent(event);
    });

    await NativePlaidModule.createPlaidLinkSession(config.token);

    console.log("[PlaidLink] createPlaidLinkSession - returning session");

    return {
      open: (fullScreen = false) => {
        console.log("[PlaidLink] open called", fullScreen);
        return NativePlaidModule.openLinkSession(fullScreen);
      },
    };
  } catch (e) {
    console.error("[PlaidLink] createPlaidLinkSession failed:", e);
    throw e;
  }
}

export async function createPlaidLayerSession(
  config: LayerTokenConfiguration
): Promise<PlaidLayerSession> {
  try {
    cleanupListeners();

    console.log("[PlaidLink] createPlaidLayerSession - setting up listeners");
    console.log(
      "[PlaidLink] onEvent callback provided:",
      typeof config.onEvent
    );

    successSub = NativePlaidModule.addListener(
      "onSuccess",
      (success: LinkSuccess) => {
        console.log("[PlaidLink] JS received onSuccess event");
        config.onSuccess(success);
        cleanupListeners();
      }
    );

    exitSub = NativePlaidModule.addListener("onExit", (exit: LinkExit) => {
      console.log("[PlaidLink] JS received onExit event");
      config.onExit?.(exit);
      cleanupListeners();
    });

    eventSub = NativePlaidModule.addListener("onEvent", (event: LinkEvent) => {
      console.log("[PlaidLink] JS received onEvent:", event.eventName);
      config.onEvent?.(event);
    });

    console.log("[PlaidLink] Listeners registered, creating native session");
    await NativePlaidModule.createPlaidLayerSession(config.token);

    console.log("[PlaidLink] createPlaidLayerSession - returning session");

    return {
      open: () => {
        console.log("[PlaidLink] layer open called");
        return NativePlaidModule.openLayerSession();
      },
      submit: (data: SubmissionData) => {
        console.log("[PlaidLink] layer submit called", data);
        return NativePlaidModule.submitLayerData(
          data.phoneNumber,
          data.dateOfBirth,
          data.params
        );
      },
    };
  } catch (e) {
    console.error("[PlaidLink] createPlaidLayerSession failed:", e);
    throw e;
  }
}

export async function createPlaidHeadlessSession(
  config: LinkTokenConfiguration
): Promise<PlaidHeadlessSession> {
  try {
    cleanupListeners();

    console.log(
      "[PlaidLink] createPlaidHeadlessSession - setting up listeners"
    );

    successSub = NativePlaidModule.addListener(
      "onSuccess",
      (success: LinkSuccess) => {
        console.log("[PlaidLink] JS received onSuccess event");
        config.onSuccess(success);
        cleanupListeners();
      }
    );

    exitSub = NativePlaidModule.addListener("onExit", (exit: LinkExit) => {
      console.log("[PlaidLink] JS received onExit event");
      config.onExit(exit);
      cleanupListeners();
    });

    eventSub = NativePlaidModule.addListener("onEvent", (event: LinkEvent) => {
      console.log("[PlaidLink] JS received onEvent:", event.eventName);
      config.onEvent(event);
    });

    console.log(
      "[PlaidLink] Listeners registered, creating native headless session"
    );
    await NativePlaidModule.createPlaidHeadlessSession(config.token);

    console.log("[PlaidLink] createPlaidHeadlessSession - returning session");

    if (config.onLoad) {
      config.onLoad();
    }

    return {
      start: () => {
        console.log("[PlaidLink] headless start called");
        return NativePlaidModule.startHeadlessSession();
      },
    };
  } catch (e) {
    console.error("[PlaidLink] createPlaidHeadlessSession failed:", e);
    throw e;
  }
}

export async function syncFinanceKit(config: {
  token: string;
  requestAuthorizationIfNeeded?: boolean;
  syncBehavior?: FinanceKitSyncBehavior;
}): Promise<void> {
  if (Platform.OS === "android") {
    throw new Error("FinanceKit is only available on iOS");
  }

  try {
    console.log("[PlaidLink] syncFinanceKit called");
    await NativePlaidModule.syncFinanceKit(
      config.token,
      config.requestAuthorizationIfNeeded ?? true,
      config.syncBehavior ?? FinanceKitSyncBehavior.LIVE
    );
    console.log("[PlaidLink] syncFinanceKit completed successfully");
  } catch (e) {
    console.error("[PlaidLink] syncFinanceKit failed:", e);
    throw e;
  }
}

export {
  PlaidEmbeddedSearchView,
  type PlaidEmbeddedSearchViewProps,
} from "./PlaidEmbeddedSearchView";
export { default } from "./ReactNativePlaidLinkSdkModule";
export * from "./ReactNativePlaidLinkSdk.types";
