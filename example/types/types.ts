export type SessionState = "idle" | "loading" | "ready" | "error";

export type Screen =
  | "list"
  | "plaidLinkSession"
  | "plaidLinkHeadlessSession"
  | "plaidLayerSession"
  | "plaidEmbeddedSearch"
  | "syncFinanceKit";

export const SCREENS: { key: Screen; title: string; description: string }[] = [
  {
    key: "plaidLinkSession",
    title: "PlaidLinkSession",
    description: "Shows how to create a PlaidLinkSession and open Link.",
  },
  {
    key: "plaidLinkHeadlessSession",
    title: "PlaidLinkHeadlessSession",
    description:
      "Shows how to create a PlaidHeadlessSession and start a payment flow.",
  },
  {
    key: "plaidLayerSession",
    title: "PlaidLayerSession",
    description:
      "Shows how to create a PlaidLayerSession and start a Layer flow.",
  },
  {
    key: "plaidEmbeddedSearch",
    title: "PlaidEmbeddedSearch",
    description:
      "Shows how to create an EmbeddedSearchView and start a Link flow from it.",
  },
  {
    key: "syncFinanceKit",
    title: "Sync FinanceKit",
    description:
      "Shows how to sync the latest transactions from Apple Card using FinanceKit.",
  },
];
