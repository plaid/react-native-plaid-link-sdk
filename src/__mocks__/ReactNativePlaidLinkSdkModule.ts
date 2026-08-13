const mockListeners: Record<string, Function[]> = {
  "PlaidLink.onSuccess": [],
  "PlaidLink.onExit": [],
  "PlaidLink.onEvent": [],
};
const mockCreatedSessionIds: string[] = [];

const mockNativeModule = {
  sdkVersion: "13.0.4",

  createPlaidLinkSession: jest.fn((clientSessionId: string, token: string) => {
    mockCreatedSessionIds.push(clientSessionId);
    return Promise.resolve();
  }),

  createPlaidLayerSession: jest.fn((clientSessionId: string, token: string) => {
    mockCreatedSessionIds.push(clientSessionId);
    return Promise.resolve();
  }),

  createPlaidHeadlessSession: jest.fn(
    (clientSessionId: string, token: string) => {
      mockCreatedSessionIds.push(clientSessionId);
      return Promise.resolve();
    },
  ),

  openLinkSession: jest.fn((clientSessionId: string, fullScreen: boolean) =>
    Promise.resolve(),
  ),

  openLayerSession: jest.fn((clientSessionId: string) => Promise.resolve()),

  startHeadlessSession: jest.fn((clientSessionId: string) => Promise.resolve()),

  submitLayerData: jest.fn(
    (
      clientSessionId: string,
      phone?: string,
      dob?: string,
      params?: Record<string, string>,
    ) => Promise.resolve(),
  ),

  destroySession: jest.fn((clientSessionId: string) => Promise.resolve()),

  syncFinanceKit: jest.fn(
    (
      token: string,
      requestAuthorizationIfNeeded: boolean,
      syncBehavior: number,
    ) => Promise.resolve(),
  ),

  addListener: jest
    .fn()
    .mockImplementation((eventName: string, callback: Function) => {
      mockListeners[eventName] = mockListeners[eventName] || [];
      mockListeners[eventName].push(callback);

      return {
        remove: jest.fn(() => {
          const index = mockListeners[eventName].indexOf(callback);
          if (index > -1) {
            mockListeners[eventName].splice(index, 1);
          }
        }),
      };
    }),

  __triggerEvent: (
    eventName: string,
    data: any,
    clientSessionId = mockCreatedSessionIds[mockCreatedSessionIds.length - 1],
  ) => {
    const listeners = mockListeners[eventName] || [];
    listeners.forEach((callback) =>
      callback({
        clientSessionId,
        payload: data,
      }),
    );
  },

  __clearListeners: () => {
    mockListeners["PlaidLink.onSuccess"] = [];
    mockListeners["PlaidLink.onExit"] = [];
    mockListeners["PlaidLink.onEvent"] = [];
    mockCreatedSessionIds.length = 0;
  },

  __getCreatedSessionIds: () => [...mockCreatedSessionIds],

  __getListenerCount: (eventName: string) => {
    return mockListeners[eventName]?.length || 0;
  },
};

export default mockNativeModule;
