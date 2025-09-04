# RELEASES

## LinkKit V12.5.1 — 2025-09-04

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolve issue [803](https://github.com/plaid/react-native-plaid-link-sdk/issues/803) Support for react native 0.81+


### Android

Android SDK [5.3.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.3.2)

### Additions

- Upgrade com.google.protobuf:protobuf-kotlin-lite to 3.25.5
- Ensure SDK screens resize for keyboard insets on Android 15+

### Changes

- None

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.0)

### Changes

- Add issueDescription and issueDetectedAt to EventMetadata.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.5.0 — 2025-09-04

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Updates Android SDK to the latest version.
- Resolve issue [804](https://github.com/plaid/react-native-plaid-link-sdk/issues/804) bottom Navigation Bar Overlapping UI Elements


### Android

Android SDK [5.3.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.3.2)

### Additions

- Upgrade com.google.protobuf:protobuf-kotlin-lite to 3.25.5
- Ensure SDK screens resize for keyboard insets on Android 15+

### Changes

- None

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.0)

### Changes

- Add issueDescription and issueDetectedAt to EventMetadata.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.4.0 — 2025-08-06

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Updates Android and iOS SDKs to the latest versions.
- metadata_json, issueId, issueDescription, issueDetectedAt to LinkEventMetadata.
- Add dateOfBirth to SubmissionData.
- Update submit APIs to allow for date of birth.
- Add LAYER_AUTOFILL_NOT_AVAILABLE to LinkEventName.

### Android

Android SDK [5.3.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.3.0)

### Additions

- Add LAYER_AUTOFILL_NOT_AVAILABLE event.
- Add issueDescription and issueDetectedAt at event metadata fields.
- Update Layer submit API to support additional parameter dateOfBirth

### Changes

- None

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.0)

### Changes

- Add issueDescription and issueDetectedAt to EventMetadata.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.3.2 — 2025-07-30

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.2.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.2.0)

### Additions

- Add ISSUE_FOLLOWED, IDENTITY_MATCH_PASSED, and IDENTITY_MATCH_FAILED event names and issue_id event metadata field.

### Changes

- Improve destroy() API behavior in edge cases.

### Removals

- Reduce SDK size by 11.5% down from 5.0MB to 4.5MB. 
- Remove the androidx.recyclerview:recyclerview, androidx.constraintlayout:constraintlayout, and io.coil-kt:coil dependencies.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.3.2](https://github.com/plaid/plaid-link-ios/releases/tag/6.3.2)

### Changes

- Resolve XCFramework signing issue.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.3.1 — 2025-07-28

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.2.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.2.0)

### Additions

- Add ISSUE_FOLLOWED, IDENTITY_MATCH_PASSED, and IDENTITY_MATCH_FAILED event names and issue_id event metadata field.

### Changes

- Improve destroy() API behavior in edge cases.

### Removals

- Reduce SDK size by 11.5% down from 5.0MB to 4.5MB. 
- Remove the androidx.recyclerview:recyclerview, androidx.constraintlayout:constraintlayout, and io.coil-kt:coil dependencies.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.3.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.3.1)

### Changes

- Expose Finance Kit sync simulated behavior to Objective-C (React Native).
- Updated Layer submit API
- Added Layer event LAYER_AUTOFILL_NOT_AVAILABLE

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.3.0 — 2025-07-24

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.2.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.2.0)

### Additions

- Add ISSUE_FOLLOWED, IDENTITY_MATCH_PASSED, and IDENTITY_MATCH_FAILED event names and issue_id event metadata field.

### Changes

- Improve destroy() API behavior in edge cases.

### Removals

- Reduce SDK size by 11.5% down from 5.0MB to 4.5MB. 
- Remove the androidx.recyclerview:recyclerview, androidx.constraintlayout:constraintlayout, and io.coil-kt:coil dependencies.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.3.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.3.0)

### SwiftUI API Enhancements

- Added `makePlaidLinkSheet()` to `Handler`: a convenience method that returns a `View` to present LinkKit using `.fullScreenCover` in SwiftUI applications.
- Added `plaidLink(isPresented:handler:)`: a SwiftUI view modifier to attach LinkKit to any `View`, such as a `Button`, using a pre-configured handler.
- Added `plaidLink(isPresented:token:onSuccess:onExit:onEvent:onLoad:errorView:)`: a flexible SwiftUI modifier for creating LinkKit sessions with just a link token and callbacks—no `Handler` required.

### Testing

- Improved FinanceKit testing capabilities in Sandbox.

### Event Tracking Improvements

- Added event names:
  - `IDENTITY_MATCH_PASSED`
  - `IDENTITY_MATCH_FAILED`
  - `ISSUE_FOLLOWED`
  - `SELECT_ACCOUNT`

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.2.1 — 2025-06-21

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolve issue [782 PLKEnvironmentDevelopment not defined](https://github.com/plaid/react-native-plaid-link-sdk/issues/782).

### Android

Android SDK [5.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v5.1.1)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Add Flutter SDK version tracking.
- Fixed edge to edge layout overlap issue in Android 15+.

### Removals

- Reduced SDK size by 20%, from 6.2 MB down to 5.0 MB.
- Removed org.bouncycastle:bcpkix-jdk15to18 dependency.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.2.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.2.1)

#### Changes

- Add Flutter SDK version tracking.
- Reduced SDK size from 13.2MB to 8.9MB

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.2.0 — 2025-06-13

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v5.1.1)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Add Flutter SDK version tracking.
- Fixed edge to edge layout overlap issue in Android 15+.

### Removals

- Reduced SDK size by 20%, from 6.2 MB down to 5.0 MB.
- Removed org.bouncycastle:bcpkix-jdk15to18 dependency.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.2.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.2.1)

#### Changes

- Add Flutter SDK version tracking.
- Reduced SDK size from 13.2MB to 8.9MB

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.1.1 — 2025-04-03

### React Native

- Adds `destroy()` method for Android.
- Remove `async` from open method.

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.1.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.1.0)

#### Changes

- Improved RememberMe experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.1.0 — 2025-03-10

### React Native

- Updates iOS SDK to [6.1.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.1.0)
- Resolves [issue 754](https://github.com/plaid/react-native-plaid-link-sdk/issues/754)

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.1.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.1.0)

#### Changes

- Improved RememberMe experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.0.3 — 2025-02-04

### React Native

- Updates iOS SDK to [6.0.4](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.4)

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.4](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.4)

#### Changes

- Fixed an issue where some sessions experienced delays in receiving the LAYER_READY event or did not receive it at all.
- Fixed an issue with XCFramework signature.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.0.2 — 2025-01-30

### React Native

- Fixed: Resolved an [issue](https://github.com/plaid/react-native-plaid-link-sdk/issues/747) where the USE_FRAMEWORKS preprocessor check was failing for projects using use_frameworks! :linkage => :static.

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.2](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.2)

#### Changes

- Add support for FinanceKit and Apple card.
- Improved returning user experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.0.1 — 2025-01-24

### React Native

- Resolves issues with react native >= 0.76.0.
- Remove deprecated PlaidLink component.
- Remove deprecated openLink function.

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.2](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.2)

#### Changes

- Add support for FinanceKit and Apple card.
- Improved returning user experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |

## LinkKit V12.0.0 — 2025-01-03

### React Native

- Remove deprecated PlaidLink component.
- Remove deprecated openLink function.

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [5.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.0.0)

### Additions

- Add AUTO_SUBMIT event name.
- Add INVALID_UPDATE_USERNAME item error.

### Changes

- Upgrade Kotlin to 1.9.25.
- Upgrade to target and compile SDK version 35.
- Upgrade androidx.databinding:viewbinding library from 8.1.2 to 8.6.1.
- Upgrade androidx.activity:activity library from 1.6.0 to 1.8.2.
- Upgrade androidx.core:core-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.fragment:fragment-ktx library from 1.9.0 to 1.13.0.
- Upgrade androidx.room:room-ktx library from 2.6.0 to 2.6.1.
- Upgrade androidx.lifecycle:lifecycle-runtime-ktx library from 2.5.1 to 2.6.1.
- Upgrade org.jetbrains.kotlinx:kotlinx-coroutines-core library from 1.7.1 to 1.7.3.

### Removals

- Remove PROFILE_ELIGIBILITY_CHECK_ERROR event name.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.0)

#### Changes

- Add support for FinanceKit and Apple card.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V11.13.3 — 2024-12-06

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates to clarify and resolve the following issues: 
    - [Issue 713](https://github.com/plaid/react-native-plaid-link-sdk/issues/713)
    - [Issue 732](https://github.com/plaid/react-native-plaid-link-sdk/issues/732)

### Android

Android SDK [4.6.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.1)

#### Changes
- Add BANK_INCOME_INSIGHTS_COMPLETED, SUBMIT_EMAIL, SKIP_SUBMIT_EMAIL, SUBMIT_OTP, REMEMBER_ME_ENABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_HOLDOUT, PLAID_CHECK_PANE, AUTO_SELECT_SAVED_INSTITUTION event names.
- Add SUBMIT_DOCUMENTS, SUBMIT_DOCUMENTS_SUCCESS, SUBMIT_DOCUMENTS_ERROR, SUBMIT_EMAIL, and VERIFY_EMAIL event view names.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.1)

#### Changes

- Add missing event names submitEmail, skipSubmitEmail, rememberMeEnabled, rememberMeDisabled, rememberMeHoldout, selectSavedInstitution, selectSavedAccount, autoSelectSavedInstitution, plaidCheckPane.
- Add missing view names submitEmail and verifyEmail.
- Add haptics support.
- Fix Embedded search view dynamic resizing.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.13.2 — 2024-11-12

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update Android Compile Version from 31 to 34.

### Android

Android SDK [4.6.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.1)

#### Changes
- Add BANK_INCOME_INSIGHTS_COMPLETED, SUBMIT_EMAIL, SKIP_SUBMIT_EMAIL, SUBMIT_OTP, REMEMBER_ME_ENABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_HOLDOUT, PLAID_CHECK_PANE, AUTO_SELECT_SAVED_INSTITUTION event names.
- Add SUBMIT_DOCUMENTS, SUBMIT_DOCUMENTS_SUCCESS, SUBMIT_DOCUMENTS_ERROR, SUBMIT_EMAIL, and VERIFY_EMAIL event view names.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.1)

#### Changes

- Add missing event names submitEmail, skipSubmitEmail, rememberMeEnabled, rememberMeDisabled, rememberMeHoldout, selectSavedInstitution, selectSavedAccount, autoSelectSavedInstitution, plaidCheckPane.
- Add missing view names submitEmail and verifyEmail.
- Add haptics support.
- Fix Embedded search view dynamic resizing.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.13.1 — 2024-11-11

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Resolves [Issue 713](https://github.com/plaid/react-native-plaid-link-sdk/issues/713).

### Android

Android SDK [4.6.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.1)

#### Changes
- Add BANK_INCOME_INSIGHTS_COMPLETED, SUBMIT_EMAIL, SKIP_SUBMIT_EMAIL, SUBMIT_OTP, REMEMBER_ME_ENABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_HOLDOUT, PLAID_CHECK_PANE, AUTO_SELECT_SAVED_INSTITUTION event names.
- Add SUBMIT_DOCUMENTS, SUBMIT_DOCUMENTS_SUCCESS, SUBMIT_DOCUMENTS_ERROR, SUBMIT_EMAIL, and VERIFY_EMAIL event view names.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.1)

#### Changes

- Add missing event names submitEmail, skipSubmitEmail, rememberMeEnabled, rememberMeDisabled, rememberMeHoldout, selectSavedInstitution, selectSavedAccount, autoSelectSavedInstitution, plaidCheckPane.
- Add missing view names submitEmail and verifyEmail.
- Add haptics support.
- Fix Embedded search view dynamic resizing.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.13.0 — 2024-09-16

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update Android and iOS SDKs.

### Android

Android SDK [4.6.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.1)

#### Changes
- Add BANK_INCOME_INSIGHTS_COMPLETED, SUBMIT_EMAIL, SKIP_SUBMIT_EMAIL, SUBMIT_OTP, REMEMBER_ME_ENABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_DISABLED, REMEMBER_ME_HOLDOUT, PLAID_CHECK_PANE, AUTO_SELECT_SAVED_INSTITUTION event names.
- Add SUBMIT_DOCUMENTS, SUBMIT_DOCUMENTS_SUCCESS, SUBMIT_DOCUMENTS_ERROR, SUBMIT_EMAIL, and VERIFY_EMAIL event view names.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.1)

#### Changes

- Add missing event names submitEmail, skipSubmitEmail, rememberMeEnabled, rememberMeDisabled, rememberMeHoldout, selectSavedInstitution, selectSavedAccount, autoSelectSavedInstitution, plaidCheckPane.
- Add missing view names submitEmail and verifyEmail.
- Add haptics support.
- Fix Embedded search view dynamic resizing.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.12.1 — 2024-08-23

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates for new architecture
    - https://github.com/plaid/react-native-plaid-link-sdk/pull/701
    - https://github.com/plaid/react-native-plaid-link-sdk/pull/702

### Android

Android SDK [4.6.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.0)

#### Changes
- Source and target compatibility set to JavaVersion.VERSION_11 down from VERSION_17 to improve compatibility.
- Upgrade androidx.work:work-runtime-ktx library from 2.7.1 to 2.9.0.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.0)

#### Changes

- Add submit API for Layer.
- Improved Remember Me Experience

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.12.0 — 2024-08-09

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Resolve issue [693](https://github.com/plaid/react-native-plaid-link-sdk/issues/693) missing Layer events.
- Add `LAYER_READY` and `LAYER_NOT_AVAILABLE` events to `LinkEventName`.

### Android

Android SDK [4.6.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.6.0)

#### Changes
- Source and target compatibility set to JavaVersion.VERSION_11 down from VERSION_17 to improve compatibility.
- Upgrade androidx.work:work-runtime-ktx library from 2.7.1 to 2.9.0.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.0)

#### Changes

- Add submit API for Layer.
- Improved Remember Me Experience

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V12.0.0-beta.3 — 2024-08-06

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.4.0)

#### Changes
- Support Autofill for SMS OTP in Link Sessions using Google play-services-auth-api-phone library version 18.0.2.
- Change LinkActivity to `exported=false`.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.0-beta5](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.0-beta5)

#### Changes

- Resolves bug where large transaction syncs failed.
- Resolves bug where large account balance extraction failed.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.3.0 |
| iOS | >= 14.0 |

## LinkKit V11.11.2 — 2024-08-06

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Resolve issue [693](https://github.com/plaid/react-native-plaid-link-sdk/issues/693) missing Layer events.
- Add `LAYER_READY` and `LAYER_NOT_AVAILABLE` events to `LinkEventName`.

### Android

Android SDK [4.5.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.5.1)

#### Changes
- Fix headless link race condition

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.0)

#### Changes

- Add submit API for Layer.
- Improved Remember Me Experience

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.11.1 — 2024-07-17

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update Android SDK to 4.5.1.
- Update iOS SDK to 5.6.0.
- Add submit API.

### Android

Android SDK [4.5.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.5.1)

#### Changes
- Fix headless link race condition

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.0)

#### Changes

- Add submit API for Layer.
- Improved Remember Me Experience

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.11.0 — 2024-06-25

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update Android SDK to 4.5.0.
- Update iOS SDK to 5.6.0.
- Add submit API.

### Android

Android SDK [4.5.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.5.0)

#### Changes
- Add PROFILE_DATA_REVIEW event view name.
- Add LAYER_READY and LAYER_NOT_AVAILABLE event names.
- Add submit API to the LinkHandler.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.6.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.6.0)

#### Changes

- Add submit API for Layer.
- Improved Remember Me Experience

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.10.3 — 2024-06-04

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.4.2](https://github.com/plaid/plaid-link-android/releases/tag/v4.4.2)

#### Changes
- Support Autofill for SMS OTP in Link Sessions using Google play-services-auth-api-phone library version 18.0.2.
- Change LinkActivity to `exported=false`.
- Fix race condition that can occur when multiple tokens are initialized.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.5.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.5.1)

#### Changes

- Fix headless OAuth bug.
- Improved Remember Me experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.10.2 — 2024-05-30

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.5.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.5.1)

#### Changes

- Fix headless OAuth bug.
- Improved Remember Me experience.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V12.0.0-beta.2 — 2024-05-24

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.4.0)

#### Changes
- Support Autofill for SMS OTP in Link Sessions using Google play-services-auth-api-phone library version 18.0.2.
- Change LinkActivity to `exported=false`.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.0-beta2](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.0-beta2)

#### Changes

- Add Objective-C FinanceKit APIs for React Native.
- Add support for FinanceKit and Apple card.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.3.0 |
| iOS | >= 14.0 |

## LinkKit V11.10.1 — 2024-05-23

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.5.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.5.0)

#### Changes

- Add PROFILE_DATA_REVIEW view name.
- Add NSPrivacyCollectedDataTypePurposes for NSPrivacyCollectedDataTypeUserID.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V12.0.0-beta.1 — 2024-05-22

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

### Android

Android SDK [4.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.4.0)

#### Changes
- Support Autofill for SMS OTP in Link Sessions using Google play-services-auth-api-phone library version 18.0.2.
- Change LinkActivity to `exported=false`.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [6.0.0-beta1](https://github.com/plaid/plaid-link-ios/releases/tag/6.0.0-beta1)

#### Changes

- Add support for FinanceKit and Apple card.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.3.0 |
| iOS | >= 14.0 |

## LinkKit V11.10.0 — 2024-05-22

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes
- [Exports added](https://github.com/plaid/react-native-plaid-link-sdk/pull/666) for `create` and `open` functions.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.5.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.5.0)

#### Changes

- Add PROFILE_DATA_REVIEW view name.
- Add NSPrivacyCollectedDataTypePurposes for NSPrivacyCollectedDataTypeUserID.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.9.0 — 2024-05-09

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Adds support for Fabric.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.5.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.5.0)

#### Changes

- Add PROFILE_DATA_REVIEW view name.
- Add NSPrivacyCollectedDataTypePurposes for NSPrivacyCollectedDataTypeUserID.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.8.2 — 2024-04-22

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Resolve issue where handler wasn't deallocated onExit for iOS sessions.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.4.2](https://github.com/plaid/plaid-link-ios/releases/tag/5.4.2)

#### Changes

- Make Link background a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.8.1 — 2024-04-22

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Add submit OTP event name
- Add continue_to_third_party exit status
- Resolve issue [653](https://github.com/plaid/react-native-plaid-link-sdk/issues/653) where the `HANDOFF` event is not properly emitted on iOS.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.4.2](https://github.com/plaid/plaid-link-ios/releases/tag/5.4.2)

#### Changes

- Make Link background a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.8.0 — 2024-04-16

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update iOS SDK and Android SDKs.

### Android

Android SDK [4.3.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.1)

#### Changes
- Change WebView background to a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.4.2](https://github.com/plaid/plaid-link-ios/releases/tag/5.4.2)

#### Changes

- Make Link background a transparent gradient.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.7.1 — 2024-04-12

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update iOS SDK and Android SDKs.
- Fix issue with Plaid component not working on second press.

### Android

Android SDK [4.3.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.3.0)

#### Changes
- Upgrade AndroidX Activity from 1.3.0 to 1.5.0
- Upgrade AndroidX Fragment from 1.3.0 to 1.5.0
- Upgrade AndroidX Lifecycle from 2.4.0 to 2.5.0
- Animation improvements for Layer.
- Fix webview back navigation handling bug.

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

### iOS

iOS SDK [5.4.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.4.1)

#### Changes

- Remove deprecation from custom Link presentation.
- Improve Link presentation animation.
- Embedded Link bug fixes.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |

## LinkKit V11.6.0 — 2024-03-20

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update iOS SDK and Android SDKs.
- Add ability to pre-load Link.

### Android

Android SDK [4.2.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.2.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |


### iOS

iOS SDK [5.3.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.3.1)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


## LinkKit V11.5.2 — 2024-02-21

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Update iOS SDK

### Android

Android SDK [4.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.1.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |


### iOS

iOS SDK [5.2.1](https://github.com/plaid/plaid-link-ios/releases/tag/5.2.1)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Improved Embedded Link experience.

## LinkKit V11.5.1 — 2024-02-08

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Resolves bug where `LinkEventMetadata` was undefined on `LinkEvent`. All values inside `LinkEventMetadata` should now be accessible on iOS and Android.


### Android

Android SDK [4.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.1.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Improved Remember Me experience.

### iOS

iOS SDK [5.2.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.2.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Improved Remember Me experience.

## LinkKit V11.5.0 — 2024-02-01

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates iOS SDK to `5.2.0` for improved Remember Me experience.


### Android

Android SDK [4.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.1.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Improved Remember Me experience.

### iOS

iOS SDK [5.2.0](https://github.com/plaid/plaid-link-ios/releases/tag/5.2.0)

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 15.0.1 |
| iOS | >= 14.0 |


#### Changes

- Improved Remember Me experience.

## LinkKit V11.4.0 — 2024-01-22

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates Android SDK SDK to `4.1.1` to fix bug where certain Link sessions close after initial loading.


### Android

Android SDK [4.1.1](https://github.com/plaid/plaid-link-android/releases/tag/v4.1.1)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Improved Remember Me experience.

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

## LinkKit V11.3.0 — 2024-01-18

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Reverts Android SDK SDK to `4.0.0`. To prevent [issue 620](https://github.com/plaid/react-native-plaid-link-sdk/issues/620).


### Android

Android SDK [4.0.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.0.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Improved Remember Me experience.

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

## LinkKit V11.2.0 — 2024-01-11

### React Native

#### Requirements

This SDK now works with any supported version of React Native.

#### Changes

- Updates Android SDK SDK to `4.1.0`.
- Improved Remember Me Experience on iOS & Android


### Android

Android SDK [4.1.0](https://github.com/plaid/plaid-link-android/releases/tag/v4.1.0)

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.8+ |

#### Additions

- Improved Remember Me experience.

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
