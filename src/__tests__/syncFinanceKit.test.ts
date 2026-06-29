import { Platform } from "react-native";

import { FinanceKitSyncBehavior } from "../ReactNativePlaidLinkSdk.types";
import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import { syncFinanceKit } from "../index";

jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

describe("syncFinanceKit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (console.error as jest.Mock).mockClear();
    (console.log as jest.Mock).mockClear();
    (Platform as any).OS = "ios";
  });

  it("calls native module with correct parameters on iOS", async () => {
    const config = {
      token: "link-sandbox-token-123",
      requestAuthorizationIfNeeded: true,
      syncBehavior: FinanceKitSyncBehavior.LIVE,
    };

    await syncFinanceKit(config);

    expect(NativePlaidModule.syncFinanceKit).toHaveBeenCalledWith(
      "link-sandbox-token-123",
      true,
      FinanceKitSyncBehavior.LIVE,
    );
    expect(console.log).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("uses default values for optional parameters", async () => {
    const config = {
      token: "link-sandbox-token-123",
    };

    await syncFinanceKit(config);

    expect(NativePlaidModule.syncFinanceKit).toHaveBeenCalledWith(
      "link-sandbox-token-123",
      true,
      FinanceKitSyncBehavior.LIVE,
    );
  });

  it("accepts custom requestAuthorizationIfNeeded value", async () => {
    const config = {
      token: "link-sandbox-token-123",
      requestAuthorizationIfNeeded: false,
    };

    await syncFinanceKit(config);

    expect(NativePlaidModule.syncFinanceKit).toHaveBeenCalledWith(
      "link-sandbox-token-123",
      false,
      FinanceKitSyncBehavior.LIVE,
    );
  });

  it("accepts SIMULATED sync behavior", async () => {
    const config = {
      token: "link-sandbox-token-123",
      requestAuthorizationIfNeeded: true,
      syncBehavior: FinanceKitSyncBehavior.SIMULATED,
    };

    await syncFinanceKit(config);

    expect(NativePlaidModule.syncFinanceKit).toHaveBeenCalledWith(
      "link-sandbox-token-123",
      true,
      FinanceKitSyncBehavior.SIMULATED,
    );
  });

  it("throws error on Android", async () => {
    (Platform as any).OS = "android";

    const config = {
      token: "link-sandbox-token-123",
    };

    await expect(syncFinanceKit(config)).rejects.toThrow(
      "FinanceKit is only available on iOS",
    );

    expect(NativePlaidModule.syncFinanceKit).not.toHaveBeenCalled();
  });

  it("propagates native module errors", async () => {
    const nativeError = new Error("INVALID_TOKEN: Token is invalid");
    (NativePlaidModule.syncFinanceKit as jest.Mock).mockRejectedValueOnce(
      nativeError,
    );

    const config = {
      token: "invalid-token",
    };

    await expect(syncFinanceKit(config)).rejects.toThrow(
      "INVALID_TOKEN: Token is invalid",
    );
    expect(console.error).not.toHaveBeenCalled();
  });
});
