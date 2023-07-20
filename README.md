# Plaid React Native SDK

![version](https://img.shields.io/npm/v/react-native-plaid-link-sdk)
[![License](https://img.shields.io/github/license/plaid/react-native-plaid-link-sdk)](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/LICENSE)

The Plaid React Native SDK provides the client-side component that your users will interact with in order to link their accounts to Plaid and all you to access their accounts via the Plaid API. 

For more information about Plaid Link check out our
[introduction documentation](https://plaid.com/docs/link/#introduction-to-link).

## Features

The SDK provides:

- A PlaidLink functional component.
- A function to open Link.
- A hook to handle [onEvent](https://plaid.com/docs/link/react-native/#onevent) callbacks.
- A function to dismiss link on iOS.

## Getting Started

Get started with our 📝 [documentation](https://plaid.com/docs/link/react-native/) or the 📱[example project](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/example/README.md).

If you're unfamiliar with React Native we recommend starting with the [environment setup instructions](https://reactnative.dev/docs/environment-setup).

In your React Native project directory:

```sh
npm install --save react-native-plaid-link-sdk
```

### iOS Setup

Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The latest version is ![version](https://img.shields.io/cocoapods/v/Plaid).

Autolinking should install the CocoaPods dependencies for iOS project. If it fails you can run 

```sh
cd ios && bundle install && bundle exec pod install
```

#### OAuth Requirements

:warning: All integrations must migrate to version 9.0.0 or later of the React Native SDK (requires version 4.1.0 or later of the iOS LinkKit SDK) by September 30, 2023, to maintain support for Chase OAuth on iOS. 

For iOS OAuth to work, specific requirements must be met.
* Redirect URIs must be [registered](https://plaid.com/docs/link/ios/#register-your-redirect-uri), and set up as [universal links](https://developer.apple.com/documentation/xcode/supporting-associated-domains).


### Android Setup

- Android 5.0 (API level 21) and above.
  - Your `compileSdkVersion` must be `33`.
- Android gradle plugin `4.x` and above.

AutoLinking should handle all of the Android setup. 

#### OAuth Requirements

##### Register your app id
1. Log into your [Plaid Dashboard](https://dashboard.plaid.com/team/api) at the API page
2. Next to Allowed Android package names click "Configure" then "Add New Android Package Name"
3. Enter your package name, for example `com.plaid.example`
4. Click "Save Changes", you may be prompted to re-enter your password


### React Native Setup

- To initialize `PlaidLink`, you will need to first create a `link_token` at [/link/token/create][https://plaid.com/docs/#create-link-token]. Check out our [QuickStart guide](https://plaid.com/docs/quickstart/#introduction) for additional API information.

- After creating a `link_token`, you'll need to pass it into your app and use it to launch Link:

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

#### OAuth requirements

For Link Token based OAuth support, you must configure your `link_token` with a [redirect_uri](https://plaid.com/docs/api/tokens/#link-token-create-request-redirect-uri) to support OAuth on iOS. On Android you need to register your package name as described above. Other than setting the `redirect_uri`, which must be a universal link, when you create the `link_token` no further configuration is required. Notably, no props are required on the React Native side.

In order for the React Native app to respond to the universal link, you will need to update your AppDelegate to inform the React Native Linking library when the universal link is received. See [OAuth requirements](https://plaid.com/docs/#oauth) for more information.

#### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here](https://plaid.com/docs/link/react-native/#onevent). To receive these events in your React Native app, wrap the `PlaidLink` react component with the following in order to listen for those events:

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

## Version compatibility

| Plaid SDK Version | Min React Native Version | Android SDK | Android Min Version | Android Compile Version| iOS SDK | iOS Min Version | Status                        |
|-------------------|--------------------------|-------------|---------------------|------------------------|---------|-----------------|-------------------------------|
| 10.3.0            | >= 0.66.0                | [3.12.1+]   | 21                  | 33                     | >=4.3.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.2.0            | >= 0.66.0                | [3.12.0+]   | 21                  | 33                     | >=4.3.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.1.0            | >= 0.66.0                | [3.11.0+]   | 21                  | 33                     | >=4.2.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.0.0            | >= 0.66.0                | [3.10.1+]   | 21                  | 33                     | >=4.1.0 |  11.0           | Deprecated, supports Xcode 14 |
| 9.x.x             | >= 0.65.3                | [3.10.1+]   | 21                  | 33                     | >=4.1.0 |  11.0           | Deprecated, supports Xcode 14 |


## Contributing

See the [contributor guidelines](CONTRIBUTING.md) to learn how to contribute to the repository.
