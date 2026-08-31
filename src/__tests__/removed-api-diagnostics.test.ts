import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import ReactNativePlaidLinkSdk, {
  EmbeddedLinkView,
  create,
  open,
  sdkVersion,
} from "../index";

describe("removed API diagnostics", () => {
  it.each([
    [
      "create",
      create,
      "Use await createPlaidLinkSession(config), then call await session.open()",
    ],
    [
      "open",
      open,
      "Call await session.open() on the session returned by createPlaidLinkSession(config)",
    ],
    ["EmbeddedLinkView", EmbeddedLinkView, "Use PlaidEmbeddedSearchView"],
  ])("throws an actionable runtime error for %s", (name, api, replacement) => {
    expect(() => (api as unknown as () => never)()).toThrow(
      `${name} was removed in react-native-plaid-link-sdk v13. ${replacement}`,
    );
  });

  it("exports sdkVersion as a named value", () => {
    expect(sdkVersion).toBe(NativePlaidModule.sdkVersion);
  });

  it("preserves the deprecated default export in v13", () => {
    expect(ReactNativePlaidLinkSdk).toBe(NativePlaidModule);
  });
});
