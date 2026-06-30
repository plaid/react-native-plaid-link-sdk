# Plaid React Native SDK

React Native SDK for Plaid Link, built on Expo Modules for the v13 native
architecture. The SDK supports Expo apps and bare React Native apps through the
same session-based JavaScript API.

## API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/react-native-plaid-link-sdk/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/react-native-plaid-link-sdk/)
- [Plaid Link documentation](https://plaid.com/docs/link/)

## Requirements

### React Native and Expo

- React Native 0.76 or newer
- Expo 52 or newer, or bare React Native with Expo Modules installed
- A development build, custom native build, or bare native app

Expo Go is not supported because Plaid Link includes custom native code. Expo
apps should use a development build or another app build that includes this
native module.

### iOS

- iOS 15.1 or newer
- Xcode 16.1 or newer
- CocoaPods for installing native dependencies

### Android

- Android Studio 4.0 or newer
- Kotlin 1.9.25 or newer for Kotlin integrations
- A package name registered in the Plaid Dashboard for Android OAuth flows

## Compatibility

The SDK supports React Native 0.76 or newer and Expo 52 or newer. Expo support
requires a development build, custom native build, or bare native app; Expo Go is
not supported.

| Lane              | React Native | Expo | CI coverage                                                                         |
| ----------------- | ------------ | ---- | ----------------------------------------------------------------------------------- |
| Minimum supported | 0.76         | 52   | Peer install and package export smoke test                                          |
| Current example   | 0.83         | 55   | Peer install and package export smoke test, Android unit tests, iOS simulator build |
| Latest Expo       | 0.85         | 56   | Packed SDK install and iOS prebuild smoke test                                      |

The root package unit tests run against the repository's development
dependencies, while the example app validates the current native integration on
both platforms.

## Migration guides

- [v13 migration guide](./V13_MIGRATION_GUIDE.md)

## Installation

### Expo projects

Install the package in an Expo project, then run the app in a development build
or another custom native runtime.

```sh
npm install react-native-plaid-link-sdk
```

If you are adding the SDK to an existing Expo app, rebuild the native app after
installation so the Plaid native module is included.

### Bare React Native projects

Bare React Native apps must install and configure the `expo` package before
using this SDK.

```sh
npm install react-native-plaid-link-sdk expo
npx pod-install
```

Follow Expo's guide for
[installing Expo Modules in an existing React Native app](https://docs.expo.dev/bare/installing-expo-modules/)
if your bare app does not already use Expo Modules.

## Plaid Dashboard setup

Configure the native app identifiers that your app will use with Link:

- Android package names
- iOS bundle identifiers
- OAuth redirect URIs for every environment your app supports

The link token passed to this SDK must be created by your server with the Link
configuration for the flow you want to launch. Do not create link tokens in the
mobile app.

## Standard Link

Create a Link session with a link token, then open it from your UI.

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

await session.open();
```

Pass `true` to `session.open(true)` to request full-screen presentation on iOS.
The default presentation is used when this argument is omitted or `false`.

## Layer

Layer uses a dedicated session object. Submit user data once the Layer session is
ready, then open Link when the Layer flow emits the ready event.

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

## Headless Link

Headless Link creates a session that starts without presenting the standard Link
UI.

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

## Embedded Search

Embedded Search is available on iOS and Android through
`PlaidEmbeddedSearchView`.

```tsx
import { PlaidEmbeddedSearchView } from "react-native-plaid-link-sdk";

export function EmbeddedSearch() {
  return (
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
    />
  );
}
```

## FinanceKit

FinanceKit is available on iOS only. Calling `syncFinanceKit` on Android rejects
with an error.

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

## Troubleshooting

### Expo Go cannot load the native module

Expo Go does not include Plaid Link's native code. Use an Expo development
build, another custom native runtime, or a bare React Native app.

### iOS build cannot find LinkKit

Run `npx pod-install` after installing or upgrading the package. v13 ships the
required `LinkKit.xcframework` in the npm package.

### Android OAuth redirects fail

Confirm that the Android package name in your app matches the package name
configured in the Plaid Dashboard for the environment you are testing.

### iOS OAuth redirects fail

Confirm that the iOS bundle identifier and redirect URI are configured in the
Plaid Dashboard for the environment you are testing.

### Import path fails after upgrading to v13

Import from the package root only:

```ts
import { createPlaidLinkSession } from "react-native-plaid-link-sdk";
```

Do not import from `build/`, `src/`, `ios/`, or `android/` directly.

## Contributing

Issues and pull requests are welcome in this repository. Include the SDK
version, React Native version, Expo SDK version if applicable, platform, device
or simulator, and Link Session ID when reporting bugs.
