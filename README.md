# Getting Started

In your react-native project directory:

```sh
npm install --save react-native-plaid-link-sdk
```

## Updating from previous versions.

When upgrading from a previous major version of this library, see the following notes for additional instructions:

- Upgrading [pre 5.x](./upgrade_notes)
- Upgrading [from 5.x onwards][upgrading]

## iOS

Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The latest version is ![version](https://img.shields.io/cocoapods/v/Plaid).

```sh
pod 'Plaid', '~> <insert latest version>'
```

Then install your cocoapods dependencies:

```sh
(cd ios && pod install)
```

Add a Run Script build phase (after the [CP] Embed Pods Frameworks step) to your target as [described in Plaid Link for iOS documentation](https://plaid.com/docs/link/ios/#add-run-script). This strips simulator symbols from App Store release builds.

That's it if using a recent react-native version with [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) support.

### Manual Integration

If using a version of react-native without [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) support, then you will need to:

```sh
react-native link react-native-plaid-link-sdk
```

followed by

1. In Xcode, in the project navigator, right click `Libraries` ▶ `Add Files to [your project's name]`
2. Go to `node_modules` ▶ `react-native-plaid-link-sdk` ▶ `ios` and add `RNLinksdk.xcodeproj`
3. In Xcode, in the project navigator, select your project. Add `libRNLinksdk.a` to your project's `Build Phases` ▶ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Android
### 1. Register your app id
1. Log into your [Plaid Dashboard](https://dashboard.plaid.com/team/api) at the API page
2. Next to Allowed Android package names click "Configure" then "Add New Android Package Name"
3. Enter your package name, for example `com.plaid.example`
4. Click "Save Changes", you may be prompted to re-enter your password

### 2. Add PlaidPackage to your application
1. Go to `android/app/src/main/java/<AppName>/MainApplication.java`
2. Add `import com.plaid.PlaidPackage;` to the imports section
3. Add `packages.add(new PlaidPackage());` to `List<ReactPackage> getPackages();`

## Plaid Link React Native SDK
For a full guide and migration guides please vist our [docs](https://plaid.com/docs/link/react-native/)

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

## Version Compatibiltiy
| React Native SDK | Android SDK | iOS SDK | Status |
|---|---|---|---|
| 7.x.x | [3.2.0+]      | >=2.0.7  | Active     |
| 6.x.x | [3.0.0-3.2.0) | >=2.0.1  | Active |
| 5.x.x | [2.1.0-3.0.0) | >=1.1.34 | Active |
| 4.x.x | [2.0.0-2.1.0) | <=1.1.33 | Active |
| 3.x.x | [1.0.0-2.0.0) | <=1.1.33 |  Deprecated |
| 2.x.x | [0.3.0-1.0.0) | <=1.1.27 |  Deprecated |
| 1.x.x | [0.1.0-0.3.0) | <=1.1.24 |  Deprecated |

## PlaidLink

To initialize `PlaidLink`, you will need to first create a `link_token` at [/link/token/create](https://plaid.com/docs/#create-link-token).
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

In order for the React Native app to respond to the universal link, you will need to update your AppDelegate to inform the React Native Linking library when the universal link is received. See [OAuth requirements](https://plaid.com/docs/#oauth) for more information.

### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here](https://plaid.com/docs/#onevent-callback). To receive these events in your React Native app, wrap the `PlaidLink` react component with the following in order to listen for those events:

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

[upgrading]: https://plaid.com/docs/link/react-native/#upgrading
