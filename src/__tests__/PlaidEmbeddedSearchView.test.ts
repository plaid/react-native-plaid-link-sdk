import { Platform } from "react-native";

import type { PlaidEmbeddedSearchViewProps } from "../PlaidEmbeddedSearchView";

jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

jest.mock("expo-modules-core", () => ({
  requireNativeViewManager: jest.fn(() => "MockNativeView"),
}));

describe("PlaidEmbeddedSearchView", () => {
  beforeEach(() => {
    (Platform as any).OS = "ios";
  });

  it("type checks: required props", () => {
    const props: PlaidEmbeddedSearchViewProps = {
      token: "link-sandbox-token-123",
    };

    expect(props.token).toBeDefined();
    expect(props.token).toBe("link-sandbox-token-123");
  });

  it("type checks: all props including optional callbacks", () => {
    const props: PlaidEmbeddedSearchViewProps = {
      token: "link-sandbox-token-123",
      onSuccess: jest.fn(),
      onExit: jest.fn(),
      onEvent: jest.fn(),
      onLoad: jest.fn(),
      style: { width: 330, height: 400 },
    };

    expect(props.token).toBeDefined();
    expect(typeof props.onSuccess).toBe("function");
    expect(typeof props.onExit).toBe("function");
    expect(typeof props.onEvent).toBe("function");
    expect(typeof props.onLoad).toBe("function");
    expect(props.style).toBeDefined();
  });

  it("type checks: callbacks are optional", () => {
    const minimalProps: PlaidEmbeddedSearchViewProps = {
      token: "link-sandbox-token-123",
    };

    expect(minimalProps.token).toBeDefined();
    expect(minimalProps.onSuccess).toBeUndefined();
    expect(minimalProps.onExit).toBeUndefined();
    expect(minimalProps.onEvent).toBeUndefined();
    expect(minimalProps.onLoad).toBeUndefined();
  });

  it("type checks: supports ViewProps", () => {
    const props: PlaidEmbeddedSearchViewProps = {
      token: "link-sandbox-token-123",
      style: { flex: 1, backgroundColor: "white" },
      testID: "plaid-embedded-search",
      accessibilityLabel: "Plaid Embedded Search",
    };

    expect(props.style).toBeDefined();
    expect(props.testID).toBe("plaid-embedded-search");
    expect(props.accessibilityLabel).toBe("Plaid Embedded Search");
  });
});
