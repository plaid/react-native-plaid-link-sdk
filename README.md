# Getting Started ![version](https://img.shields.io/npm/v/react-native-plaid-link-sdk)

In your react-native project directory:

```sh
npm install --save react-native-plaid-link-sdk
```

For a sample app demonstrating a minimal integration with this SDK, see the [Tiny Quickstart (React Native)](https://github.com/plaid/tiny-quickstart/tree/main/react_native). For a full guide and migration guides please vist our [docs][plaid_rndocs].

## iOS setup
Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The latest version is ![version](https://img.shields.io/cocoapods/v/Plaid).

```sh
pod 'Plaid', '~> <insert latest version>'
```

Then install your cocoapods dependencies:

```sh
(cd ios && pod install)
```

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

### OAuth Requirements

:warning: All integrations must migrate to version 9.0.0 or later of the React Native SDK (requires version 4.1.0 or later of the iOS LinkKit SDK) by June 30, 2023, to maintain support for Chase OAuth on iOS. 

For iOS OAuth to work, specific requirements must be met.
* Redirect URIs must be registered, and set up as universal links ([docs](https://plaid.com/docs/link/ios/#register-your-redirect-uri))
* Deep linking must be set up in the application delegate class (see code sample below)
* The exported `useDeepLinkRedirector` method must be invoked. If you are using the `PlaidLink` component it is invoked automatically, but if you are calling `openLink` programatically you must invoke `useDeepLinkRedirector`.

```objective-c
#import "AppDelegate.h"
...
#import <React/RCTLinkingManager.h>

...

@implementation AppDelegate

...

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:app openURL:url options:options];
}

// Needed for universal links, which are required for Plaid iOS OAuth.
- (BOOL)application:(UIApplication *)application
            continueUserActivity:(NSUserActivity *)userActivity
            restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

...

@end
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
| 9.x.x | [3.10.1+]      | >=4.1.0 |  Active, supports Xcode 14 |
| 8.x.x | [3.10.1+]      | >=3.1.0 |  Deprecated, supports Xcode 14 |
| 7.x.x | [3.2.0+]      | >=2.0.11 |  Deprecated, supports Xcode <= 13 |
| 6.x.x | [3.0.0-3.2.0) | >=2.0.1  |  Deprecated |
| 5.x.x | [2.1.0-3.0.0) | >=1.1.34 |  Deprecated |
| 4.x.x | [2.0.0-2.1.0) | <=1.1.33 |  Deprecated |
| 3.x.x | [1.0.0-2.0.0) | <=1.1.33 |  Deprecated |
| 2.x.x | [0.3.0-1.0.0) | <=1.1.27 |  Deprecated |
| 1.x.x | [0.1.0-0.3.0) | <=1.1.24 |  Deprecated |



[plaid_dashboard]: https://dashboard.plaid.com/team/api
[plaid_rndocs]: https://plaid.com/docs/link/react-native/
[plaid_oauthdocs]: https://plaid.com/docs/#oauth
[plaid_eventdocs]: https://plaid.com/docs/#onevent-callback
[plaid_tokendocs]: https://plaid.com/docs/#create-link-token

[autolinking]: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
[turbomodules]: https://github.com/react-native-community/discussions-and-proposals/issues/40
[upgrading]: https://plaid.com/docs/link/react-native/#upgrading
