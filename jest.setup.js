jest.mock('./src/ReactNativePlaidLinkSdkModule');

global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
};
