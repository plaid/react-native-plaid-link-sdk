import { LinkEventName } from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { resetSessionStateForTesting } from "../SessionManager";
import { createPlaidLayerSession, createPlaidLinkSession } from "../index";

function createdSessionIds(): string[] {
  return (NativePlaidModule as any).__getCreatedSessionIds();
}

function successFor(linkSessionId: string, publicToken: string) {
  return {
    publicToken,
    metadata: {
      accounts: [],
      linkSessionId,
    },
  };
}

describe("session eviction on create", () => {
  beforeEach(() => {
    resetSessionStateForTesting();
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("evicts a never-activated session of the same kind when a new one is created", async () => {
    const onSuccessA = jest.fn();

    await createPlaidLinkSession({
      token: "token-a",
      onSuccess: onSuccessA,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId] = createdSessionIds();
    expect(NativePlaidModule.destroySession).toHaveBeenCalledWith(sessionAId);

    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successFor("native-session-a", "public-token-a"),
      sessionAId,
    );
    expect(onSuccessA).not.toHaveBeenCalled();
  });

  it("keeps an opened session when a new one of the same kind is created", async () => {
    const onSuccessA = jest.fn();

    const sessionA = await createPlaidLinkSession({
      token: "token-a",
      onSuccess: onSuccessA,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await sessionA.open();
    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId] = createdSessionIds();
    expect(NativePlaidModule.destroySession).not.toHaveBeenCalled();

    const successA = successFor("native-session-a", "public-token-a");
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successA,
      sessionAId,
    );
    expect(onSuccessA).toHaveBeenCalledWith(successA);
  });

  it("does not evict a pending session of a different kind", async () => {
    await createPlaidLinkSession({
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLayerSession({
      token: "layer-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    expect(NativePlaidModule.destroySession).not.toHaveBeenCalled();
  });

  it("makes a session evictable again when its open call fails", async () => {
    (NativePlaidModule.openLinkSession as jest.Mock).mockRejectedValueOnce(
      new Error("PLAID_SESSION_ALREADY_ACTIVE"),
    );

    const sessionA = await createPlaidLinkSession({
      token: "token-a",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await expect(sessionA.open()).rejects.toThrow(
      "PLAID_SESSION_ALREADY_ACTIVE",
    );

    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId] = createdSessionIds();
    expect(NativePlaidModule.destroySession).toHaveBeenCalledWith(sessionAId);
  });

  it("keeps a post-success session draining for handoff when a new one is created", async () => {
    jest.useFakeTimers();

    const onEventA = jest.fn();

    const sessionA = await createPlaidLinkSession({
      token: "token-a",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: onEventA,
    });
    await sessionA.open();

    const [sessionAId] = createdSessionIds();
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successFor("native-session-a", "public-token-a"),
      sessionAId,
    );

    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    expect(NativePlaidModule.destroySession).not.toHaveBeenCalled();

    const handoffEvent = {
      eventName: LinkEventName.HANDOFF,
      metadata: {
        linkSessionId: "native-session-a",
        viewName: "CONNECTED" as any,
        timestamp: "2026-03-27T12:00:00Z",
        metadataJson: "{}",
      },
    };
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onEvent",
      handoffEvent,
      sessionAId,
    );
    expect(onEventA).toHaveBeenCalledWith(handoffEvent);
  });
});
