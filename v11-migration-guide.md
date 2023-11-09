# React Native Plaid Link V11 Migration Guide

## Overview

The upgrade from Plaid Link 9.x/10.x to 11.x introduces several important changes. It's crucial to understand these modifications to ensure your integration remains robust and error-free.

### Changes from SDK 9.x/10.x to 11.0

#### React Native Changes

1. **BREAKING - Authentication Method Changes**: Public key authentication support has been removed. It's imperative to migrate to Link Tokens. If your integration uses the public key, use the [migration guide](https://plaid.com/docs/link-token-migration-guide) for detailed instructions on transitioning to Link tokens.

2. **BREAKING OAuth Redirect Handling**: The deprecated `useDeepLinkRedirector` method for OAuth redirects has been removed. If your code relies on this method, it can be safely removed as it's no longer required.

3. **React Native Version Compatibility**: You can now use Plaid Link with any version of React Native. However, we recommend using a version that is [not archived](https://reactnative.dev/versions) for optimal performance and compatibility.

#### iOS Changes

1. **BREAKING - iOS Version Support**: Plaid Link no longer supports iOS 11, 12, and 13. If your application still targets these iOS versions, you must either continue using SDK 9.x/10.x or update your app to support newer iOS versions compatible with iOS SDK V5.x.

2. **BREAKING - iOS Event Metadata Encoding**: Event metadata keys are now encoded in `snake_case` instead of `camelCase` to match Android behavior. For example, `errorType` is now encoded as `error_type`. Update your code to handle these changes correctly. Refer to [ios/RNLinksdk.m](https://github.com/plaid/react-native-plaid-link-sdk/blob/2431c5427a21610ad97d7202ba205e6b63d1b84f/ios/RNLinksdk.m) for the full set of iOS keys.

#### Android Changes

1. **Upgrade to Kotlin 1.8**
   The Link Android SDK now uses Kotlin 1.8. Ensure your project is updated to this version to maintain compatibility.
