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
      `package.json field "${fieldName}" points to a missing file: ${fieldValue}`,
    );
  }

  return fieldValue;
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

try {
  const resolved = require.resolve(root);
  const expected = path.join(root, main);

  if (resolved !== expected) {
    fail(
      `require.resolve('.') resolved to ${path.relative(
        root,
        resolved,
      )}, expected ${main}`,
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
        "react-native-plaid-link-sdk-npm-cache",
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

for (const forbiddenPrefix of ["coverage/", "dist/", "example/"]) {
  const forbiddenFile = packedFiles.find((file) =>
    file.path.startsWith(forbiddenPrefix),
  );

  if (forbiddenFile) {
    fail(`packed package must not include ${forbiddenFile.path}`);
  }
}

console.log(`Package entrypoints are valid: ${main}, ${types}`);
