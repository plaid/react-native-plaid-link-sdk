import NativePlaidModule from "../ReactNativePlaidLinkSdkModule";
import ReactNativePlaidLinkSdk, {
  EmbeddedLinkView,
  PlaidLink,
  create,
  destroy,
  dismissLink,
  open,
  openLink,
  sdkVersion,
  submit,
  usePlaidEmitter,
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
    [
      "openLink",
      openLink,
      "Use await createPlaidLinkSession(config), then call await session.open()",
    ],
    [
      "usePlaidEmitter",
      usePlaidEmitter,
      "Pass onEvent to createPlaidLinkSession(config) instead of subscribing separately",
    ],
    [
      "submit",
      submit,
      "Call await session.submit(data) on the session returned by createPlaidLayerSession(config)",
    ],
    [
      "PlaidLink",
      PlaidLink,
      "Build your own button and call await createPlaidLinkSession(config)",
    ],
    [
      "destroy",
      destroy,
      "Remove the call. Each create call resets session state, so no teardown is needed.",
    ],
    [
      "dismissLink",
      dismissLink,
      "Remove the call. There is no programmatic dismiss API in v13.",
    ],
  ])("throws an actionable runtime error for %s", (name, api, replacement) => {
    expect(() => (api as unknown as () => never)()).toThrow(
      `${name} was removed in react-native-plaid-link-sdk v13. ${replacement}`,
    );
  });

  it.each([
    ["create", create],
    ["open", open],
    ["EmbeddedLinkView", EmbeddedLinkView],
    ["openLink", openLink],
    ["usePlaidEmitter", usePlaidEmitter],
    ["submit", submit],
    ["PlaidLink", PlaidLink],
    ["destroy", destroy],
    ["dismissLink", dismissLink],
  ])("links the migration guide from the %s error", (_name, api) => {
    expect(() => (api as unknown as () => never)()).toThrow(
      "https://github.com/plaid/react-native-plaid-link-sdk/blob/master/V13_MIGRATION_GUIDE.md",
    );
  });

  it("exports sdkVersion as a named value", () => {
    expect(sdkVersion).toBe(NativePlaidModule.sdkVersion);
  });

  it("preserves the deprecated default export in v13", () => {
    expect(ReactNativePlaidLinkSdk).toBe(NativePlaidModule);
  });
});
