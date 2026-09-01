import { Platform } from "react-native";

import {
  LinkExit,
  LinkEvent,
  LinkEventName,
  LinkSuccess,
  LinkTokenConfiguration,
  IdentityVerificationTokenConfiguration,
  PlaidLinkSession,
  LayerTokenConfiguration,
  PlaidLayerSession,
  PlaidHeadlessSession,
  SubmissionData,
  FinanceKitSyncBehavior,
} from "./ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "./ReactNativePlaidLinkSdkModule";

const V13_MIGRATION_GUIDE_URL =
  "https://github.com/plaid/react-native-plaid-link-sdk/blob/master/V13_MIGRATION_GUIDE.md";

/**
 * Builds a deprecated export for an API removed in v13.
 *
 * The replacement text is single-sourced: it is thrown at runtime and encoded
 * into the returned type, so `tsc` prints the exact v13 replacement instead of
 * suggesting the (incorrect) default import. Keeping one source for both
 * prevents the runtime message and the compiler diagnostic from drifting apart.
 */
function migrationDiagnostic<Replacement extends string>(
  name: string,
  replacement: Replacement,
): { readonly __migration_error__: `Removed in v13. ${Replacement}` } {
  const removed = () => {
    throw new Error(
      `${name} was removed in react-native-plaid-link-sdk v13. ${replacement} See ${V13_MIGRATION_GUIDE_URL}`,
    );
  };

  return removed as unknown as {
    readonly __migration_error__: `Removed in v13. ${Replacement}`;
  };
}

/**
 * @deprecated Removed in v13. Use `await createPlaidLinkSession(config)`, then
 * call `await session.open()` on the returned session.
 */
export const create = migrationDiagnostic(
  "create",
  "Use await createPlaidLinkSession(config), then call await session.open() on the returned session.",
);

/**
 * @deprecated Removed in v13. Call `await session.open()` on the session
 * returned by `createPlaidLinkSession(config)`.
 */
export const open = migrationDiagnostic(
  "open",
  "Call await session.open() on the session returned by createPlaidLinkSession(config). Move onSuccess, onExit, and onEvent callbacks to the create call.",
);

/**
 * @deprecated Removed in v13. Use `PlaidEmbeddedSearchView`.
 */
export const EmbeddedLinkView = migrationDiagnostic(
  "EmbeddedLinkView",
  "Use PlaidEmbeddedSearchView.",
);

/**
 * @deprecated Removed in v13. Use `await createPlaidLinkSession(config)`, then
 * call `await session.open()` on the returned session.
 */
export const openLink = migrationDiagnostic(
  "openLink",
  "Use await createPlaidLinkSession(config), then call await session.open() on the returned session.",
);

/**
 * @deprecated Removed in v13. Pass `onEvent` to the create call instead of
 * subscribing separately.
 */
export const usePlaidEmitter = migrationDiagnostic(
  "usePlaidEmitter",
  "Pass onEvent to createPlaidLinkSession(config) instead of subscribing separately.",
);

/**
 * @deprecated Removed in v13. Call `await session.submit(data)` on the session
 * returned by `createPlaidLayerSession(config)`.
 */
export const submit = migrationDiagnostic(
  "submit",
  "Call await session.submit(data) on the session returned by createPlaidLayerSession(config).",
);

/**
 * @deprecated Removed in v13. Build your own button and call
 * `await createPlaidLinkSession(config)`, then `await session.open()`.
 */
export const PlaidLink = migrationDiagnostic(
  "PlaidLink",
  "Build your own button and call await createPlaidLinkSession(config), then await session.open().",
);

/**
 * @deprecated Removed in v13. Each create call resets session state, so no
 * teardown call is needed.
 */
export const destroy = migrationDiagnostic(
  "destroy",
  "Remove the call. Each create call resets session state, so no teardown is needed.",
);

/**
 * @deprecated Removed in v13 with no replacement.
 */
export const dismissLink = migrationDiagnostic(
  "dismissLink",
  "Remove the call. There is no programmatic dismiss API in v13.",
);

/** The React Native Plaid Link SDK version reported by the native module. */
export const sdkVersion = NativePlaidModule.sdkVersion;

type Subscription = ReturnType<typeof NativePlaidModule.addListener>;

let successSub: Subscription | null = null;
let exitSub: Subscription | null = null;
let eventSub: Subscription | null = null;
let postSuccessHandoffCleanupTimeout: ReturnType<typeof setTimeout> | null =
  null;

const POST_SUCCESS_HANDOFF_EVENT_WINDOW_MS = 1500;

function clearPostSuccessHandoffCleanupTimeout() {
  if (postSuccessHandoffCleanupTimeout) {
    clearTimeout(postSuccessHandoffCleanupTimeout);
    postSuccessHandoffCleanupTimeout = null;
  }
}

function cleanupListeners(options: { keepEventListener?: boolean } = {}) {
  clearPostSuccessHandoffCleanupTimeout();
  successSub?.remove();
  exitSub?.remove();
  if (!options.keepEventListener) {
    eventSub?.remove();
    eventSub = null;
  }
  successSub = null;
  exitSub = null;
}

function cleanupAfterPostSuccessHandoffWindow() {
  postSuccessHandoffCleanupTimeout = setTimeout(() => {
    cleanupListeners();
  }, POST_SUCCESS_HANDOFF_EVENT_WINDOW_MS);
  (
    postSuccessHandoffCleanupTimeout as unknown as { unref?: () => void }
  ).unref?.();
}

export async function createPlaidLinkSession(
  config: LinkTokenConfiguration,
): Promise<PlaidLinkSession> {
  cleanupListeners();

  successSub = NativePlaidModule.addListener(
    "PlaidLink.onSuccess",
    (success: LinkSuccess) => {
      config.onSuccess(success);
      cleanupListeners({ keepEventListener: true });
      cleanupAfterPostSuccessHandoffWindow();
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
      if (
        postSuccessHandoffCleanupTimeout &&
        event.eventName === LinkEventName.HANDOFF
      ) {
        cleanupListeners();
      }
    },
  );

  await NativePlaidModule.createPlaidLinkSession(config.token);

  config.onLoad?.();

  return {
    open: (fullScreen = false) => NativePlaidModule.openLinkSession(fullScreen),
  };
}

/**
 * Creates an Identity Verification session without waiting for an onLoad
 * callback, which Identity Verification flows do not emit.
 */
export async function createPlaidIdentityVerificationSession(
  config: IdentityVerificationTokenConfiguration,
): Promise<PlaidLinkSession> {
  cleanupListeners();

  successSub = NativePlaidModule.addListener(
    "PlaidLink.onSuccess",
    (success: LinkSuccess) => {
      config.onSuccess(success);
      cleanupListeners({ keepEventListener: true });
      cleanupAfterPostSuccessHandoffWindow();
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
      if (
        postSuccessHandoffCleanupTimeout &&
        event.eventName === LinkEventName.HANDOFF
      ) {
        cleanupListeners();
      }
    },
  );

  try {
    await NativePlaidModule.createPlaidIdentityVerificationSession(
      config.token,
    );
  } catch (error) {
    cleanupListeners();
    throw error;
  }

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

/**
 * @deprecated Use the package's named exports. Use `sdkVersion` to read the SDK
 * version. The default export exposes internal native-module methods and will
 * be removed in the next major version.
 */
export default NativePlaidModule;
export * from "./ReactNativePlaidLinkSdk.types";
