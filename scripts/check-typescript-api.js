const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Packs the SDK exactly as `npm publish` would, installs the tarball into a
// throwaway consumer, and type-checks a fixture that uses every public 12.x
// export. This catches a broken `types` entrypoint or a missing export before
// the package reaches npm.

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
  const tarballPath = tarballOutput.trim().split(/\r?\n/).pop();
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

  for (const specifier of ["react", "react-native", "@types/react"]) {
    const source = path.join(root, "node_modules", specifier);
    const target = path.join(consumerRoot, "node_modules", specifier);

    if (!fs.existsSync(source)) {
      fail(`missing local dependency needed for the check: ${specifier}`);
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
          esModuleInterop: true,
          jsx: "react",
          module: "commonjs",
          moduleResolution: "node",
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: "es2020",
        },
        files: ["supported.tsx"],
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(consumerRoot, "supported.tsx"),
    `import React from "react";
import {
  EmbeddedLinkView,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  create,
  destroy,
  dismissLink,
  open,
  submit,
  syncFinanceKit,
  usePlaidEmitter,
} from "react-native-plaid-link-sdk";
import type {
  FinanceKitError,
  LinkEvent,
  LinkExit,
  LinkSuccess,
} from "react-native-plaid-link-sdk";

export function exerciseSupportedApi(token: string): Promise<void> {
  create({
    token,
    noLoadingState: false,
    logLevel: LinkLogLevel.ERROR,
    onLoad: () => {},
  });

  open({
    onSuccess: (success: LinkSuccess) => {
      void success.publicToken;
    },
    onExit: (exit: LinkExit) => {
      void exit.metadata;
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.WARN,
  });

  submit({ phoneNumber: "+14155550017", dateOfBirth: "1990-01-01" });

  syncFinanceKit(token, true, false, (error?: FinanceKitError) => {
    void error;
  });

  dismissLink();

  return destroy();
}

export function useLinkEvents(): void {
  usePlaidEmitter((event: LinkEvent) => {
    void event.eventName;
  });
}

export function Embedded(): React.ReactElement {
  return (
    <EmbeddedLinkView
      token="link-token"
      iOSPresentationStyle={LinkIOSPresentationStyle.FULL_SCREEN}
      onSuccess={(success: LinkSuccess) => {
        void success;
      }}
      onExit={(exit: LinkExit) => {
        void exit;
      }}
      onEvent={(event: LinkEvent) => {
        void event;
      }}
      style={undefined}
    />
  );
}
`
  );

  const tscPath = require.resolve("typescript/bin/tsc", { paths: [root] });
  execFileSync(process.execPath, [tscPath, "-p", "tsconfig.json"], {
    cwd: consumerRoot,
    encoding: "utf8",
    stdio: "inherit",
  });

  console.log("Packed TypeScript API check passed.");
} catch (error) {
  fail(error.stdout || error.stderr || error.message);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
