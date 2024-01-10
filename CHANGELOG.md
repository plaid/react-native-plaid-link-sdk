# RELEASES

## LinkKit V11.1.0 — 2024-01-10

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates iOS SDK to `5.1.0`.
- Updates `LinkTokenConfiguration.noLoadingState` from required to optional.

```
<PlaidLink
        tokenConfig={{
            token: "#GENERATED_LINK_TOKEN#",
            // OPTIONAL - log level.
            logLevel: LinkLogLevel.ERROR,
            // No longer required.
            noLoadingState: false,
        }}
        onSuccess={(success: LinkSuccess) => { console.log(success) }}
        onExit={(exit: LinkExit) => { console.log(exit) }}
        // OPTIONAL - MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
        // UI is always presented in full screen on Android.
        iOSPresentationStyle={LinkIOSPresentationStyle.MODAL}
    >
```

The update to the next major version of our mobile SDKs **includes breaking changes**. Please see our [migration guide]
(https://github.com/plaid/react-native-plaid-link-sdk/blob/master/v11-migration-guide.md) for full details.


### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Flutter usage tracking.

#### Changes

- Upgrade to Kotlin 1.8.22
- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

#### Removals

- Remove deprecated support for public key authentication.
- Remove extraParams Map field from API.

[Android migration guide](https://github.com/plaid/plaid-link-android#migration-guide)

### iOS

iOS SDK [5.1.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.1.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Resolve issue where PrivacyInfo.xcprivacy was missing NSPrivacyCollectedDataTypes.
- Improved Remember Me experience.
- Improved OAuth out-of-process webview open options.



## LinkKit V11.0.3 — 2023-11-13

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Removes circular dependency.

The update to the next major version of our mobile SDKs **includes breaking changes**. Please see our [migration guide]
(https://github.com/plaid/react-native-plaid-link-sdk/blob/master/v11-migration-guide.md) for full details.


### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Flutter usage tracking.

#### Changes

- Upgrade to Kotlin 1.8.22
- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

#### Removals

- Remove deprecated support for public key authentication.
- Remove extraParams Map field from API.

[Android migration guide](https://github.com/plaid/plaid-link-android#migration-guide)

### iOS

iOS SDK [5.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Drop support for iOS 11, 12, & 13.
- Reduce iOS SDK size from 15 megabytes to 11 megabytes.
- Remove deprecated support for public key authentication.
- Remove deprecated continue from method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated continue method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated open with OpenOptions function.
- Make webview inspectable on iOS >= 16.4.
- Add Privacy Manifest for `UserDefaults` use.

[iOS migration guide](https://github.com/plaid/plaid-link-ios/blob/master/v5-migration-guide.md)

## LinkKit V11.0.2 — 2023-11-13

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- `LinkAccountSubtypes` is now exported

The update to the next major version of our mobile SDKs **includes breaking changes**. Please see our [migration guide]
(https://github.com/plaid/react-native-plaid-link-sdk/blob/master/v11-migration-guide.md) for full details.


### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Flutter usage tracking.

#### Changes

- Upgrade to Kotlin 1.8.22
- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

#### Removals

- Remove deprecated support for public key authentication.
- Remove extraParams Map field from API.

[Android migration guide](https://github.com/plaid/plaid-link-android#migration-guide)

### iOS

iOS SDK [5.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Drop support for iOS 11, 12, & 13.
- Reduce iOS SDK size from 15 megabytes to 11 megabytes.
- Remove deprecated support for public key authentication.
- Remove deprecated continue from method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated continue method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated open with OpenOptions function.
- Make webview inspectable on iOS >= 16.4.
- Add Privacy Manifest for `UserDefaults` use.

[iOS migration guide](https://github.com/plaid/plaid-link-ios/blob/master/v5-migration-guide.md)

## LinkKit V11.0.1 — 2023-11-13

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- `LinkAccountType` is now exported
- Resolve [issue 598](https://github.com/plaid/react-native-plaid-link-sdk/issues/598) where a `LinkLogLevel` had to be provided for Android to open Link.

The update to the next major version of our mobile SDKs **includes breaking changes**. Please see our [migration guide]
(https://github.com/plaid/react-native-plaid-link-sdk/blob/master/v11-migration-guide.md) for full details.


### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Flutter usage tracking.

#### Changes

- Upgrade to Kotlin 1.8.22
- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

#### Removals

- Remove deprecated support for public key authentication.
- Remove extraParams Map field from API.

[Android migration guide](https://github.com/plaid/plaid-link-android#migration-guide)

### iOS

iOS SDK [5.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Drop support for iOS 11, 12, & 13.
- Reduce iOS SDK size from 15 megabytes to 11 megabytes.
- Remove deprecated support for public key authentication.
- Remove deprecated continue from method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated continue method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated open with OpenOptions function.
- Make webview inspectable on iOS >= 16.4.
- Add Privacy Manifest for `UserDefaults` use.

[iOS migration guide](https://github.com/plaid/plaid-link-ios/blob/master/v5-migration-guide.md)

## LinkKit V10.9.0 — 2023-11-13

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Update iOS SDK to [4.7.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.7.0)


### Android

Android SDK [3.14.1](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |

### Additions

- Flutter usage tracking.

### Changes

- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

### Removals

- None


### iOS

iOS SDK [4.7.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.7.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

## LinkKit V11.0.0 — 2023-11-09

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

The update to the next major version of our mobile SDKs **includes breaking changes**. Please see our [migration guide]
(https://github.com/plaid/react-native-plaid-link-sdk/blob/master/v11-migration-guide.md) for full details.


- Update Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)
- Update iOS SDK to [5.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.0.0)

### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Flutter usage tracking.

#### Changes

- Upgrade to Kotlin 1.8.22
- Change LinkActivity to SingleInstance to fix issue with OAuth Redirects on Android 14.

#### Removals

- Remove deprecated support for public key authentication.
- Remove extraParams Map field from API.

[Android migration guide](https://github.com/plaid/plaid-link-android#migration-guide)

### iOS

iOS SDK [5.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Drop support for iOS 11, 12, & 13.
- Reduce iOS SDK size from 15 megabytes to 11 megabytes.
- Remove deprecated support for public key authentication.
- Remove deprecated continue from method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated continue method (this method no longer needs to be called for OAuth redirects).
- Remove deprecated open with OpenOptions function.
- Make webview inspectable on iOS >= 16.4.
- Add Privacy Manifest for `UserDefaults` use.

[iOS migration guide](https://github.com/plaid/plaid-link-ios/blob/master/v5-migration-guide.md)

## LinkKit V10.8.0 — 2023-11-07

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Update iOS SDK to [4.7.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.7.0)


### Android

Android SDK [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


### iOS

iOS SDK [4.7.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.7.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

## LinkKit V10.7.0 — 2023-11-07

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [589](https://github.com/plaid/react-native-plaid-link-sdk/issues/589)


### Android

Android SDK [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


### iOS

iOS SDK [4.6.4](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.4)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |


## LinkKit V10.6.4 — 2023-10-12

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue where PLKEmbeddedView doesn't compile on Xcode < 14.3.


### Android

Android SDK [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


### iOS

iOS SDK [4.6.4](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.4)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

## LinkKit V10.6.3 — 2023-10-11

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [564](https://github.com/plaid/react-native-plaid-link-sdk/issues/564) React native web issue doesn't work with 10.6.0.


### Android

Android SDK [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


### iOS

iOS SDK [4.6.4](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.4)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

## LinkKit V10.6.2 — 2023-10-10

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [565](https://github.com/plaid/react-native-plaid-link-sdk/issues/565). Where NPM package was in excess of 100mb.


### Android

Android SDK [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


### iOS

iOS SDK [4.6.4](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.4)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |


## LinkKit V10.6.0 — 2023-09-29

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [501](https://github.com/plaid/react-native-plaid-link-sdk/issues/501). You will now receive a LinkExit for any configuration errors.
- [Add support for AGP 8](https://github.com/plaid/react-native-plaid-link-sdk/pull/554).
- Add **LinkEventNames** - `IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION`, `SELECT_FILTERED_INSTITUTION`, `SELECT_BRAND`, `SELECT_AUTH_TYPE`, `SUBMIT_ACCOUNT_NUMBER`, `SUBMIT_DOCUMENTS`, `SUBMIT_DOCUMENTS_SUCCESS`, `SUBMIT_DOCUMENTS_ERROR`, `SUBMIT_ROUTING_NUMBER`, `VIEW_DATA_TYPES`, `SUBMIT_PHONE`, `SKIP_SUBMIT_PHONE`, `VERIFY_PHONE`, & `CONNECT_NEW_INSTITUTION`.
- Add **LinkEventViewNames** - `DATA_TRANSPARENCY`, `DATA_TRANSPARENCY_CONSENT`, `NUMBERS_SELECT_INSTITUTION`, `SELECT_AUTH_TYPE`, `SUBMIT_PHONE`, `VERIFY_PHONE`, `SELECT_SAVED_INSTITUTION`, `SELECT_SAVED_ACCOUNT`, `SELECT_BRAND`, `SUBMIT_DOCUMENTS`, `SUBMIT_DOCUMENTS_SUCCESS`, `SUBMIT_DOCUMENTS_ERROR`, & `UPLOAD_DOCUMENTS`.
- Add **LinkEventMetadata** fields `isUpdateMode`, `accountNumberMask`, & `matchReason`.



### Android

Update Android SDK from [3.13.2](https://github.com/plaid/plaid-link-android/releases/tag/v3.13.2) to [3.14.0](https://github.com/plaid/plaid-link-android/releases/tag/v3.14.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


#### Changes

- Add IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION, SELECT_BRAND, SELECT_FILTERED_INSTITUTION, SUBMIT_ACCOUNT_NUMBER, SUBMIT_DOCUMENTS, SUBMIT_DOCUMENTS_SUCCESS, SUBMIT_DOCUMENTS_ERROR, VIEW_DATA_TYPES, SUBMIT_PHONE, SKIP_SUBMIT_PHONE, VERIFY_PHONE, and CONNECT_NEW_INSTITUTION event names.
- Add DATA_TRANSPARENCY, DATA_TRANSPARENCY_CONSENT, NUMBERS_SELECT_INSTITUTION, SUBMIT_PHONE, VERIFY_PHONE, SELECT_SAVED_INSTITUTION, SELECT_SAVED_ACCOUNT, and SELECT_BRAND event view names.
- Add is_update_mode, match_reason, and account_number_mask event metadata fields.

### iOS

Update iOS SDK from [4.5.1](https://github.com/plaid/plaid-link-ios/releases/tag/4.5.1) to [4.6.4](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.4)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

#### Changes

- Reduce SDK Size from 17.6MB to 14.7MB.
- Expose toObjC methods for React Native SDK.
- Only displays initial loading indicator for sessions with high latency on initial load.
- Fix double navigation bar for charles schwab.
- Add new event and view names.
- Add missing event metadata fields.
- Fix transparent loading state during OAuth redirect.
- Resolves bug where half-pane Link header could overlap the status bar.

## LinkKit V10.5.0 — 2023-08-08

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Update iOS Native SDK.
- Add support to present Link full screen. `PlaidLinkProps` not supports passing a `LinkIOSPresentationStyle`. Pass `FULL_SCREEN` to present Link full screen instead of as a modal. For more information checkout the [pull-request](https://github.com/plaid/react-native-plaid-link-sdk/pull/543).

### Android

[Android SDK 3.13.2](https://github.com/plaid/plaid-link-android/releases/tag/v3.13.2)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


#### Changes

- Changed LinkRedirectActivity theme from Material to MaterialComponents.

### iOS

[iOS SDK 4.5.1](https://github.com/plaid/plaid-link-ios/releases/tag/4.5.1)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

#### Changes

- Add identityVerificationPendingReviewSession event name.
- Bug fixes.

## LinkKit V10.4.0 — 2023-06-13

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Update Native SDKs.

### Android

[Android SDK 3.13.2](https://github.com/plaid/plaid-link-android/releases/tag/v3.13.2)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


#### Changes

- Changed LinkRedirectActivity theme from Material to MaterialComponents.

### iOS

[iOS SDK 4.4.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.4.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

#### Changes

- Updates LinkKit loading state activity indicator.
- Updates LinkKit loading state to use a transparent background.


## LinkKit V10.3.0 — 2023-05-08

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Update Example App.
- Fix event metadata JSON key inconsistency between iOS & Android.


### Android

[Android SDK 3.12.1](https://github.com/plaid/plaid-link-android/releases/tag/v3.12.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |


#### Changes

- Fix bug where certain out-of-process webview handoffs fail.

### iOS

[iOS SDK 4.3.0](https://github.com/plaid/plaid-link-ios/releases/tag/4.3.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 14.0 |
| iOS | >= 11.0 |

#### Changes

- Fix LinkViewController memory leak.
- Prevent IDV users from being asked for camera permission multiple times.
- Update deprecated continue(from:) to be no-op.
- Reduce SDK size by ~20%.
