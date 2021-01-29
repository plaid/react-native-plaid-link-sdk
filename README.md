# Getting Started ![version](https://img.shields.io/npm/v/react-native-plaid-link-sdk)

In your react-native project directory:

```sh
npm install --save react-native-plaid-link-sdk
```

> Please note that we are updating our SDK with typescript support and an API that aligns closer to our other SDKS. This readme already reflects the installation instructions for the 7.x.x version.
>
> To try out the new SDK, please use ![version](https://img.shields.io/npm/v/react-native-plaid-link-sdk), to use the latest stable release use [6.0.4](https://www.npmjs.com/package/react-native-plaid-link-sdk/v/6.0.4)

For a full guide and migration guides please vist our [docs][plaid_rndocs]

## iOS setup
Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The latest version is ![version](https://img.shields.io/cocoapods/v/Plaid).

```sh
pod 'Plaid', '~> <insert latest version>'
```

Then install your cocoapods dependencies:

```sh
(cd ios && pod install)
```

Add a Run Script build phase (after the [CP] Embed Pods Frameworks step) to your target as [described in Plaid Link for iOS documentation][plaid_iosscripts]. This strips simulator symbols from App Store release builds.

That's it if using a recent react-native version with [autolinking][autolinking] support.

### Manual Integration

If using a version of react-native without [autolinking][autolinking]  support, then you will need to:

```sh
react-native link react-native-plaid-link-sdk
```

followed by

1. In Xcode, in the project navigator, right click `Libraries` ▶ `Add Files to [your project's name]`
2. Go to `node_modules` ▶ `react-native-plaid-link-sdk` ▶ `ios` and add `RNLinksdk.xcodeproj`
3. In Xcode, in the project navigator, select your project. Add `libRNLinksdk.a` to your project's `Build Phases` ▶ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Android setup
[Autolinking][autolinking]  unfortunately isn't supported for Android, because the SDK makes use of [TurboModules][turbomodules] to speed up app cold starts. Have a look at [#306](https://github.com/plaid/react-native-plaid-link-sdk/pull/306) for more context.

### 1. Register your app id
1. Log into your [Plaid Dashboard][plaid_dashboard] at the API page
2. Next to Allowed Android package names click "Configure" then "Add New Android Package Name"
3. Enter your package name, for example `com.plaid.example`
4. Click "Save Changes", you may be prompted to re-enter your password

### 2. Add PlaidPackage to your application
1. Go to `android/app/src/main/java/<AppName>/MainApplication.java`
2. Add `import com.plaid.PlaidPackage;` to the imports section
3. Add `packages.add(new PlaidPackage());` to `List<ReactPackage> getPackages();`

### 3. Configure Gradle
1. Go to the project level `android/app/build.gradle`
2. Make sure you are using a min sdk >= 21
3. Add the following dependencies:

```groovy
dependencies {
    // ...
    implementation project(':react-native-plaid-link-sdk')
}
```

5. Go to `android/settings.gradle`
6. Add the following lines:

```groovy
include ':react-native-plaid-link-sdk'
project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-plaid-link-sdk/android')
```

## React native setup
To initialize `PlaidLink`, you will need to first create a `link_token` at [/link/token/create][plaid_tokendocs].
After creating a `link_token`, you'll need to pass it into your app and use it to launch Link:

```javascript
import { Text } from 'react-native';
import { PlaidLink, LinkSuccess, LinkExit } from 'react-native-plaid-link-sdk';

const MyPlaidComponent = () => {
  return (
    <PlaidLink
        tokenConfig={{
            token: "#GENERATED_LINK_TOKEN#",
        }}
        onSuccess={(success: LinkSuccess) => { console.log(success) }}
        onExit={(exit: LinkExit) => { console.log(exit) }}
    >
        <Text>Add Account</Text>
    </PlaidLink>
  );
};
```

`PlaidLink` wraps the view you provide as a child with a `Pressable` component and intercepts the `onPress` event.

### OAuth requirements

For Link Token based OAuth support, you must configure your `link_token` with a `redirect_uri` to support OAuth on iOS. Other than setting the `redirect_uri`, which must be a universal link, when you create the `link_token` no further configuration is required. Notably, no props are required on the React Native side.

For non-Link Token based OAuth support, you must pass two props to the PlaidLink React Native component:
1. `oauthRedirectUri` this is the same uri you would pass to the `redirect_uri` for Link Token based OAuth. It must be registered as a universal link.
2. `oauthNonce` this is a 16 character nonce.

In order for the React Native app to respond to the universal link, you will need to update your AppDelegate to inform the React Native Linking library when the universal link is received. See [OAuth requirements][plaid_oauthdocs] for more information.

### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here][plaid_eventdocs]. To receive these events in your React Native app, wrap the `PlaidLink` react component with the following in order to listen for those events:

```javascript
import React from 'react';
import { Text, NativeEventEmitter, NativeModules, Platform } from 'react-native';

class PlaidEventContainer extends React.Component {

  componentDidMount() {
    const emitter = new NativeEventEmitter(Platform.OS === 'ios' ? NativeModules.RNLinksdk : NativeModules.PlaidAndroid);
    this._listener = emitter.addListener('onEvent', (e) => console.log(e));
  }

  componentWillUnmount() {
    if (this._listener) {
      this._listener.remove();
    }
  }

  ...
}
```

You can also use the `usePlaidEmitter` hook in react functional components:

```javascript
  usePlaidEmitter((event: LinkEvent) => {
    console.log(event)
  })
```

# Version information

## Versions and release candidates

We create release candidates (e.g. 7.0.0-rc1) as beta previews for developers. These are helpful for customers who either are 1. waiting for a specific fix or 2. extremely eager for specific features. They do not hold the same quality guarantee as our official releases, and should NOT be used in production. The official releases come ~2 weeks after the first release candidate (rc1).

The latest stable version is the highest version without the suffix `-rcX`.

## Updating from previous versions.

When upgrading from a previous major version of this library, see the following notes for additional instructions:

- Upgrading [pre 5.x](./upgrade_notes)
- Upgrading [from 5.x onwards][upgrading]

# Version compatibility
| React Native SDK | Android SDK | iOS SDK | Status |
|---|---|---|---|
| 7.x.x | [3.2.0+]      | >=2.0.7  | In development |
| 6.x.x | [3.0.0-3.2.0) | >=2.0.1  | Active |
| 5.x.x | [2.1.0-3.0.0) | >=1.1.34 | Active |
| 4.x.x | [2.0.0-2.1.0) | <=1.1.33 | Active |
| 3.x.x | [1.0.0-2.0.0) | <=1.1.33 |  Deprecated |
| 2.x.x | [0.3.0-1.0.0) | <=1.1.27 |  Deprecated |
| 1.x.x | [0.1.0-0.3.0) | <=1.1.24 |  Deprecated |



[plaid_dashboard]: https://dashboard.plaid.com/team/api
[plaid_iosscripts]: https://plaid.com/docs/link/ios/#add-run-script
[plaid_rndocs]: https://plaid.com/docs/link/react-native/
[plaid_oauthdocs]: https://plaid.com/docs/#oauth
[plaid_eventdocs]: https://plaid.com/docs/#onevent-callback
[plaid_tokendocs]: https://plaid.com/docs/#create-link-token

[autolinking]: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
[turbomodules]: https://github.com/react-native-community/discussions-and-proposals/issues/40
[upgrading]: https://plaid.com/docs/link/react-native/#upgrading
