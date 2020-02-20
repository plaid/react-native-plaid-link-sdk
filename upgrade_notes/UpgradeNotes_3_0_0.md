# Upgrade notes:

## iOS:

Version 3.0 requires version 1.1.27 of the [Plaid Link iOS SDK](https://github.plaid.com/plaid/link-ios-sdk). When upgrading to 3.0.0 of this react native library, make sure to do the following:

1. Update the required version of `Plaid` in your `ios/Podfile` to the following: 

`pod 'Plaid', '~> 1.1.27'`

2. `cd ios` then `pod update`
3. Rebuild and re-run your react native project.

## Android
* Remove the `LinkActivity` and/or `LinkRedirectActivity` in your manifest
* Register your app id(s) on the [dashboard](https://dashboard.plaid.com/team/api).  Your registered redirect URIs will still be used for iOS
* Remove the `Plaid.create(...)` call, the SDK is now initialized via a content provider similar to [Firebase](https://firebase.googleblog.com/2016/12/how-does-firebase-initialize-on-android.html)
* Set options is now done with the new `Plaid.setOptions(...)` method
* Remove your public key programmatically from the manifest, we now use the value passed in the PlaidLink property
* Remove `webviewRedirectUri` from the in the `PlaidLink` properties
* Merge `onExit` and `onException` to a single method `onExit` which will return a `PlaidError` object. The `PlaidError` object wraps exceptions now.