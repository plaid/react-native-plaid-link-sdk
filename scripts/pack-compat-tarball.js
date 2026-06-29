const { execFileSync } = require("child_process");
const os = require("os");
const path = require("path");

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

  throw new Error("npm pack did not return a JSON array in its output.");
}

const packDestination =
  process.argv[2] || process.env.RUNNER_TEMP || os.tmpdir();
const output = execFileSync(
  "npm",
  ["pack", "--pack-destination", packDestination, "--json"],
  {
    cwd: path.resolve(__dirname, ".."),
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: path.join(
        os.tmpdir(),
        "react-native-plaid-link-sdk-npm-cache"
      ),
    },
  }
);

const packResult = parsePackJson(output);
const filename = packResult[0] && packResult[0].filename;

if (!filename) {
  throw new Error("npm pack did not report a tarball filename.");
}

console.log(path.join(packDestination, filename));
