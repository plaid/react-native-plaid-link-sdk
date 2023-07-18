# RELEASES

## LinkKit V10.4.0 — 2023-06-13

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= 66.0 |

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
| React Native | >= 66.0 |

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