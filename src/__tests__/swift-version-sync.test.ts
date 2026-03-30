import fs from "fs";
import path from "path";
import packageJson from "../../package.json";

describe("Swift Version Sync", () => {
  it("RNPlaidLinkSdkVersion.swift should match package.json version", () => {
    const swiftFilePath = path.join(
      __dirname,
      "../../ios/src/RNPlaidLinkSdkVersion.swift"
    );
    const swiftContent = fs.readFileSync(swiftFilePath, "utf-8");

    // Extract version from: @objc public static let sdkVersion: String = "X.X.X"
    const versionMatch = swiftContent.match(
      /sdkVersion:\s*String\s*=\s*"([^"]+)"/
    );

    expect(versionMatch).not.toBeNull();

    if (!versionMatch) {
      fail(
        "Could not find sdkVersion in RNPlaidLinkSdkVersion.swift. " +
          'Expected format: @objc public static let sdkVersion: String = "X.X.X"'
      );
      return;
    }

    const swiftVersion = versionMatch[1];
    const packageVersion = packageJson.version;

    expect(swiftVersion).toBe(packageVersion);
  });

  it("Swift version should be a valid semver string", () => {
    const swiftFilePath = path.join(
      __dirname,
      "../../ios/src/RNPlaidLinkSdkVersion.swift"
    );
    const swiftContent = fs.readFileSync(swiftFilePath, "utf-8");

    const versionMatch = swiftContent.match(
      /sdkVersion:\s*String\s*=\s*"([^"]+)"/
    );

    if (!versionMatch) {
      fail("Could not find sdkVersion in Swift file");
      return;
    }

    const swiftVersion = versionMatch[1];
    const semverRegex = /^\d+\.\d+\.\d+/;

    expect(swiftVersion).toMatch(semverRegex);
  });
});
