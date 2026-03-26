import NativePlaidModule from "./ReactNativePlaidLinkSdkModule";
import {
  LinkExit,
  LinkEvent,
  LinkSuccess,
  LinkTokenConfiguration,
  PlaidLinkSession,
  LayerTokenConfiguration,
  PlaidLayerSession,
  SubmissionData,
} from "./ReactNativePlaidLinkSdk.types";

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

    successSub = NativePlaidModule.addListener(
      "onSuccess",
      (success: LinkSuccess) => {
        config.onSuccess(success);
        cleanupListeners();
      }
    );

    exitSub = NativePlaidModule.addListener("onExit", (exit: LinkExit) => {
      config.onExit?.(exit);
      cleanupListeners();
    });

    eventSub = NativePlaidModule.addListener("onEvent", (event: LinkEvent) => {
      config.onEvent?.(event);
    });

    await NativePlaidModule.createPlaidLayerSession(config.token);

    console.log("[PlaidLink] createPlaidLayerSession - returning session");

    return {
      open: () => {
        console.log("[PlaidLink] layer open called");
        return NativePlaidModule.openLinkSession(false);
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

// Backwards compatibility alias
export const create = createPlaidLinkSession;

export { default } from "./ReactNativePlaidLinkSdkModule";
export { default as ReactNativePlaidLinkSdkView } from "./ReactNativePlaidLinkSdkView";
export * from "./ReactNativePlaidLinkSdk.types";
