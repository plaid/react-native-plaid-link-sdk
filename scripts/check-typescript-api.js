const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(
  path.join(os.tmpdir(), "react-native-plaid-link-sdk-types-")
);

function fail(message) {
  console.error(`TypeScript API check failed: ${message}`);
  process.exitCode = 1;
}

try {
  const tarballOutput = execFileSync(
    process.execPath,
    [path.join(root, "scripts", "pack-compat-tarball.js"), tempRoot],
    { cwd: root, encoding: "utf8" }
  );
  const tarballPath = tarballOutput.trim().split(/\r?\n/).at(-1);
  const extractRoot = path.join(tempRoot, "extract");
  const consumerRoot = path.join(tempRoot, "consumer");
  const installedPackage = path.join(
    consumerRoot,
    "node_modules",
    "react-native-plaid-link-sdk"
  );

  fs.mkdirSync(extractRoot, { recursive: true });
  fs.mkdirSync(path.dirname(installedPackage), { recursive: true });
  execFileSync("tar", ["-xzf", tarballPath, "-C", extractRoot]);
  fs.renameSync(path.join(extractRoot, "package"), installedPackage);

  fs.writeFileSync(
    path.join(consumerRoot, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          module: "commonjs",
          moduleResolution: "node",
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: "es2020",
        },
        files: ["supported.ts"],
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(consumerRoot, "supported.ts"),
    `import {
  FinanceKitSyncBehavior,
  PlaidEmbeddedSearchView,
  createPlaidHeadlessSession,
  createPlaidLayerSession,
  createPlaidLinkSession,
  sdkVersion,
  syncFinanceKit,
} from "react-native-plaid-link-sdk";

async function exerciseSupportedApi(token: string) {
  const link = await createPlaidLinkSession({
    token,
    onSuccess: () => {},
    onExit: () => {},
    onEvent: () => {},
  });
  await link.open();

  const layer = await createPlaidLayerSession({
    token,
    onSuccess: () => {},
    onExit: () => {},
    onEvent: () => {},
  });
  await layer.submit({ phoneNumber: "+14155550017" });
  await layer.open();

  const headless = await createPlaidHeadlessSession({
    token,
    onSuccess: () => {},
    onExit: () => {},
    onEvent: () => {},
  });
  await headless.start();

  await syncFinanceKit({
    token,
    syncBehavior: FinanceKitSyncBehavior.LIVE,
  });

  return { PlaidEmbeddedSearchView, sdkVersion };
}

void exerciseSupportedApi;
`
  );

  const tscPath = require.resolve("typescript/bin/tsc");
  execFileSync(process.execPath, [tscPath, "-p", "tsconfig.json"], {
    cwd: consumerRoot,
    encoding: "utf8",
  });

  fs.writeFileSync(
    path.join(consumerRoot, "removed.ts"),
    `import { create, open, EmbeddedLinkView } from "react-native-plaid-link-sdk";

create({ token: "link-token" });
open({});
EmbeddedLinkView({});
`
  );

  const removedResult = spawnSync(
    process.execPath,
    [
      tscPath,
      "--noEmit",
      "--pretty",
      "false",
      "--skipLibCheck",
      "--strict",
      "--moduleResolution",
      "node",
      "removed.ts",
    ],
    { cwd: consumerRoot, encoding: "utf8" }
  );
  const diagnostics = `${removedResult.stdout || ""}${
    removedResult.stderr || ""
  }`;

  if (removedResult.status === 0) {
    fail("removed APIs unexpectedly compiled successfully.");
  }

  for (const replacement of [
    "Use await createPlaidLinkSession(config), then call await session.open()",
    "Call await session.open() on the session returned by createPlaidLinkSession(config)",
    "Use PlaidEmbeddedSearchView",
  ]) {
    if (!diagnostics.includes(replacement)) {
      fail(`missing migration diagnostic: ${replacement}`);
    }
  }

  if (diagnostics.includes("Did you mean to use 'import")) {
    fail("TypeScript still suggests the incorrect default import.");
  }

  if (!process.exitCode) {
    console.log(
      "Packed TypeScript API is valid and removed APIs provide actionable diagnostics."
    );
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
