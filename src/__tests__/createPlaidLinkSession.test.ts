import {
  LinkSuccess,
  LinkExit,
  LinkEvent,
  LinkEventName,
} from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { createPlaidLinkSession } from "../index";

describe("createPlaidLinkSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
  });

  it("creates session with valid token and callbacks", async () => {
    const config = {
      token: "link-sandbox-token-123",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidLinkSession(config);

    expect(NativePlaidModule.createPlaidLinkSession).toHaveBeenCalledWith(
      "link-sandbox-token-123",
    );
    expect(session).toHaveProperty("open");
    expect(typeof session.open).toBe("function");
    expect(NativePlaidModule.addListener).toHaveBeenCalledTimes(3);
    expect(NativePlaidModule.addListener).toHaveBeenCalledWith(
      "PlaidLink.onSuccess",
      expect.any(Function),
    );
    expect(NativePlaidModule.addListener).toHaveBeenCalledWith(
      "PlaidLink.onExit",
      expect.any(Function),
    );
    expect(NativePlaidModule.addListener).toHaveBeenCalledWith(
      "PlaidLink.onEvent",
      expect.any(Function),
    );
  });

  it("cleans up existing listeners before creating new session", async () => {
    const config1 = {
      token: "token-1",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const config2 = {
      token: "token-2",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await createPlaidLinkSession(config1);
    const firstListenerCalls = (NativePlaidModule.addListener as jest.Mock).mock
      .calls.length;

    jest.clearAllMocks();

    await createPlaidLinkSession(config2);
    const secondListenerCalls = (NativePlaidModule.addListener as jest.Mock)
      .mock.calls.length;

    expect(firstListenerCalls).toBe(3);
    expect(secondListenerCalls).toBe(3);
  });

  it("returns session with working open method", async () => {
    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidLinkSession(config);

    await session.open(true);
    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(true);

    await session.open(false);
    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(false);

    await session.open();
    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(false);
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("onSuccess callback triggers and cleans up listeners", async () => {
    const onSuccessMock = jest.fn();
    const onExitMock = jest.fn();
    const onEventMock = jest.fn();

    const config = {
      token: "link-token",
      onSuccess: onSuccessMock,
      onExit: onExitMock,
      onEvent: onEventMock,
    };

    await createPlaidLinkSession(config);

    const mockSuccessData: LinkSuccess = {
      publicToken: "public-token-123",
      metadata: {
        accounts: [
          {
            id: "account-1",
            name: "Checking",
            mask: "1234",
            type: "depository" as any,
            subtype: "checking" as any,
          },
        ],
        linkSessionId: "session-123",
        institution: {
          id: "inst-1",
          name: "Test Bank",
        },
      },
    };

    (NativePlaidModule as any).__triggerEvent(
      "PlaidLink.onSuccess",
      mockSuccessData,
    );

    expect(onSuccessMock).toHaveBeenCalledWith(mockSuccessData);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);

    (NativePlaidModule as any).__triggerEvent("PlaidLink.onExit", {});
    expect(onExitMock).not.toHaveBeenCalled();
  });

  it("onExit callback triggers and cleans up listeners", async () => {
    const onSuccessMock = jest.fn();
    const onExitMock = jest.fn();
    const onEventMock = jest.fn();

    const config = {
      token: "link-token",
      onSuccess: onSuccessMock,
      onExit: onExitMock,
      onEvent: onEventMock,
    };

    await createPlaidLinkSession(config);

    const mockExitData: LinkExit = {
      metadata: {
        linkSessionId: "session-123",
        requestId: "request-123",
        status: "requires_credentials" as any,
      },
    };

    (NativePlaidModule as any).__triggerEvent("PlaidLink.onExit", mockExitData);

    expect(onExitMock).toHaveBeenCalledWith(mockExitData);
    expect(onExitMock).toHaveBeenCalledTimes(1);

    (NativePlaidModule as any).__triggerEvent("PlaidLink.onSuccess", {});
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it("onEvent callback triggers without cleanup", async () => {
    const onEventMock = jest.fn();

    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: onEventMock,
    };

    await createPlaidLinkSession(config);

    const mockEvent1: LinkEvent = {
      eventName: LinkEventName.OPEN,
      metadata: {
        linkSessionId: "session-123",
        viewName: "CONNECTED" as any,
        timestamp: "2026-03-27T12:00:00Z",
        metadataJson: "{}",
      },
    };

    const mockEvent2: LinkEvent = {
      eventName: LinkEventName.SELECT_INSTITUTION,
      metadata: {
        linkSessionId: "session-123",
        viewName: "SELECT_INSTITUTION" as any,
        timestamp: "2026-03-27T12:01:00Z",
        metadataJson: "{}",
      },
    };

    (NativePlaidModule as any).__triggerEvent("PlaidLink.onEvent", mockEvent1);
    (NativePlaidModule as any).__triggerEvent("PlaidLink.onEvent", mockEvent2);
    (NativePlaidModule as any).__triggerEvent("PlaidLink.onEvent", mockEvent1);

    expect(onEventMock).toHaveBeenCalledTimes(3);
    expect(onEventMock).toHaveBeenCalledWith(mockEvent1);
    expect(onEventMock).toHaveBeenCalledWith(mockEvent2);

    expect(
      (NativePlaidModule as any).__getListenerCount("PlaidLink.onEvent"),
    ).toBeGreaterThan(0);
  });

  it("handles errors from native module", async () => {
    const mockError = new Error("Native session creation failed");
    (
      NativePlaidModule.createPlaidLinkSession as jest.Mock
    ).mockRejectedValueOnce(mockError);

    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await expect(createPlaidLinkSession(config)).rejects.toThrow(
      "Native session creation failed",
    );
    expect(console.error).not.toHaveBeenCalled();
  });

  it("onLoad callback is invoked when provided", async () => {
    const onLoadMock = jest.fn();
    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
      onLoad: onLoadMock,
    };

    await createPlaidLinkSession(config);

    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onLoad is not provided", async () => {
    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await expect(createPlaidLinkSession(config)).resolves.toBeDefined();
  });

  it("does not invoke onLoad when native session creation fails", async () => {
    const onLoadMock = jest.fn();
    const mockError = new Error("Native session creation failed");
    (
      NativePlaidModule.createPlaidLinkSession as jest.Mock
    ).mockRejectedValueOnce(mockError);

    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
      onLoad: onLoadMock,
    };

    await expect(createPlaidLinkSession(config)).rejects.toThrow(
      "Native session creation failed",
    );
    expect(onLoadMock).not.toHaveBeenCalled();
  });

  it("handles errors during session creation and still returns session", async () => {
    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidLinkSession(config);

    expect(session).toBeDefined();
    expect(session.open).toBeDefined();
  });

  it("open method with no parameter defaults to false", async () => {
    const config = {
      token: "link-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidLinkSession(config);
    await session.open();

    expect(NativePlaidModule.openLinkSession).toHaveBeenCalledWith(false);
  });
});
