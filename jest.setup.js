jest.mock("./src/ReactNativePlaidLinkSdkModule");

const originalConsoleWarn = console.warn;
const ignoredWarningPatterns = [
  "An error occurred while requiring the 'ExpoModulesCoreJSLogger' module",
  "An error occurred while requiring the 'ReactNativePlaidLinkSdk' module",
];

global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
  warn: (...args) => {
    const message = String(args[0] ?? "");

    if (ignoredWarningPatterns.some((pattern) => message.includes(pattern))) {
      return;
    }

    originalConsoleWarn(...args);
  },
};
