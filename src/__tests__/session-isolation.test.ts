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

describe("session isolation", () => {
  beforeEach(() => {
    resetSessionStateForTesting();
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
  });

  it("routes an older session result only to the callback that created it", async () => {
    const onSuccessA = jest.fn();
    const onSuccessB = jest.fn();

    await createPlaidLinkSession({
      token: "token-a",
      onSuccess: onSuccessA,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: onSuccessB,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionA] = createdSessionIds();
    const successA = successFor("native-session-a", "public-token-a");
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successA,
      sessionA,
    );

    expect(onSuccessA).toHaveBeenCalledWith(successA);
    expect(onSuccessB).not.toHaveBeenCalled();
  });

  it("does not route callbacks across Link and Layer session types", async () => {
    const linkSuccess = jest.fn();
    const layerSuccess = jest.fn();

    await createPlaidLinkSession({
      token: "link-token",
      onSuccess: linkSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLayerSession({
      token: "layer-token",
      onSuccess: layerSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [linkSessionId, layerSessionId] = createdSessionIds();
    const linkResult = successFor("native-link-session", "link-public-token");
    const layerResult = successFor(
      "native-layer-session",
      "layer-public-token",
    );

    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      linkResult,
      linkSessionId,
    );
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      layerResult,
      layerSessionId,
    );

    expect(linkSuccess).toHaveBeenCalledWith(linkResult);
    expect(linkSuccess).not.toHaveBeenCalledWith(layerResult);
    expect(layerSuccess).toHaveBeenCalledWith(layerResult);
    expect(layerSuccess).not.toHaveBeenCalledWith(linkResult);
  });

  it("binds a retained Link session open method to its original session", async () => {
    const sessionA = await createPlaidLinkSession({
      token: "token-a",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId, sessionBId] = createdSessionIds();
    await sessionA.open(true);

    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(
      sessionAId,
      true,
    );
    expect(NativePlaidModule.openLinkSession).not.toHaveBeenCalledWith(
      sessionBId,
      true,
    );
  });

  it("binds retained Layer submission data to its original session", async () => {
    const sessionA = await createPlaidLayerSession({
      token: "layer-token-a",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLayerSession({
      token: "layer-token-b",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId, sessionBId] = createdSessionIds();
    await sessionA.submit({
      phoneNumber: "415-555-0100",
      dateOfBirth: "1975-01-18",
    });

    expect(NativePlaidModule.submitLayerData).toHaveBeenCalledWith(
      sessionAId,
      "415-555-0100",
      "1975-01-18",
      undefined,
    );
    expect(NativePlaidModule.submitLayerData).not.toHaveBeenCalledWith(
      sessionBId,
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );
  });

  it("cleans up only the session that receives a terminal callback", async () => {
    const onExitA = jest.fn();
    const onSuccessB = jest.fn();

    await createPlaidLinkSession({
      token: "token-a",
      onSuccess: jest.fn(),
      onExit: onExitA,
      onEvent: jest.fn(),
    });
    const sessionB = await createPlaidLinkSession({
      token: "token-b",
      onSuccess: onSuccessB,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId, sessionBId] = createdSessionIds();
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onExit",
      { metadata: { linkSessionId: "native-session-a" } },
      sessionAId,
    );
    await sessionB.open();
    const successB = successFor("native-session-b", "public-token-b");
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successB,
      sessionBId,
    );

    expect(onExitA).toHaveBeenCalledTimes(1);
    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(
      sessionBId,
      false,
    );
    expect(onSuccessB).toHaveBeenCalledWith(successB);
  });

  it("drops events for destroyed and unknown session identifiers", async () => {
    const onSuccessA = jest.fn();
    const onSuccessB = jest.fn();

    const sessionA = await createPlaidLinkSession({
      token: "token-a",
      onSuccess: onSuccessA,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });
    await createPlaidLinkSession({
      token: "token-b",
      onSuccess: onSuccessB,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const [sessionAId, sessionBId] = createdSessionIds();
    await sessionA.destroy();
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successFor("native-session-a", "public-token-a"),
      sessionAId,
    );
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successFor("unknown", "unknown-token"),
      "unknown-session-id",
    );

    const successB = successFor("native-session-b", "public-token-b");
    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      successB,
      sessionBId,
    );

    expect(NativePlaidModule.destroySession).toHaveBeenCalledWith(sessionAId);
    expect(onSuccessA).not.toHaveBeenCalled();
    expect(onSuccessB).toHaveBeenCalledTimes(1);
    expect(onSuccessB).toHaveBeenCalledWith(successB);
  });
});
