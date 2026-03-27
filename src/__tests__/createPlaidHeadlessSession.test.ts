import {
  LinkSuccess,
  LinkExit,
  LinkEvent,
  LinkEventName,
} from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { createPlaidHeadlessSession } from "../index";

describe("createPlaidHeadlessSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NativePlaidModule as any).__clearListeners();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
  });

  it("creates headless session with valid token and callbacks", async () => {
    const config = {
      token: "headless-token-123",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidHeadlessSession(config);

    expect(NativePlaidModule.createPlaidHeadlessSession).toHaveBeenCalledWith(
      "headless-token-123"
    );
    expect(session).toHaveProperty("start");
    expect(typeof session.start).toBe("function");
    expect(NativePlaidModule.addListener).toHaveBeenCalledTimes(3);
  });

  it("returns session with working start method", async () => {
    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    const session = await createPlaidHeadlessSession(config);

    await session.start();
    expect(NativePlaidModule.startHeadlessSession).toHaveBeenCalled();
    expect(NativePlaidModule.startHeadlessSession).toHaveBeenCalledTimes(1);
  });

  it("onSuccess callback is invoked correctly", async () => {
    const onSuccessMock = jest.fn();
    const config = {
      token: "headless-token",
      onSuccess: onSuccessMock,
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await createPlaidHeadlessSession(config);

    const mockSuccess: LinkSuccess = {
      publicToken: "public-token-789",
      metadata: {
        accounts: [],
        linkSessionId: "session-789",
      },
    };

    (NativePlaidModule as any).__triggerEvent("onSuccess", mockSuccess);
    expect(onSuccessMock).toHaveBeenCalledWith(mockSuccess);
  });

  it("onExit callback is invoked correctly", async () => {
    const onExitMock = jest.fn();
    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: onExitMock,
      onEvent: jest.fn(),
    };

    await createPlaidHeadlessSession(config);

    const mockExit: LinkExit = {
      metadata: {
        linkSessionId: "session-123",
        requestId: "request-123",
      },
    };

    (NativePlaidModule as any).__triggerEvent("onExit", mockExit);
    expect(onExitMock).toHaveBeenCalledWith(mockExit);
  });

  it("onEvent callback is invoked correctly", async () => {
    const onEventMock = jest.fn();
    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: onEventMock,
    };

    await createPlaidHeadlessSession(config);

    const mockEvent: LinkEvent = {
      eventName: LinkEventName.OPEN,
      metadata: {
        linkSessionId: "session-123",
        viewName: "CONNECTED" as any,
        timestamp: "2026-03-27T12:00:00Z",
        metadata_json: "{}",
      },
    };

    (NativePlaidModule as any).__triggerEvent("onEvent", mockEvent);
    expect(onEventMock).toHaveBeenCalledWith(mockEvent);
  });

  it("onLoad callback is invoked when provided", async () => {
    const onLoadMock = jest.fn();
    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
      onLoad: onLoadMock,
    };

    await createPlaidHeadlessSession(config);

    expect(onLoadMock).toHaveBeenCalled();
    expect(onLoadMock).toHaveBeenCalledTimes(1);
  });

  it("does not throw when onLoad is not provided", async () => {
    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await expect(createPlaidHeadlessSession(config)).resolves.toBeDefined();
  });

  it("onSuccess triggers and cleans up listeners", async () => {
    const onSuccessMock = jest.fn();
    const onExitMock = jest.fn();

    const config = {
      token: "headless-token",
      onSuccess: onSuccessMock,
      onExit: onExitMock,
      onEvent: jest.fn(),
    };

    await createPlaidHeadlessSession(config);

    const mockSuccess: LinkSuccess = {
      publicToken: "public-token-456",
      metadata: {
        accounts: [],
        linkSessionId: "session-456",
      },
    };

    (NativePlaidModule as any).__triggerEvent("onSuccess", mockSuccess);

    expect(onSuccessMock).toHaveBeenCalledWith(mockSuccess);

    (NativePlaidModule as any).__triggerEvent("onExit", {});
    expect(onExitMock).not.toHaveBeenCalled();
  });

  it("onExit triggers and cleans up listeners", async () => {
    const onSuccessMock = jest.fn();
    const onExitMock = jest.fn();

    const config = {
      token: "headless-token",
      onSuccess: onSuccessMock,
      onExit: onExitMock,
      onEvent: jest.fn(),
    };

    await createPlaidHeadlessSession(config);

    const mockExit: LinkExit = {
      metadata: {
        linkSessionId: "session-123",
        requestId: "request-123",
      },
    };

    (NativePlaidModule as any).__triggerEvent("onExit", mockExit);

    expect(onExitMock).toHaveBeenCalledWith(mockExit);

    (NativePlaidModule as any).__triggerEvent("onSuccess", {});
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it("handles errors from native module", async () => {
    const mockError = new Error("Headless session creation failed");
    (
      NativePlaidModule.createPlaidHeadlessSession as jest.Mock
    ).mockRejectedValueOnce(mockError);

    const config = {
      token: "headless-token",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
    };

    await expect(createPlaidHeadlessSession(config)).rejects.toThrow(
      "Headless session creation failed"
    );
    expect(console.error).toHaveBeenCalledWith(
      "[PlaidLink] createPlaidHeadlessSession failed:",
      mockError
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

    await createPlaidHeadlessSession(config1);
    const firstListenerCalls = (NativePlaidModule.addListener as jest.Mock).mock
      .calls.length;

    jest.clearAllMocks();

    await createPlaidHeadlessSession(config2);
    const secondListenerCalls = (NativePlaidModule.addListener as jest.Mock)
      .mock.calls.length;

    expect(firstListenerCalls).toBe(3);
    expect(secondListenerCalls).toBe(3);
  });
});
