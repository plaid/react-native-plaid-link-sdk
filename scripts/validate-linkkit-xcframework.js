const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const xcframeworkPath = path.resolve(
  process.argv[2] || path.join(root, "ios/Frameworks/LinkKit.xcframework")
);
const expectedTeamId = process.env.LINKKIT_EXPECTED_TEAM_ID || "Z2P2MSMY87";
const expectedSlices = [
  {
    identifier: "ios-arm64",
    variant: undefined,
    binaryPath: "LinkKit.framework/LinkKit",
  },
  {
    identifier: "ios-arm64_x86_64-simulator",
    variant: "simulator",
    binaryPath: "LinkKit.framework/LinkKit",
  },
];

function fail(message) {
  console.error(`LinkKit XCFramework validation failed: ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
  });

  return {
    status: result.status,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
  };
}

function runOrFail(command, args) {
  const result = run(command, args);

  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed:\n${result.output}`);
  }

  return result.output;
}

function readPlist(plistPath) {
  const output = runOrFail("plutil", [
    "-convert",
    "json",
    "-o",
    "-",
    plistPath,
  ]);
  return JSON.parse(output);
}

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function assertNoMetadataFiles() {
  const metadataFile = walkFiles(xcframeworkPath).find((file) => {
    const relativePath = path.relative(xcframeworkPath, file);
    return (
      path.basename(file) === ".DS_Store" ||
      relativePath.split(path.sep).includes("__MACOSX")
    );
  });

  if (metadataFile) {
    fail(`unexpected metadata file exists: ${metadataFile}`);
  }
}

function assertExpectedSlices(plist) {
  const availableLibraries = plist.AvailableLibraries || [];
  const actualIdentifiers = availableLibraries.map(
    (library) => library.LibraryIdentifier
  );
  const expectedIdentifiers = expectedSlices.map((slice) => slice.identifier);

  if (
    actualIdentifiers.length !== expectedIdentifiers.length ||
    !expectedIdentifiers.every((identifier) =>
      actualIdentifiers.includes(identifier)
    )
  ) {
    fail(
      `expected slices ${expectedIdentifiers.join(
        ", "
      )}; found ${actualIdentifiers.join(", ")}`
    );
  }

  const catalystSlice = availableLibraries.find(
    (library) =>
      library.LibraryIdentifier.includes("maccatalyst") ||
      library.SupportedPlatformVariant === "maccatalyst"
  );

  if (catalystSlice) {
    fail(
      `unsupported Catalyst slice found: ${catalystSlice.LibraryIdentifier}`
    );
  }

  for (const expectedSlice of expectedSlices) {
    const slice = availableLibraries.find(
      (library) => library.LibraryIdentifier === expectedSlice.identifier
    );

    if (!slice) {
      fail(`missing expected slice: ${expectedSlice.identifier}`);
    }

    if (slice.SupportedPlatform !== "ios") {
      fail(
        `${expectedSlice.identifier} must support ios, found ${slice.SupportedPlatform}`
      );
    }

    if (slice.SupportedPlatformVariant !== expectedSlice.variant) {
      fail(
        `${expectedSlice.identifier} variant must be ${
          expectedSlice.variant || "unset"
        }, found ${slice.SupportedPlatformVariant || "unset"}`
      );
    }

    if (slice.BinaryPath !== expectedSlice.binaryPath) {
      fail(
        `${expectedSlice.identifier} binary path must be ${expectedSlice.binaryPath}, found ${slice.BinaryPath}`
      );
    }

    const frameworkPath = path.join(
      xcframeworkPath,
      slice.LibraryIdentifier,
      slice.LibraryPath
    );
    const binaryPath = path.join(
      xcframeworkPath,
      slice.LibraryIdentifier,
      slice.BinaryPath
    );

    if (!fs.existsSync(frameworkPath)) {
      fail(`missing framework directory: ${frameworkPath}`);
    }

    if (!fs.existsSync(binaryPath)) {
      fail(`missing LinkKit binary: ${binaryPath}`);
    }

    assertDynamicBinary(binaryPath);
    assertCodeSignature(frameworkPath);
  }

  const catalystPath = path.join(
    xcframeworkPath,
    "ios-arm64_x86_64-maccatalyst"
  );

  if (fs.existsSync(catalystPath)) {
    fail(`unsupported Catalyst directory exists: ${catalystPath}`);
  }
}

function assertDynamicBinary(binaryPath) {
  const fileOutput = runOrFail("file", [binaryPath]);

  if (!fileOutput.includes("dynamically linked shared library")) {
    fail(`LinkKit binary must be dynamic: ${fileOutput}`);
  }

  const otoolOutput = runOrFail("otool", ["-hv", binaryPath]);

  if (!otoolOutput.includes("DYLIB")) {
    fail(`LinkKit Mach-O filetype must be DYLIB:\n${otoolOutput}`);
  }
}

function assertCodeSignature(frameworkPath) {
  const details = runOrFail("codesign", ["-dv", "--verbose=4", frameworkPath]);

  if (!details.includes("CodeDirectory")) {
    fail(`missing CodeDirectory in signature details for ${frameworkPath}`);
  }

  if (!details.includes(`TeamIdentifier=${expectedTeamId}`)) {
    fail(
      `expected TeamIdentifier=${expectedTeamId} in signature details for ${frameworkPath}`
    );
  }

  if (!details.includes("Sealed Resources")) {
    fail(`missing sealed resources in signature details for ${frameworkPath}`);
  }

  const verification = run("codesign", [
    "--verify",
    "--deep",
    "--strict",
    "--verbose=4",
    frameworkPath,
  ]);

  if (verification.status === 0) {
    return;
  }

  if (verification.output.includes("CSSMERR_TP_NOT_TRUSTED")) {
    console.warn(
      `codesign trust check unavailable for ${frameworkPath}; signature payload and sealed resources are present.`
    );
    return;
  }

  fail(
    `codesign verification failed for ${frameworkPath}:\n${verification.output}`
  );
}

if (!fs.existsSync(xcframeworkPath)) {
  fail(`missing XCFramework: ${xcframeworkPath}`);
}

const plist = readPlist(path.join(xcframeworkPath, "Info.plist"));
assertNoMetadataFiles();
assertExpectedSlices(plist);

console.log(`LinkKit XCFramework is valid: ${xcframeworkPath}`);
