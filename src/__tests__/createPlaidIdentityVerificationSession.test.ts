import {
  LinkEvent,
  LinkEventName,
  LinkExit,
  LinkSuccess,
} from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { createPlaidIdentityVerificationSession } from "../index";

describe("createPlaidIdentityVerificationSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
  });

  it("creates and returns an IDV session without waiting for onLoad", async () => {
    const session = await createPlaidIdentityVerificationSession({
      token: "identity-verification-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    expect(
      NativePlaidModule.createPlaidIdentityVerificationSession,
    ).toHaveBeenCalledWith("identity-verification-token");
    expect(session).toHaveProperty("open");
    expect(NativePlaidModule.addListener).toHaveBeenCalledTimes(3);
  });

  it("opens the IDV session with the existing Link presentation API", async () => {
    const session = await createPlaidIdentityVerificationSession({
      token: "identity-verification-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    await session.open();
    await session.open(true);

    expect(NativePlaidModule.openLinkSession).toHaveBeenNthCalledWith(1, false);
    expect(NativePlaidModule.openLinkSession).toHaveBeenNthCalledWith(2, true);
  });

  it("forwards IDV success, exit, and event callbacks", async () => {
    const onSuccess = jest.fn();
    const onExit = jest.fn();
    const onEvent = jest.fn();

    await createPlaidIdentityVerificationSession({
      token: "identity-verification-token",
      onSuccess,
      onExit,
      onEvent,
    });

    const event: LinkEvent = {
      eventName: LinkEventName.IDENTITY_VERIFICATION_START_STEP,
      metadata: {
        linkSessionId: "idv-session",
        timestamp: "2026-08-28T12:00:00Z",
        metadataJson: "{}",
      },
    };
    const exit: LinkExit = {
      metadata: {
        linkSessionId: "idv-session",
        requestId: "request-id",
      },
    };

    (NativePlaidModule as any).__triggerEvent("PlaidLink.onEvent", event);
    (NativePlaidModule as any).__triggerEvent("PlaidLink.onExit", exit);

    expect(onEvent).toHaveBeenCalledWith(event);
    expect(onExit).toHaveBeenCalledWith(exit);
    expect(onSuccess).not.toHaveBeenCalled();

    await createPlaidIdentityVerificationSession({
      token: "second-identity-verification-token",
      onSuccess,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    });

    const success: LinkSuccess = {
      publicToken: "",
      metadata: {
        accounts: [],
        linkSessionId: "second-idv-session",
      },
    };
    (NativePlaidModule as any).__triggerEvent("PlaidLink.onSuccess", success);

    expect(onSuccess).toHaveBeenCalledWith(success);
  });

  it("rejects native creation errors and removes its listeners", async () => {
    (
      NativePlaidModule.createPlaidIdentityVerificationSession as jest.Mock
    ).mockRejectedValueOnce(new Error("IDV session creation failed"));

    await expect(
      createPlaidIdentityVerificationSession({
        token: "invalid-token",
        onSuccess: jest.fn(),
        onExit: jest.fn(),
        onEvent: jest.fn(),
      }),
    ).rejects.toThrow("IDV session creation failed");

    expect(
      (NativePlaidModule as any).__getListenerCount("PlaidLink.onSuccess"),
    ).toBe(0);
    expect(
      (NativePlaidModule as any).__getListenerCount("PlaidLink.onExit"),
    ).toBe(0);
    expect(
      (NativePlaidModule as any).__getListenerCount("PlaidLink.onEvent"),
    ).toBe(0);
  });
});
