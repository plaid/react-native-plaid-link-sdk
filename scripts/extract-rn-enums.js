const fs = require("fs");
const path = require("path");

function extractEnumValues(source, enumName) {
  const enumMatch = source.match(
    new RegExp(`export\\s+enum\\s+${enumName}\\s*\\{([\\s\\S]*?)\\n\\}`),
  );

  if (!enumMatch) {
    throw new Error(`Could not find ${enumName}`);
  }

  return [...enumMatch[1].matchAll(/=\s*"([^"]+)"/g)].map((match) => match[1]);
}

function getReactNativeEnumValues(repoRoot = path.resolve(__dirname, "..")) {
  const source = fs.readFileSync(
    path.join(repoRoot, "src", "ReactNativePlaidLinkSdk.types.ts"),
    "utf8",
  );

  return {
    eventNames: extractEnumValues(source, "LinkEventName"),
    viewNames: extractEnumValues(source, "LinkEventViewName"),
  };
}

if (require.main === module) {
  const values = getReactNativeEnumValues();
  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(values)}\n`);
  } else {
    process.stdout.write(
      [
        "LinkEventName",
        ...values.eventNames.map((value) => `  ${value}`),
        "",
        "LinkEventViewName",
        ...values.viewNames.map((value) => `  ${value}`),
        "",
      ].join("\n"),
    );
  }
}

module.exports = {
  extractEnumValues,
  getReactNativeEnumValues,
};
