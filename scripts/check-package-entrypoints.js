const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const packageJsonPath = path.join(root, "package.json");
const packageJson = require(packageJsonPath);

function fail(message) {
  console.error(`Package entrypoint check failed: ${message}`);
  process.exit(1);
}

function assertPackageFieldExists(fieldName) {
  const fieldValue = packageJson[fieldName];

  if (typeof fieldValue !== "string" || fieldValue.length === 0) {
    fail(`package.json field "${fieldName}" must be a non-empty string.`);
  }

  const absolutePath = path.join(root, fieldValue);

  if (!fs.existsSync(absolutePath)) {
    fail(
      `package.json field "${fieldName}" points to a missing file: ${fieldValue}`
    );
  }

  return fieldValue;
}

function assertPackageMetadata() {
  const rootExport = packageJson.exports && packageJson.exports["."];

  if (!rootExport || typeof rootExport !== "object") {
    fail(
      'package.json must define exports["."] for the public root entrypoint.'
    );
  }

  if (rootExport.types !== `./${packageJson.types}`) {
    fail(`exports["."].types must point to ./${packageJson.types}.`);
  }

  for (const condition of ["react-native", "import", "require", "default"]) {
    if (rootExport[condition] !== `./${packageJson.main}`) {
      fail(`exports["."].${condition} must point to ./${packageJson.main}.`);
    }
  }

  if (packageJson.exports["./package.json"] !== "./package.json") {
    fail('package.json must export "./package.json".');
  }

  if (
    !packageJson.publishConfig ||
    packageJson.publishConfig.registry !== "https://registry.npmjs.org/"
  ) {
    fail("package.json publishConfig.registry must force public npm.");
  }

  if (!Array.isArray(packageJson.files) || packageJson.files.length === 0) {
    fail("package.json must define a non-empty files allowlist.");
  }

  if (
    !packageJson.repository ||
    packageJson.repository.type !== "git" ||
    packageJson.repository.url !==
      "git+https://github.com/plaid/react-native-plaid-link-sdk.git"
  ) {
    fail("package.json repository must use npm's normalized git object shape.");
  }
}

function parsePackJson(output) {
  for (let start = 0; start < output.length; start += 1) {
    if (output[start] !== "[") {
      continue;
    }

    let depth = 0;
    let inString = false;
    let isEscaped = false;

    for (let end = start; end < output.length; end += 1) {
      const char = output[end];

      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) {
        continue;
      }

      if (char === "[") {
        depth += 1;
      } else if (char === "]") {
        depth -= 1;

        if (depth === 0) {
          const candidate = output.slice(start, end + 1);
          try {
            const parsed = JSON.parse(candidate);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (_error) {
            break;
          }
        }
      }
    }
  }

  fail("npm pack did not return a JSON array in its output.");
}

const main = assertPackageFieldExists("main");
const types = assertPackageFieldExists("types");
assertPackageMetadata();

try {
  const resolved = require.resolve(root);
  const expected = path.join(root, main);

  if (resolved !== expected) {
    fail(
      `require.resolve('.') resolved to ${path.relative(
        root,
        resolved
      )}, expected ${main}`
    );
  }
} catch (error) {
  fail(`require.resolve('.') failed: ${error.message}`);
}

let packOutput;

try {
  packOutput = execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: path.join(
        os.tmpdir(),
        "react-native-plaid-link-sdk-npm-cache"
      ),
    },
  });
} catch (error) {
  fail(`npm pack --dry-run --json failed:\n${error.stderr || error.message}`);
}

const packResult = parsePackJson(packOutput);

const packedFiles = (packResult[0] && packResult[0].files) || [];
const files = new Set(packedFiles.map((file) => file.path));

for (const entrypoint of [main, types]) {
  if (!files.has(entrypoint)) {
    fail(`packed package does not include ${entrypoint}`);
  }
}

for (const requiredFile of [
  "package.json",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "V13_MIGRATION_GUIDE.md",
  "expo-module.config.json",
  "android/build.gradle",
  "android/src/main/AndroidManifest.xml",
  "build/index.js",
  "build/index.d.ts",
  "ios/ReactNativePlaidLinkSdk.podspec",
  "ios/src/ReactNativePlaidLinkSdkModule.swift",
  "ios/Frameworks/LinkKit.xcframework/Info.plist",
  "src/index.ts",
]) {
  if (!files.has(requiredFile)) {
    fail(`packed package must include ${requiredFile}`);
  }
}

for (const forbiddenPrefix of [
  ".github/",
  "android/src/androidTest/",
  "android/src/test/",
  "coverage/",
  "dist/",
  "example/",
  "scripts/",
  "src/__mocks__/",
  "src/__tests__/",
]) {
  const forbiddenFile = packedFiles.find((file) =>
    file.path.startsWith(forbiddenPrefix)
  );

  if (forbiddenFile) {
    fail(`packed package must not include ${forbiddenFile.path}`);
  }
}

const forbiddenFile = packedFiles.find((file) =>
  file.path.endsWith(".DS_Store")
);

if (forbiddenFile) {
  fail(`packed package must not include ${forbiddenFile.path}`);
}

console.log(`Package entrypoints are valid: ${main}, ${types}`);
