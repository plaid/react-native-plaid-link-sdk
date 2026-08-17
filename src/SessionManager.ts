import {
  LayerTokenConfiguration,
  LinkEventName,
  LinkTokenConfiguration,
} from "./ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "./ReactNativePlaidLinkSdkModule";

type Subscription = ReturnType<typeof NativePlaidModule.addListener>;
type SessionKind = "link" | "layer" | "headless";
type SessionConfiguration = LinkTokenConfiguration | LayerTokenConfiguration;

interface SessionRecord {
  kind: SessionKind;
  config: SessionConfiguration;
  activated: boolean;
  terminal: boolean;
  cleanupTimeout: ReturnType<typeof setTimeout> | null;
}

const POST_SUCCESS_HANDOFF_EVENT_WINDOW_MS = 1500;
const sessions = new Map<string, SessionRecord>();

let nextSessionId = 0;
let successSub: Subscription | null = null;
let exitSub: Subscription | null = null;
let eventSub: Subscription | null = null;

function createClientSessionId(): string {
  nextSessionId += 1;
  return `plaid-session-${Date.now()}-${nextSessionId}`;
}

function clearNativeListeners() {
  successSub?.remove();
  exitSub?.remove();
  eventSub?.remove();
  successSub = null;
  exitSub = null;
  eventSub = null;
}

function ensureNativeListeners() {
  if (successSub && exitSub && eventSub) {
    return;
  }

  clearNativeListeners();
  successSub = NativePlaidModule.addListener("PlaidLink.onSuccess", (event) => {
    const record = sessions.get(event.clientSessionId);
    if (!record || record.terminal) {
      return;
    }

    if (record.kind === "link") {
      record.terminal = true;
      try {
        record.config.onSuccess(event.payload);
      } finally {
        record.cleanupTimeout = setTimeout(() => {
          removeSession(event.clientSessionId);
        }, POST_SUCCESS_HANDOFF_EVENT_WINDOW_MS);
        (record.cleanupTimeout as unknown as { unref?: () => void }).unref?.();
      }
      return;
    }

    try {
      record.config.onSuccess(event.payload);
    } finally {
      removeSession(event.clientSessionId);
    }
  });

  exitSub = NativePlaidModule.addListener("PlaidLink.onExit", (event) => {
    const record = sessions.get(event.clientSessionId);
    if (!record || record.terminal) {
      return;
    }

    try {
      record.config.onExit?.(event.payload);
    } finally {
      removeSession(event.clientSessionId);
    }
  });

  eventSub = NativePlaidModule.addListener("PlaidLink.onEvent", (event) => {
    const record = sessions.get(event.clientSessionId);
    if (!record) {
      return;
    }

    try {
      record.config.onEvent?.(event.payload);
    } finally {
      if (
        record.kind === "link" &&
        record.terminal &&
        event.payload.eventName === LinkEventName.HANDOFF
      ) {
        removeSession(event.clientSessionId);
      }
    }
  });
}

// Creating a session replaces any prior session of the same kind that was
// never activated (opened, started, or submitted). Activated sessions are
// released by their terminal callbacks, and terminal sessions are kept until
// the post-success handoff window closes.
function evictReplacedSessions(kind: SessionKind, newClientSessionId: string) {
  for (const [clientSessionId, record] of sessions) {
    if (
      clientSessionId === newClientSessionId ||
      record.kind !== kind ||
      record.activated ||
      record.terminal
    ) {
      continue;
    }

    removeSession(clientSessionId);
    NativePlaidModule.destroySession(clientSessionId).catch(() => {
      // Native cleanup is best-effort; the JS record is already removed.
    });
  }
}

export function registerSession(
  kind: SessionKind,
  config: SessionConfiguration,
): string {
  const clientSessionId = createClientSessionId();
  sessions.set(clientSessionId, {
    kind,
    config,
    activated: false,
    terminal: false,
    cleanupTimeout: null,
  });
  evictReplacedSessions(kind, clientSessionId);
  ensureNativeListeners();
  return clientSessionId;
}

export function markSessionActivated(
  clientSessionId: string,
  activated: boolean,
) {
  const record = sessions.get(clientSessionId);
  if (record) {
    record.activated = activated;
  }
}

export function removeSession(clientSessionId: string) {
  const record = sessions.get(clientSessionId);
  if (!record) {
    return;
  }

  if (record.cleanupTimeout) {
    clearTimeout(record.cleanupTimeout);
  }
  sessions.delete(clientSessionId);

  if (sessions.size === 0) {
    clearNativeListeners();
  }
}

export function resetSessionStateForTesting() {
  for (const record of sessions.values()) {
    if (record.cleanupTimeout) {
      clearTimeout(record.cleanupTimeout);
    }
  }
  sessions.clear();
  clearNativeListeners();
}
