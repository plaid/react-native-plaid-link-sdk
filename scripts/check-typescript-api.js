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

  // The JSX fixture below renders removed component exports, which needs React
  // and its types resolvable from the consumer.
  for (const specifier of ["react", "react-native", "@types/react"]) {
    const source = path.join(root, "node_modules", specifier);
    const target = path.join(consumerRoot, "node_modules", specifier);

    if (!fs.existsSync(source)) {
      fail(`missing local dependency needed for the JSX check: ${specifier}`);
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.symlinkSync(source, target, "junction");
  }

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
    `import {
  EmbeddedLinkView,
  PlaidLink,
  create,
  destroy,
  dismissLink,
  open,
  openLink,
  submit,
  usePlaidEmitter,
} from "react-native-plaid-link-sdk";

create({ token: "link-token" });
open({});
openLink({});
usePlaidEmitter(() => {});
submit({});
destroy();
dismissLink();
EmbeddedLinkView({});
PlaidLink({});
`
  );

  // Agents write removed components as JSX far more often than as calls, so the
  // element form needs its own coverage.
  fs.writeFileSync(
    path.join(consumerRoot, "removed-jsx.tsx"),
    `import React from "react";
import { EmbeddedLinkView, PlaidLink } from "react-native-plaid-link-sdk";

export const Embedded = () => <EmbeddedLinkView token="link-token" />;
export const Button = () => <PlaidLink token="link-token" />;

void React;
`
  );

  function typecheckRemoved(fileName, extraArgs = []) {
    const result = spawnSync(
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
        "--target",
        "es2020",
        ...extraArgs,
        fileName,
      ],
      { cwd: consumerRoot, encoding: "utf8" }
    );

    if (result.status === 0) {
      fail(`removed APIs unexpectedly compiled successfully in ${fileName}.`);
    }

    return `${result.stdout || ""}${result.stderr || ""}`;
  }

  const callDiagnostics = typecheckRemoved("removed.ts");
  const jsxDiagnostics = typecheckRemoved("removed-jsx.tsx", [
    "--jsx",
    "react",
    "--esModuleInterop",
  ]);
  const diagnostics = `${callDiagnostics}${jsxDiagnostics}`;

  for (const replacement of [
    "Use await createPlaidLinkSession(config), then call await session.open()",
    "Call await session.open() on the session returned by createPlaidLinkSession(config)",
    "Use PlaidEmbeddedSearchView",
    "Pass onEvent to createPlaidLinkSession(config) instead of subscribing separately",
    "Call await session.submit(data) on the session returned by createPlaidLayerSession(config)",
    "Build your own button and call await createPlaidLinkSession(config)",
    "Each create call resets session state, so no teardown is needed",
    "There is no programmatic dismiss API in v13",
  ]) {
    if (!diagnostics.includes(replacement)) {
      fail(`missing migration diagnostic: ${replacement}`);
    }
  }

  // TS2614 means a removed name has no diagnostic export at all, so TypeScript
  // falls back to guessing the default import — the exact failure these
  // diagnostics exist to prevent.
  if (diagnostics.includes("TS2614")) {
    fail(
      "a removed API has no migration diagnostic export; TypeScript reported TS2614 instead."
    );
  }

  if (diagnostics.includes("Did you mean to use 'import")) {
    fail("TypeScript still suggests the incorrect default import.");
  }

  for (const [fileName, guidance] of [
    ["removed-jsx.tsx", "Use PlaidEmbeddedSearchView"],
    [
      "removed-jsx.tsx",
      "Build your own button and call await createPlaidLinkSession(config)",
    ],
  ]) {
    if (!jsxDiagnostics.includes(guidance)) {
      fail(`missing JSX migration diagnostic in ${fileName}: ${guidance}`);
    }
  }

  if (!process.exitCode) {
    console.log(
      "Packed TypeScript API is valid and removed APIs provide actionable diagnostics."
    );
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
