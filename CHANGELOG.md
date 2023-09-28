# RELEASES

## LinkKit V10.6.0 — 2023-09-XX

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [501](https://github.com/plaid/react-native-plaid-link-sdk/issues/501). You will now receive a LinkExit for any configuration errors.

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
