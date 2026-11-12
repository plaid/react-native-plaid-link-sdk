import { Platform } from "react-native";

import { FinanceKitStatus } from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { getFinanceKitStatus } from "../index";

jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

describe("getFinanceKitStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
    (Platform as any).OS = "ios";
  });

  it("calls the native module with no arguments on iOS", async () => {
    await getFinanceKitStatus();

    expect(NativePlaidModule.getFinanceKitStatus).toHaveBeenCalledTimes(1);
    expect(NativePlaidModule.getFinanceKitStatus).toHaveBeenCalledWith();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it.each([
    ["unavailable", FinanceKitStatus.UNAVAILABLE],
    ["notDetermined", FinanceKitStatus.NOT_DETERMINED],
    ["denied", FinanceKitStatus.DENIED],
    ["authorized", FinanceKitStatus.AUTHORIZED],
    ["unknown", FinanceKitStatus.UNKNOWN],
  ])("resolves native status %s as FinanceKitStatus", async (raw, expected) => {
    (NativePlaidModule.getFinanceKitStatus as jest.Mock).mockResolvedValueOnce(
      raw,
    );

    await expect(getFinanceKitStatus()).resolves.toBe(expected);
  });

  it("throws error on Android", async () => {
    (Platform as any).OS = "android";

    await expect(getFinanceKitStatus()).rejects.toThrow(
      "FinanceKit is only available on iOS",
    );

    expect(NativePlaidModule.getFinanceKitStatus).not.toHaveBeenCalled();
  });

  it("propagates native module errors", async () => {
    const nativeError = new Error(
      "UNSUPPORTED_IOS_VERSION: FinanceKit requires iOS 17.4 or later",
    );
    (NativePlaidModule.getFinanceKitStatus as jest.Mock).mockRejectedValueOnce(
      nativeError,
    );

    await expect(getFinanceKitStatus()).rejects.toThrow(
      "UNSUPPORTED_IOS_VERSION: FinanceKit requires iOS 17.4 or later",
    );
    expect(console.error).not.toHaveBeenCalled();
  });
});
