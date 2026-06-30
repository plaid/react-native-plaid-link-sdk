const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const source = process.argv[2] && path.resolve(process.argv[2]);
const destination = process.argv[3] && path.resolve(process.argv[3]);
const force = process.argv.includes("--force");

function fail(message) {
  console.error(`LinkKit Catalyst strip failed: ${message}`);
  process.exit(1);
}

function usage() {
  console.error(
    [
      "Usage:",
      "  node scripts/strip-linkkit-maccatalyst.js <source-xcframework> <destination-xcframework> [--force]",
      "",
      "Example:",
      "  node scripts/strip-linkkit-maccatalyst.js /tmp/LinkKit.xcframework ios/Frameworks/LinkKit.xcframework --force",
    ].join("\n")
  );
}

function readPlist(plistPath) {
  const output = execFileSync("plutil", [
    "-convert",
    "json",
    "-o",
    "-",
    plistPath,
  ]).toString("utf8");

  return JSON.parse(output);
}

function removeMetadataFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.name === ".DS_Store" || entry.name === "__MACOSX") {
      fs.rmSync(entryPath, { recursive: true, force: true });
      continue;
    }

    if (entry.isDirectory()) {
      removeMetadataFiles(entryPath);
    }
  }
}

if (!source || !destination) {
  usage();
  process.exit(1);
}

if (!fs.existsSync(source)) {
  fail(`source XCFramework does not exist: ${source}`);
}

if (source === destination) {
  fail("source and destination must be different paths.");
}

if (fs.existsSync(destination)) {
  if (!force) {
    fail(
      `destination already exists: ${destination}. Pass --force to replace it.`
    );
  }

  fs.rmSync(destination, { recursive: true, force: true });
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, {
  recursive: true,
  dereference: false,
  preserveTimestamps: true,
});

removeMetadataFiles(destination);

const infoPlistPath = path.join(destination, "Info.plist");
const plist = readPlist(infoPlistPath);
const availableLibraries = plist.AvailableLibraries || [];
const keptLibraries = availableLibraries.filter(
  (library) =>
    library.LibraryIdentifier !== "ios-arm64_x86_64-maccatalyst" &&
    library.SupportedPlatformVariant !== "maccatalyst"
);
const removedLibraries = availableLibraries.filter(
  (library) => !keptLibraries.includes(library)
);

if (removedLibraries.length === 0) {
  console.warn("No Mac Catalyst slice was present in the source XCFramework.");
}

for (const library of removedLibraries) {
  fs.rmSync(path.join(destination, library.LibraryIdentifier), {
    recursive: true,
    force: true,
  });
}

execFileSync("plutil", [
  "-replace",
  "AvailableLibraries",
  "-json",
  JSON.stringify(keptLibraries),
  infoPlistPath,
]);

execFileSync(
  "node",
  [path.join(__dirname, "validate-linkkit-xcframework.js"), destination],
  {
    stdio: "inherit",
  }
);

console.log(`Wrote iOS-only LinkKit XCFramework to ${destination}`);
