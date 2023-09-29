# RELEASES

## LinkKit V10.6.0 — 2023-09-XX

### React Native

#### Requirements

| Name | Version |
|------|---------|
| React Native | >= [66.0](https://reactnative.dev/blog/2021/10/01/version-066) |

#### Changes

- Resolve Issue [501](https://github.com/plaid/react-native-plaid-link-sdk/issues/501). You will now receive a LinkExit for any configuration errors.
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

Update iOS SDK from [4.5.1](https://github.com/plaid/plaid-link-ios/releases/tag/4.5.1) to [4.6.2](https://github.com/plaid/plaid-link-ios/releases/tag/4.6.2)

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
