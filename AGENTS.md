# AGENTS.md

Guidance for AI coding agents integrating `react-native-plaid-link-sdk`.
Applies to **v13.x**. For v11/v12 integrations, see `V13_MIGRATION_GUIDE.md`.

If you learned this SDK before v13, your recalled API is out of date. v13 is a
rewrite onto Expo Modules with a session-based API. Read the rename table below
before writing any Plaid code.

## The import

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";
```

These do not exist in v13 and will fail to compile:

```ts
import { create, open } from "react-native-plaid-link-sdk";      // TS2614
import { EmbeddedLinkView } from "react-native-plaid-link-sdk";  // TS2614
import { usePlaidEmitter } from "react-native-plaid-link-sdk";   // TS2614
```

TypeScript reports these as `TS2614 ... Did you mean to use 'import create from
"react-native-plaid-link-sdk"' instead?`. **That suggestion is wrong.** The
package has a default export, so TypeScript assumes you meant to import it, but
the default export is the native module object — not these functions. Following
the hint just moves the error one line down to `TS2349: This expression is not
callable`. Use the named exports below.

## If you were about to write pre-v13 code

| Pre-v13 | v13 |
| --- | --- |
| `create(config)` | `await createPlaidLinkSession(config)` |
| `open({ onSuccess, onExit })` | `await session.open()` — callbacks now go to the create call |
| `openLink({ tokenConfig, onSuccess })` | `createPlaidLinkSession(...)` then `session.open()` |
| `<PlaidLink>` component | Build your own button, call `createPlaidLinkSession` |
| `usePlaidEmitter(listener)` | Pass `onEvent` to the create call |
| `submit(data)` | `await session.submit(data)` on a Layer session |
| `EmbeddedLinkView` | `PlaidEmbeddedSearchView` |
| `syncFinanceKit(token, bool, bool, cb)` | `await syncFinanceKit({ token, ... })` |
| `iOSPresentationStyle: FULL_SCREEN` | `await session.open(true)` |
| `destroy()` | Not needed — each create call resets session state |
| `dismissLink()` | No replacement in v13 |

The two changes that trip up most generated code: **callbacks moved from `open`
to the create call**, and **every create function is `async`**.

## Complete v13 export surface

Functions — `createPlaidLinkSession`, `createPlaidIdentityVerificationSession`,
`createPlaidLayerSession`, `createPlaidHeadlessSession`, `syncFinanceKit`.

Component — `PlaidEmbeddedSearchView` (with `PlaidEmbeddedSearchViewProps`).

Types and enums — `LinkSuccess`, `LinkExit`, `LinkEvent`, `LinkEventName`,
`LinkError`, `LinkTokenConfiguration`, `PlaidLinkSession`, `PlaidLayerSession`,
`PlaidHeadlessSession`, `SubmissionData`, `FinanceKitSyncBehavior`, and the
other types in `ReactNativePlaidLinkSdk.types`.

Default export — the native module instance. The only supported use is reading
`.sdkVersion`. Do not call Link APIs on it.

## Standard Link

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";

const session = await createPlaidLinkSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => console.log("Success", success),
  onExit: (exit) => console.log("Exit", exit),
  onEvent: (event) => console.log("Event", event),
  onLoad: () => console.log("Link loaded"),
});

await session.open();
```

`onSuccess`, `onExit`, and `onEvent` are required. `onLoad` is optional.
`session.open(true)` requests full-screen presentation on iOS.

## Identity Verification

Use the dedicated function — IDV does not emit `onLoad`, so do not wait for it.

```ts
import { createPlaidIdentityVerificationSession } from "react-native-plaid-link-sdk";

const session = await createPlaidIdentityVerificationSession({
  token: "#GENERATED_IDENTITY_VERIFICATION_LINK_TOKEN#",
  onSuccess: (success) => console.log("Success", success),
  onExit: (exit) => console.log("Exit", exit),
  onEvent: (event) => console.log("Event", event),
});

await session.open();
```

## Layer

Open Link when the Layer flow emits `LAYER_READY`.

```ts
import {
  LinkEventName,
  PlaidLayerSession,
  createPlaidLayerSession,
} from "react-native-plaid-link-sdk";

let session: PlaidLayerSession;

session = await createPlaidLayerSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => console.log("Success", success),
  onExit: (exit) => console.log("Exit", exit),
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

## Headless Link

```ts
import { createPlaidHeadlessSession } from "react-native-plaid-link-sdk";

const session = await createPlaidHeadlessSession({
  token: "#GENERATED_LINK_TOKEN#",
  onSuccess: (success) => console.log("Success", success),
  onExit: (exit) => console.log("Exit", exit),
  onEvent: (event) => console.log("Event", event),
});

await session.start();
```

Headless sessions use `start()`, not `open()`.

## Embedded Search

```tsx
import { PlaidEmbeddedSearchView } from "react-native-plaid-link-sdk";

export function EmbeddedSearch() {
  return (
    <PlaidEmbeddedSearchView
      token="#GENERATED_LINK_TOKEN#"
      style={{ height: 500 }}
      onLoad={() => console.log("Embedded Search loaded")}
      onSuccess={(success) => console.log("Success", success)}
      onExit={(exit) => console.log("Exit", exit)}
      onEvent={(event) => console.log("Event", event)}
    />
  );
}
```

Give the view an explicit height. It accepts standard `ViewProps`.

## FinanceKit

iOS only. Rejects on Android.

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
} catch (error) {
  console.log("FinanceKit error", error);
}
```

## Setup that breaks the build if missed

v13 is an Expo Module. Bare React Native apps must install and configure `expo`
before this SDK:

```sh
npm install react-native-plaid-link-sdk expo
npx pod-install
```

Expo apps install the package alone, then rebuild the native app.

- React Native 0.76+, Expo 52+, iOS 15.1+, Xcode 16.1+.
- **Expo Go does not work.** Link ships custom native code, so the app needs a
  development build or another custom native build.
- Rebuild native after installing. A JS-only reload will not pick up the module.

## Never do these

- Do not import from `build/`, `src/`, `ios/`, or `android/`. Import from the
  package root only.
- Do not call Link functions on the default export.
- Do not hardcode a link token. Tokens come from your server calling
  `/link/token/create`. In generated code use a placeholder or a fetch to your
  backend.
- Do not put Plaid client secrets in the app. They belong on your server.
- Do not use `create`, `open`, `openLink`, `usePlaidEmitter`, `submit`,
  `destroy`, `dismissLink`, `EmbeddedLinkView`, or the `PlaidLink` component.

## More

- `README.md` — full integration reference
- `V13_MIGRATION_GUIDE.md` — v11/v12 to v13 migration
- `CHANGELOG.md` — release history
- https://plaid.com/docs/link/react-native/ — Plaid docs
- `CONTRIBUTING.md` — for changes to this SDK repo itself
