const mockListeners: Record<string, Function[]> = {
  "PlaidLink.onSuccess": [],
  "PlaidLink.onExit": [],
  "PlaidLink.onEvent": [],
};

const mockNativeModule = {
  sdkVersion: "13.0.3",

  createPlaidLinkSession: jest.fn(() => Promise.resolve()),

  createPlaidLayerSession: jest.fn(() => Promise.resolve()),

  createPlaidHeadlessSession: jest.fn(() => Promise.resolve()),

  openLinkSession: jest.fn((fullScreen: boolean) => Promise.resolve()),

  openLayerSession: jest.fn(() => Promise.resolve()),

  startHeadlessSession: jest.fn(() => Promise.resolve()),

  submitLayerData: jest.fn(
    (phone?: string, dob?: string, params?: Record<string, string>) =>
      Promise.resolve(),
  ),

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

  __triggerEvent: (eventName: string, data: any) => {
    const listeners = mockListeners[eventName] || [];
    listeners.forEach((callback) => callback(data));
  },

  __clearListeners: () => {
    mockListeners["PlaidLink.onSuccess"] = [];
    mockListeners["PlaidLink.onExit"] = [];
    mockListeners["PlaidLink.onEvent"] = [];
  },

  __getListenerCount: (eventName: string) => {
    return mockListeners[eventName]?.length || 0;
  },
};

export default mockNativeModule;
