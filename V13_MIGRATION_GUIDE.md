# React Native Plaid Link SDK v13 Migration Guide

This guide covers the breaking changes introduced in `react-native-plaid-link-sdk`
v13 and shows how to migrate from v11 or v12 integrations.

## Quick Links

- [Why Upgrade](#why-upgrade)
- [Overview](#overview)
- [Installation and Tooling](#installation-and-tooling)
- [Standard Link Migration](#standard-link-migration)
- [Event and Callback Migration](#event-and-callback-migration)
- [Layer Migration](#layer-migration)
- [Headless Link Migration](#headless-link-migration)
- [Embedded Search Migration](#embedded-search-migration)
- [FinanceKit Migration](#financekit-migration)
- [Other Breaking Changes](#other-breaking-changes)

## Why Upgrade

v13 rebuilds the React Native SDK on Expo Modules and updates the native Link
integrations. This gives the SDK a single module implementation for Expo and
bare React Native apps, adds session-based APIs, and brings Android Embedded
Search support into the public React Native API.

## Overview

v13 changes the JavaScript API from global `create`, `open`, `submit`, and event
emitter helpers to explicit session objects:

| v11/v12 API | v13 replacement |
| --- | --- |
| `PlaidLink` component | Create your own button and call `createPlaidLinkSession` |
| `openLink(...)` | `const session = await createPlaidLinkSession(...); await session.open()` |
| `create(...)` then `open(...)` | `const session = await createPlaidLinkSession(...); await session.open()` |
| `usePlaidEmitter(...)` | Pass `onEvent` to the session creation function |
| `submit(...)` | `session.submit(...)` from a `PlaidLayerSession` |
| `EmbeddedLinkView` | `PlaidEmbeddedSearchView` |
| callback-style `syncFinanceKit(...)` | promise-returning `syncFinanceKit({ ... })` |

The public import path is unchanged:

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";
```

## Installation and Tooling

v13 is an Expo Module package. Bare React Native apps must have Expo Modules
installed and configured before installing this SDK.

```sh
npm install react-native-plaid-link-sdk expo
npx pod-install
```

If your app is already an Expo app or already has Expo Modules installed, install
or upgrade only this package:

```sh
npm install react-native-plaid-link-sdk@^13
npx pod-install
```

v13 publishes JavaScript and TypeScript declarations from `build/index.js` and
`build/index.d.ts`. Apps should continue importing from
`react-native-plaid-link-sdk`; do not import from `build/`, `src/`, `ios/`, or
`android/` directly.

## Standard Link Migration

### v11 `openLink` or `PlaidLink`

Before v13, older v11 integrations could open Link with `openLink` or the
deprecated `PlaidLink` component.

Before:

```ts
import {
  LinkIOSPresentationStyle,
  LinkLogLevel,
  openLink,
} from "react-native-plaid-link-sdk";

openLink({
  tokenConfig: {
    token: "#GENERATED_LINK_TOKEN#",
    logLevel: LinkLogLevel.ERROR,
    noLoadingState: false,
  },
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
});
```

After:

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";

const session = await createPlaidLinkSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  onEvent: (event) => {
    console.log("Event", event);
  },
});

await session.open(false);
```

### v12 `create` and `open`

v12 integrations usually preloaded Link with `create(...)` and opened it later
with `open(...)`.

Before:

```ts
import {
  LinkIOSPresentationStyle,
  LinkLogLevel,
  create,
  open,
} from "react-native-plaid-link-sdk";

create({
  token: "#GENERATED_LINK_TOKEN#",
  logLevel: LinkLogLevel.ERROR,
  noLoadingState: false,
  onLoad: () => {
    console.log("Link loaded");
  },
});

open({
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
});
```

After:

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";

const session = await createPlaidLinkSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  onEvent: (event) => {
    console.log("Event", event);
  },
  onLoad: () => {
    console.log("Link loaded");
  },
});

await session.open(false);
```

`session.open(false)` presents Link using the default presentation. Pass `true`
to request full-screen presentation.

## Event and Callback Migration

`usePlaidEmitter` has been removed. In v13, each session creation function takes
its own callbacks. This keeps callback ownership tied to the active Link session.

Before:

```ts
import { usePlaidEmitter } from "react-native-plaid-link-sdk";

usePlaidEmitter((event) => {
  console.log("Event", event);
});
```

After:

```ts
const session = await createPlaidLinkSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess,
  onExit,
  onEvent: (event) => {
    console.log("Event", event);
  },
});
```

The native module uses namespaced internal event names:

- `PlaidLink.onSuccess`
- `PlaidLink.onExit`
- `PlaidLink.onEvent`

These names are implementation details. App code should use the callback
properties passed to `createPlaidLinkSession`, `createPlaidLayerSession`,
`createPlaidHeadlessSession`, or `PlaidEmbeddedSearchView`.

### Callback payload changes

`metadataJson` is the canonical metadata JSON field in v13 callback payloads:

```ts
onEvent: (event) => {
  console.log(event.metadata.metadataJson);
};
```

If your v11 or v12 TypeScript code references `metadata_json`, update it to
`metadataJson`. This aligns `LinkEventMetadata` with the rest of the callback
payload keys, such as `eventName`, `linkSessionId`, `requestId`, and `viewName`.

`errorDisplayMessage` has also been removed from `LinkError`. Use
`displayMessage` instead:

```ts
onExit: (exit) => {
  console.log(exit.error?.displayMessage);
};
```

## Layer Migration

Layer now uses a dedicated session object.

Before:

```ts
import { create, open, submit } from "react-native-plaid-link-sdk";

create({
  token: "#GENERATED_LINK_TOKEN#",
  noLoadingState: true,
});

submit({
  phoneNumber: "415-555-0017",
  dateOfBirth: "1975-01-18",
});

open({
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
});
```

After:

```ts
import {
  LinkEventName,
  PlaidLayerSession,
  createPlaidLayerSession,
} from "react-native-plaid-link-sdk";

let session: PlaidLayerSession;

session = await createPlaidLayerSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  onEvent: async (event) => {
    if (event.eventName === LinkEventName.LAYER_READY) {
      await session.open();
    }
  },
});

await session.submit({
  phoneNumber: "415-555-0017",
  dateOfBirth: "1975-01-18",
});
```

If your Layer flow only requires a phone number, omit `dateOfBirth`:

```ts
await session.submit({
  phoneNumber: "415-555-0015",
});
```

## Headless Link Migration

Headless Link is new in v13. Create a headless session, then call `start()`.

```ts
import { createPlaidHeadlessSession } from "react-native-plaid-link-sdk";

const session = await createPlaidHeadlessSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => {
    console.log("Success", success);
  },
  onExit: (exit) => {
    console.log("Exit", exit);
  },
  onEvent: (event) => {
    console.log("Event", event);
  },
  onLoad: () => {
    console.log("Headless session loaded");
  },
});

await session.start();
```

## Embedded Search Migration

v11 and v12 exported `EmbeddedLinkView`. v13 exports
`PlaidEmbeddedSearchView` instead. Android Embedded Search is supported in v13.

Before:

```tsx
import { EmbeddedLinkView } from "react-native-plaid-link-sdk";

<EmbeddedLinkView
  token="#GENERATED_LINK_TOKEN#"
  onSuccess={(success) => {
    console.log("Success", success);
  }}
  onExit={(exit) => {
    console.log("Exit", exit);
  }}
/>;
```

After:

```tsx
import { PlaidEmbeddedSearchView } from "react-native-plaid-link-sdk";

<PlaidEmbeddedSearchView
  token="#GENERATED_LINK_TOKEN#"
  style={{ height: 500 }}
  onLoad={() => {
    console.log("Embedded Search loaded");
  }}
  onSuccess={(success) => {
    console.log("Success", success);
  }}
  onExit={(exit) => {
    console.log("Exit", exit);
  }}
  onEvent={(event) => {
    console.log("Event", event);
  }}
/>;
```

## FinanceKit Migration

FinanceKit remains iOS-only. In v12, `syncFinanceKit` accepted positional
arguments and reported completion through a callback. In v13, it accepts a
configuration object and returns a promise.

Before:

```ts
import { syncFinanceKit } from "react-native-plaid-link-sdk";

syncFinanceKit(
  "#GENERATED_LINK_TOKEN#",
  true,
  false,
  (error) => {
    if (error) {
      console.log("FinanceKit error", error);
      return;
    }

    console.log("FinanceKit sync complete");
  }
);
```

After:

```ts
import {
  FinanceKitSyncBehavior,
  syncFinanceKit,
} from "react-native-plaid-link-sdk";

try {
  await syncFinanceKit({
    token: "#GENERATED_LINK_TOKEN#",
    requestAuthorizationIfNeeded: true,
    syncBehavior: FinanceKitSyncBehavior.LIVE,
  });

  console.log("FinanceKit sync complete");
} catch (error) {
  console.log("FinanceKit error", error);
}
```

Calling `syncFinanceKit` on Android rejects with an error because FinanceKit is
only available on iOS.

## Other Breaking Changes

### `LinkAccountSubtypeInvestment.SIIP` renamed to `SIPP`

The misspelled investment account subtype constant
`LinkAccountSubtypeInvestment.SIIP` has been removed and replaced with the
correctly spelled `LinkAccountSubtypeInvestment.SIPP` (Self-Invested Personal
Pension).

The underlying runtime value is unchanged (`"sipp"`), so this is a compile-time
rename only. There is no behavior change for accounts that were already filtered
correctly.

Before:

```ts
import { LinkAccountSubtypeInvestment } from "react-native-plaid-link-sdk";

const subtypes = [LinkAccountSubtypeInvestment.SIIP];
```

After:

```ts
import { LinkAccountSubtypeInvestment } from "react-native-plaid-link-sdk";

const subtypes = [LinkAccountSubtypeInvestment.SIPP];
```

Action required: replace any usage of `LinkAccountSubtypeInvestment.SIIP` with
`LinkAccountSubtypeInvestment.SIPP`. TypeScript will surface the removed member
as a compile error:

```text
Property 'SIIP' does not exist on type 'typeof LinkAccountSubtypeInvestment'. Did you mean 'SIPP'?
```
