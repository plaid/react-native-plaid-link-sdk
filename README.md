# Plaid React Native SDK

![version](https://img.shields.io/npm/v/react-native-plaid-link-sdk)
[![License](https://img.shields.io/github/license/plaid/react-native-plaid-link-sdk)](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/LICENSE)

The Plaid React Native SDK provides the client-side component that your users will interact with in order to link their accounts to Plaid and allow you access to their accounts via the Plaid API. 

For more information about Plaid Link check out our
[introduction documentation](https://plaid.com/docs/link/#introduction-to-link).

Plaid currently supports two versions of the Plaid React Native SDK v10.x and v11.x. You can find v10 on the [master-v10](https://github.com/plaid/react-native-plaid-link-sdk/tree/master-v10) branch.

## Features

The SDK provides:

- A PlaidLink functional component.
- A function to open Link.
- A hook to handle [onEvent](https://plaid.com/docs/link/react-native/#onevent) callbacks.
- A function to dismiss link on iOS.

## Getting Started

Get started with our 📝 [documentation](https://plaid.com/docs/link/react-native/) and the 📱[example project](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/example/README.md), or ↔️ [Tiny Quickstart (React Native)](https://github.com/plaid/tiny-quickstart/tree/main/react_native) which is an end to end example demonstrating a minimal integration with this SDK.

If you're unfamiliar with React Native we recommend starting with the [environment setup instructions](https://reactnative.dev/docs/environment-setup).

In your React Native project directory:

```sh
npm install --save react-native-plaid-link-sdk
```

### iOS Setup

Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The latest version is ![version](https://img.shields.io/cocoapods/v/Plaid).

```bash switcher=false
pod 'Plaid', '~> <insert latest version>'
```

Autolinking should install the CocoaPods dependencies for iOS project. If it fails you can run 

```sh
cd ios && bundle install && bundle exec pod install
```

### Android Setup

- Android 5.0 (API level 21) and above.
  - Your `compileSdkVersion` must be `33`.
- Android gradle plugin `4.x` and above.

AutoLinking should handle all of the Android setup. 

Remember to register your Android package name in the [Dashboard](https://dashboard.plaid.com/developers/api). This is required in order to connect to OAuth institutions (which includes most major banks).

### React Native Setup

- To initialize `PlaidLink`, you will need to first create a `link_token` at [/link/token/create](https://plaid.com/docs/api/link/#linktokencreate). Check out our [QuickStart guide](https://plaid.com/docs/quickstart/#introduction) for additional API information.

#### Version >= 11.6.0

Starting from version `11.6.0`, we introduced the ability to preload part of the Link experience. You can initiate the preloading process by invoking the `create` function.

```typescript
function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
): LinkTokenConfiguration {
  return {
    token: token,
    // Hides native activity indicator if true.
    noLoadingState: noLoadingState,
  };
}

const tokenConfiguration = createLinkTokenConfiguration("#GENERATED_LINK_TOKEN#");
create(tokenConfiguration);
``` 

After calling `create`, you can subsequently invoke the `open` function. Note that maximizing the delay between these two calls will reduce latency for your users by allowing Link more time to load.

```typescript
function createLinkOpenProps(): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      // User was able to successfully link their account.
      console.log('Success: ', success);
    },
    onExit: (linkExit: LinkExit) => {
      // User exited Link session. There may or may not be an error depending on what occured.
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    // MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

const openProps = createLinkOpenProps();
open(openProps);
```

#### Version < 11.6.0

In versions prior to `11.6.0`, you can open a link by calling the `openLink` function.

```typescript
// Create PlaidLinkProps from the provided token string.
function makeLinkTokenProps(token: string): PlaidLinkProps {
  return {
    tokenConfig: {
      token: token,
      logLevel: LinkLogLevel.ERROR,
      // Hides native activity indicator if true.
      noLoadingState: false, 
    },
    onSuccess: (success: LinkSuccess) => {
      // User was able to successfully link their account.
      console.log('Success: ', success); 
      success.metadata.accounts.forEach(it => console.log('accounts', it));
    },
    onExit: (linkExit: LinkExit) => {
      // User exited Link session. There may or may not be an error depending on what occured.
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    // MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
  };
}

const linkTokenProps = makeLinkTokenProps("#GENERATED_LINK_TOKEN#");
openLink(linkTokenProps);
```

#### OAuth requirements

:warning: All integrations must use version 9.0.0 or later of the React Native SDK (requires version 4.1.0 or later of the iOS LinkKit SDK) to maintain support for Chase OAuth on iOS. 

##### Android OAuth Requirements

###### Register your app package name
1. Log into your [Plaid Dashboard](https://dashboard.plaid.com/developers/api) and navigate to the API page under the Developers tab.
2. Next to Allowed Android package names click "Configure" then "Add New Android Package Name".
3. Enter your package name, for example `com.plaid.example`.
4. Click "Save Changes", you may be prompted to re-enter your password.

##### iOS OAuth Requirements

For iOS OAuth to work, specific requirements must be met.
1. Redirect URIs must be [registered](https://plaid.com/docs/link/ios/#register-your-redirect-uri), and set up as [universal links](https://developer.apple.com/documentation/xcode/supporting-associated-domains).
2. Your native iOS application, must be configured with your associated domain. See your iOS [set up universal links](https://plaid.com/docs/link/ios/#set-up-universal-links) for more information.


##### Link Token OAuth Requirements

- On iOS you must configure your `link_token` with a [redirect_uri](https://plaid.com/docs/api/tokens/#link-token-create-request-redirect-uri) to support OAuth. When creating a `link_token` for initializing Link on Android, `android_package_name` must be specified and `redirect_uri` must be left blank.

- On Android you must configure your `link_token` with an [android_package_name](https://plaid.com/docs/api/tokens/#link-token-create-request-android-package-name) to support OAuth. When creating a `link_token` for initializing Link on iOS, `android_package_name` must be left blank and `redirect_uri` should be used instead.


#### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here](https://plaid.com/docs/link/react-native/#onevent). To receive these events in your React Native app, use the `usePlaidEmitter` hook in react functional components:

```javascript
  usePlaidEmitter((event: LinkEvent) => {
    console.log(event)
  })
```

## Upgrading

Plaid releases updates to the SDK approximately every few months. For the best user experience, we recommend using the latest version of the SDK.

Major SDK versions are released annually. SDK versions are supported for two years; with each major SDK release, Plaid will stop officially supporting any previous SDK versions that are more than two years old. 

While these older versions are expected to continue to work without disruption, Plaid will not provide assistance with unsupported SDK versions. 

## Version compatibility

| Plaid SDK Version | Min React Native Version | Android SDK | Android Min Version | Android Compile Version| iOS SDK | iOS Min Version | Status                        |
|-------------------|--------------------------|-------------|---------------------|------------------------|---------|-----------------|-------------------------------|
| 12.0.3            | *                        | [5.0.0+]    | 21                  | 34                     | >=6.0.4 |  14.0           | Active, supports Xcode 16.1.0 |
| 12.0.2            | *                        | [5.0.0+]    | 21                  | 34                     | >=6.0.2 |  14.0           | Active, supports Xcode 16.1.0 |
| 12.0.1            | *                        | [5.0.0+]    | 21                  | 34                     | >=6.0.2 |  14.0           | Active, supports Xcode 16.1.0 |
| 12.0.0            | *                        | [5.0.0+]    | 21                  | 34                     | >=6.0.0 |  14.0           | Active, supports Xcode 16.1.0 |
| 12.0.0-beta.3     | *                        | [4.4.0+]    | 21                  | 34                     | >=6.0.0 |  14.0           | Active, supports Xcode 15.3.0 |
| 12.0.0-beta.2     | *                        | [4.4.0+]    | 21                  | 34                     | >=6.0.0 |  14.0           | Active, supports Xcode 15.3.0 |
| 12.0.0-beta.1     | *                        | [4.4.0+]    | 21                  | 34                     | >=6.0.0 |  14.0           | **Deprecated**                |
| 11.13.3           | *                        | [4.6.1+]    | 21                  | 34                     | >=5.6.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.13.2           | *                        | [4.6.1+]    | 21                  | 34                     | >=5.6.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.13.1           | *                        | [4.6.1+]    | 21                  | 34                     | >=5.6.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.13.0           | *                        | [4.6.1+]    | 21                  | 34                     | >=5.6.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.12.1           | *                        | [4.6.0+]    | 21                  | 34                     | >=5.6.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.12.0           | *                        | [4.6.0+]    | 21                  | 34                     | >=5.6.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.11.2           | *                        | [4.5.1+]    | 21                  | 34                     | >=5.6.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.11.1           | *                        | [4.5.1+]    | 21                  | 34                     | >=5.6.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.11.0           | *                        | [4.5.0+]    | 21                  | 34                     | >=5.6.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.10.3           | *                        | [4.4.2+]    | 21                  | 34                     | >=5.5.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.10.2           | *                        | [4.3.1+]    | 21                  | 34                     | >=5.5.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.10.1           | *                        | [4.3.1+]    | 21                  | 34                     | >=5.5.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.10.0           | *                        | [4.3.1+]    | 21                  | 34                     | >=5.5.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.9.0            | *                        | [4.3.1+]    | 21                  | 34                     | >=5.5.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.8.2            | *                        | [4.3.1+]    | 21                  | 34                     | >=5.4.2 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.8.1            | *                        | [4.3.1+]    | 21                  | 34                     | >=5.4.2 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.8.0            | *                        | [4.3.1+]    | 21                  | 34                     | >=5.4.2 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.7.1            | *                        | [4.3.0+]    | 21                  | 34                     | >=5.4.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.7.0            | *                        | [4.3.0+]    | 21                  | 34                     | >=5.4.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.6.0            | *                        | [4.2.0+]    | 21                  | 34                     | >=5.3.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.5.2            | *                        | [4.1.1+]    | 21                  | 34                     | >=5.2.1 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.5.1            | *                        | [4.1.1+]    | 21                  | 34                     | >=5.2.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.5.0            | *                        | [4.1.1+]    | 21                  | 34                     | >=5.2.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.4.0            | *                        | [4.1.1+]    | 21                  | 34                     | >=5.1.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.3.0            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.1.0 |  14.0           | Active, supports Xcode 15.0.1 |
| ~11.2.0~          | *                        | [4.1.0+]    | 21                  | 34                     | >=5.1.0 |  14.0           | **Deprecated**                |
| 11.1.0            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.1.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.0.3            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.0.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.0.2            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.0.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.0.1            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.0.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 11.0.0            | *                        | [4.0.0+]    | 21                  | 34                     | >=5.0.0 |  14.0           | Active, supports Xcode 15.0.1 |
| 10.13.0           | >= 0.66.0                | [3.14.3+]   | 21                  | 33                     | >=4.7.2 |  11.0           | Active, supports Xcode 14     |
| 10.12.0           | >= 0.66.0                | [3.14.3+]   | 21                  | 33                     | >=4.7.1 |  11.0           | Active, supports Xcode 14     |
| 10.11.0           | >= 0.66.0                | [3.14.1+]   | 21                  | 33                     | >=4.7.1 |  11.0           | Active, supports Xcode 14     |
| ~10.10.0~         | >= 0.66.0                | [3.14.2+]   | 21                  | 33                     | >=4.7.1 |  11.0           | **Deprecated**                |
| 10.9.1            | >= 0.66.0                | [3.14.1+]   | 21                  | 33                     | >=4.7.0 |  11.0           | Active, supports Xcode 14     |
| 10.9.0            | >= 0.66.0                | [3.14.1+]   | 21                  | 33                     | >=4.7.0 |  11.0           | Active, supports Xcode 14     |
| 10.8.0            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.7.0 |  11.0           | Active, supports Xcode 14     |
| 10.7.0            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.6.4 |  11.0           | Active, supports Xcode 14     |
| 10.6.4            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.6.4 |  11.0           | Active, supports Xcode 14     |
| 10.6.3            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.6.4 |  11.0           | Active, supports Xcode 14     |
| 10.6.2            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.6.4 |  11.0           | Deprecated, supports Xcode 14 |
| 10.6.0            | >= 0.66.0                | [3.14.0+]   | 21                  | 33                     | >=4.6.4 |  11.0           | Deprecated, supports Xcode 14 |
| 10.5.0            | >= 0.66.0                | [3.13.2+]   | 21                  | 33                     | >=4.5.1 |  11.0           | Deprecated, supports Xcode 14 |
| 10.4.0            | >= 0.66.0                | [3.13.2+]   | 21                  | 33                     | >=4.4.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.3.0            | >= 0.66.0                | [3.12.1+]   | 21                  | 33                     | >=4.3.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.2.0            | >= 0.66.0                | [3.12.0+]   | 21                  | 33                     | >=4.3.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.1.0            | >= 0.66.0                | [3.11.0+]   | 21                  | 33                     | >=4.2.0 |  11.0           | Deprecated, supports Xcode 14 |
| 10.0.0            | >= 0.66.0                | [3.10.1+]   | 21                  | 33                     | >=4.1.0 |  11.0           | Deprecated, supports Xcode 14 |
| 9.1.0             | >= 0.65.3                | [3.13.2+]   | 21                  | 33                     | >=4.4.0 |  11.0           | Deprecated, supports Xcode 14 |
| 9.0.1             | >= 0.65.3                | [3.10.1+]   | 21                  | 33                     | >=4.1.0 |  11.0           | Deprecated, supports Xcode 14 |
| 9.0.0             | >= 0.65.3                | [3.10.1+]   | 21                  | 33                     | >=4.1.0 |  11.0           | Deprecated, supports Xcode 14 |


## Contributing

See the [contributor guidelines](CONTRIBUTING.md) to learn how to contribute to the repository.
