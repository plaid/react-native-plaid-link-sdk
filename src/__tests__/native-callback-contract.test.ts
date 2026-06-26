import fs from "fs";
import path from "path";

const { getReactNativeEnumValues } = require("../../scripts/extract-rn-enums");

const repoRoot = path.resolve(__dirname, "..", "..");

const contract = {
  success: ["metadata", "publicToken"],
  successMetadata: ["accounts", "institution", "linkSessionId", "metadataJson"],
  exit: ["error", "metadata"],
  exitMetadata: [
    "institution",
    "linkSessionId",
    "metadataJson",
    "requestId",
    "status",
  ],
  error: [
    "displayMessage",
    "errorCode",
    "errorJson",
    "errorMessage",
    "errorType",
  ],
  event: ["eventName", "metadata"],
  eventMetadata: [
    "accountNumberMask",
    "errorCode",
    "errorMessage",
    "errorType",
    "exitStatus",
    "institutionId",
    "institutionName",
    "institutionSearchQuery",
    "isUpdateMode",
    "issueDescription",
    "issueDetectedAt",
    "issueId",
    "linkSessionId",
    "matchReason",
    "metadataJson",
    "mfaType",
    "requestId",
    "routingNumber",
    "selection",
    "timestamp",
    "viewName",
  ],
  institution: ["id", "name"],
  account: ["id", "mask", "name", "subtype", "type", "verificationStatus"],
};

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function extractCurlyBlock(source: string, marker: string): string {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find ${marker}`);
  }

  const start = source.indexOf("{", markerIndex);
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Could not read block for ${marker}`);
}

function extractSwiftKeys(block: string, targetDepth: number): string[] {
  const keys = new Set<string>();
  let depth = 0;

  for (const line of block.split("\n")) {
    const keyMatch = line.match(/"([^"]+)":/);
    if (keyMatch && depth === targetDepth) {
      keys.add(keyMatch[1]);
    }

    for (const char of line) {
      if (char === "[") {
        depth += 1;
      } else if (char === "]") {
        depth -= 1;
      }
    }
  }

  return [...keys].sort();
}

function extractKotlinFunctionKeys(
  source: string,
  functionName: string,
): string[] {
  const markerIndex = source.indexOf(`fun ${functionName}`);
  if (markerIndex === -1) {
    throw new Error(`Could not find fun ${functionName}`);
  }

  const nextFunctionIndex = source.indexOf("\n\ninternal fun", markerIndex + 1);
  const block = source.slice(
    markerIndex,
    nextFunctionIndex === -1 ? source.length : nextFunctionIndex,
  );

  return [...block.matchAll(/"([^"]+)"\s+to/g)].map((match) => match[1]).sort();
}

function extractSwiftEnumCases(source: string, enumName: string): string[] {
  const block = extractCurlyBlock(source, `public enum ${enumName}`);
  return [...block.matchAll(/^\s+case\s+([A-Za-z][A-Za-z0-9]*)/gm)]
    .map((match) => match[1])
    .filter((caseName) => caseName !== "unknown")
    .map(swiftCaseToConstant)
    .sort();
}

function swiftCaseToConstant(caseName: string): string {
  return caseName
    .replace(/AutoFill/g, "Autofill")
    .replace(/TOS/g, "Tos")
    .replace(/MFA/g, "Mfa")
    .replace(/OTP/g, "Otp")
    .replace(/OAuth/g, "Oauth")
    .replace(/UI/g, "Ui")
    .replace(/SMS/g, "Sms")
    .replace(/CRA/g, "Cra")
    .replace(/KYC/g, "Kyc")
    .replace(/IDV/g, "Idv")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toUpperCase();
}

describe("native callback payload contract", () => {
  const iosSource = readRepoFile("ios/src/ReactNativePlaidLinkSdkModule.swift");
  const androidSource = readRepoFile(
    "android/src/main/java/expo/modules/plaidlinksdk/PlaidResultMappers.kt",
  );

  it("keeps iOS callback dictionary keys aligned with the RN contract", () => {
    const success = extractCurlyBlock(iosSource, "extension LinkSuccess");
    const exit = extractCurlyBlock(iosSource, "extension LinkExit");
    const event = extractCurlyBlock(iosSource, "extension LinkEvent");

    expect(extractSwiftKeys(success, 1)).toEqual(contract.success);
    expect(extractSwiftKeys(success, 2)).toEqual(contract.successMetadata);
    expect(extractSwiftKeys(exit, 1)).toEqual(contract.exit);
    expect(extractSwiftKeys(exit, 2)).toEqual(contract.exitMetadata);
    expect(extractSwiftKeys(event, 1)).toEqual(contract.event);
    expect(
      extractSwiftKeys(
        extractCurlyBlock(iosSource, "extension EventMetadata"),
        1,
      ),
    ).toEqual(contract.eventMetadata);
    expect(
      extractSwiftKeys(
        extractCurlyBlock(iosSource, "extension Institution"),
        1,
      ),
    ).toEqual(contract.institution);
    expect(
      extractSwiftKeys(extractCurlyBlock(iosSource, "extension Account"), 1),
    ).toEqual(contract.account);
    expect(
      extractSwiftKeys(extractCurlyBlock(iosSource, "extension ExitError"), 1),
    ).toEqual(contract.error);
  });

  it("keeps Android callback mapper keys aligned with the RN contract", () => {
    expect(extractKotlinFunctionKeys(androidSource, "successPayload")).toEqual(
      contract.success,
    );
    expect(
      extractKotlinFunctionKeys(androidSource, "successMetadataPayload"),
    ).toEqual(contract.successMetadata);
    expect(extractKotlinFunctionKeys(androidSource, "exitPayload")).toEqual(
      contract.exit,
    );
    expect(
      extractKotlinFunctionKeys(androidSource, "exitMetadataPayload"),
    ).toEqual(contract.exitMetadata);
    expect(extractKotlinFunctionKeys(androidSource, "errorPayload")).toEqual(
      contract.error,
    );
    expect(extractKotlinFunctionKeys(androidSource, "eventPayload")).toEqual(
      contract.event,
    );
    expect(
      extractKotlinFunctionKeys(androidSource, "eventMetadataPayload"),
    ).toEqual(contract.eventMetadata);
    expect(
      extractKotlinFunctionKeys(androidSource, "institutionPayload"),
    ).toEqual(contract.institution);
    expect(extractKotlinFunctionKeys(androidSource, "accountPayload")).toEqual(
      contract.account,
    );
  });
});

describe("native SDK enum drift", () => {
  it("includes every event and view name exposed by bundled iOS LinkKit", () => {
    const swiftInterface = readRepoFile(
      "ios/Frameworks/LinkKit.xcframework/ios-arm64_x86_64-simulator/LinkKit.framework/Modules/LinkKit.swiftmodule/x86_64-apple-ios-simulator.swiftinterface",
    );
    const rnValues = getReactNativeEnumValues(repoRoot);

    expect(rnValues.eventNames).toEqual(
      expect.arrayContaining(
        extractSwiftEnumCases(swiftInterface, "EventName"),
      ),
    );
    expect(rnValues.viewNames).toEqual(
      expect.arrayContaining(extractSwiftEnumCases(swiftInterface, "ViewName")),
    );
  });
});
