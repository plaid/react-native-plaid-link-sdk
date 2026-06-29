const { execFileSync } = require("child_process");
const os = require("os");
const path = require("path");

const command = process.argv[2];
const allowedCommands = new Set(["pack", "publish"]);

if (!allowedCommands.has(command)) {
  console.error("Usage: node scripts/npm-dry-run.js <pack|publish>");
  process.exit(1);
}

const args =
  command === "pack"
    ? ["pack", "--dry-run", "--json"]
    : ["publish", "--dry-run", "--registry=https://registry.npmjs.org/"];

execFileSync("npm", args, {
  cwd: path.resolve(__dirname, ".."),
  encoding: "utf8",
  env: {
    ...process.env,
    npm_config_cache: path.join(
      os.tmpdir(),
      "react-native-plaid-link-sdk-npm-cache"
    ),
  },
  stdio: "inherit",
});
