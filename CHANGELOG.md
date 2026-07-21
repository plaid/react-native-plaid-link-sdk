# RELEASES

## LinkKit V13.0.3 — 2026-07-21

### Changes

- Updates the bundled iOS SDK to LinkKit 7.0.4.
- Updates Android integration to `com.plaid.link:sdk-core:6.1.0`.

### Android

Android SDK [6.1.0](https://github.com/plaid/plaid-link-android/releases/tag/v6.1.0)

### iOS

iOS SDK [7.0.4](https://github.com/plaid/plaid-link-ios/releases/tag/7.0.4)

## LinkKit V13.0.2 — 2026-07-01

### Changes

- Updates the bundled iOS SDK to LinkKit 7.0.1, which restores native React
  Native wrapper detection for v13 apps.
- Restores Android manifest metadata so the native Android SDK reports React
  Native wrapper usage instead of plain Android.

### Android

Android SDK [6.0.0](https://github.com/plaid/plaid-link-android)

### Additions

- Adds native session APIs for Standard Link, Layer, and Headless Link.
- Adds Embedded Search continuation support.
- Adds Layer submit support.

### Changes

- Updates Android integration to `com.plaid.link:sdk-core:6.0.0`.

### Removals

- Removes the legacy React Native Android bridge implementation.

#### Requirements

| Name           | Version                            |
| -------------- | ---------------------------------- |
| Android Studio | 4.0+                               |
| Kotlin         | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [7.0.1](https://github.com/plaid/plaid-link-ios/releases/tag/7.0.1)

### Changes

- Fix React Native Version Parsing

#### Requirements

| Name  | Version   |
| ----- | --------- |
| Xcode | >= 16.1.0 |
| iOS   | >= 15.0   |

## LinkKit V13.0.1 — 2026-06-30

### Changes

- Fixes Expo SDK 56 iOS prebuild failures caused by the npm-packed
  `LinkKit.xcframework` including an unsupported Mac Catalyst slice whose
  framework symlinks were not preserved during packaging.
- Ships an iOS-only `LinkKit.xcframework` with supported device and simulator
  slices.
- Adds package and CI validation for LinkKit XCFramework slices, signatures, and
  Expo SDK 56 iOS prebuild compatibility.

## LinkKit V13.0.0 — 2026-06-26

#### Requirements

This SDK now works with any supported version of React Native that supports Expo
Modules. Expo Go is not supported because Plaid Link requires custom native
code; Expo apps should use a development build or another custom native runtime.

### Changes

- Rebuilds the React Native SDK on Expo Modules.
- Replaces the legacy global `create`, `open`, `submit`, `openLink`,
  `PlaidLink`, and `usePlaidEmitter` APIs with session objects:
  `createPlaidLinkSession`, `createPlaidLayerSession`, and
  `createPlaidHeadlessSession`.
- Removes the global `destroy` function. Each v13 flow is a discrete session
  object, so create a new session instead of clearing and reusing one.
- Removes the iOS-only global `dismissLink` function; Link is dismissed when
  the user completes or exits the flow.
- Removes the `logLevel` and `noLoadingState` configuration options and the
  `LinkLogLevel` enum. `noLoadingState` is superseded by
  `createPlaidHeadlessSession`.
- Adds `PlaidEmbeddedSearchView` for Embedded Search on iOS and Android.
- Adds Headless Link support through `createPlaidHeadlessSession`.
- Updates Layer to use `createPlaidLayerSession`, `session.open()`, and
  `session.submit({ phoneNumber, dateOfBirth, params })`.
- Updates `syncFinanceKit` to a promise API. FinanceKit remains iOS-only and
  rejects on Android.
- Uses `metadataJson` as the canonical callback metadata field. Update stale
  `metadata_json` references from v11 or v12 TypeScript code.
- Removes `errorDisplayMessage` from `LinkError`; use `displayMessage`.
- Renames `LinkAccountSubtypeInvestment.SIIP` to
  `LinkAccountSubtypeInvestment.SIPP`.
- Publishes JavaScript and TypeScript entrypoints from `build/index.js` and
  `build/index.d.ts`.
- Ships the bundled iOS `LinkKit.xcframework` in the npm package because
  LinkKit 7 no longer supports CocoaPods distribution. This intentionally
  increases the npm tarball size compared with v12.
- Excludes generated example projects, coverage output, and stale `dist` output
  from the npm package.
- Adds CI package sanity checks to verify package entrypoints and packed npm
  contents.
- Aligns iOS fallback `onExit` payloads with the public React Native callback
  contract by emitting `{ error, metadata }`.
- Adds callback contract tests to catch iOS, Android, or TypeScript payload
  shape drift.

For detailed migration examples, see
[V13_MIGRATION_GUIDE.md](./V13_MIGRATION_GUIDE.md).

### Android

Android SDK [6.0.0](https://github.com/plaid/plaid-link-android)

### Additions

- Adds native session APIs for Standard Link, Layer, and Headless Link.
- Adds Embedded Search continuation support.
- Adds Layer submit support.

### Changes

- Updates Android integration to `com.plaid.link:sdk-core:6.0.0`.

### Removals

- Removes the legacy React Native Android bridge implementation.

#### Requirements

| Name           | Version                            |
| -------------- | ---------------------------------- |
| Android Studio | 4.0+                               |
| Kotlin         | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [7.0.0](https://github.com/plaid/plaid-link-ios/releases/tag/7.0.0)

### Changes

- Updates to LinkKit 7.0.0.
- Uses the new session-based LinkKit APIs for Standard Link, Layer, Headless
  Link, and Embedded Search.
- Uses the modernized FinanceKit sync API.
- Bundles `LinkKit.xcframework` with the npm package for native iOS builds.

#### Requirements

| Name  | Version   |
| ----- | --------- |
| Xcode | >= 16.1.0 |
| iOS   | >= 15.0   |

## LinkKit V12.8.3 — 2026-06-11

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- **[Unable to resolve path to module 'react-native-plaid-link-sdk' #915)](https://github.com/plaid/react-native-plaid-link-sdk/issues/915)**

### Android

Android SDK [5.5.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.2)

### Additions

- None

### Changes

- Remove kotlin.Metadata consumer proguard rule.
- Fix flutter reporting.

### Removals

- None

#### Requirements


| Name           | Version                            |
| -------------- | ---------------------------------- |
| Android Studio | 4.0+                               |
| Kotlin         | 1.9.25+ (Kotlin integrations only) |


### iOS

iOS SDK [6.4.3](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.3)

### Changes

- No changes.

#### Requirements


| Name  | Version   |
| ----- | --------- |
| Xcode | >= 16.1.0 |
| iOS   | >= 14.0   |



## LinkKit V12.8.2 — 2026-06-01

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- **[Removed the redundant package="com.plaid" attribute from android/src/main/AndroidManifest.xml (#910)](https://github.com/plaid/react-native-plaid-link-sdk/commit/6f0807264701cee9d823561d436a5271eb04ad7c)**
- **[remove example package.lock files (#911)](https://github.com/plaid/react-native-plaid-link-sdk/commit/401ca6a6b5b730a127937b1e82b2c1f8da44ee14)**
- **[add ios key to codegen (#909)](https://github.com/plaid/react-native-plaid-link-sdk/commit/0dc4871f64d643d6d34699da0fab46d6a0c68abd)**
- **[Deprecate SIIP and create SIPP in LinkAccountSubtypeInvestment (#908)](https://github.com/plaid/react-native-plaid-link-sdk/commit/be062a5be619ec4856c2ece023b49584ea12ab5f)**
- **[fix LinkAccountSubtypeLoan using LinkAccountType.CREDIT (#907)](https://github.com/plaid/react-native-plaid-link-sdk/commit/42551c839ba0dd0e5b5fcf082bc0115da5a8ea1a)**

### Android

Android SDK [5.5.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.2)

### Additions

- None

### Changes

- Remove kotlin.Metadata consumer proguard rule.
- Fix flutter reporting.

### Removals

- None

#### Requirements


| Name           | Version                            |
| -------------- | ---------------------------------- |
| Android Studio | 4.0+                               |
| Kotlin         | 1.9.25+ (Kotlin integrations only) |


### iOS

iOS SDK [6.4.3](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.3)

### Changes

- No changes.

#### Requirements


| Name  | Version   |
| ----- | --------- |
| Xcode | >= 16.1.0 |
| iOS   | >= 14.0   |



## LinkKit V12.8.1 — 2026-05-27

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Upgrade to Android SDK [5.5.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.2)

### Android

Android SDK [5.5.2](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.2)

### Additions

- None

### Changes

- Remove kotlin.Metadata consumer proguard rule.
- Fix flutter reporting.

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.3](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.3)

### Changes

- No changes.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.8.0 — 2026-02-18

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Adds missing LAYER_AUTOFILL_NOT_AVAILABLE event name on iOS
- Adds support to submit layer params on iOS & Android

### Android

Android SDK [5.5.1](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.1)

### Additions

- None

### Changes

- Layer update.
- Add missing proguard consumer rule.

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.3](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.3)

### Changes

- Layer updates.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.7.0 — 2025-11-04

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Add `onLoad` to `LinkTokenConfiguration`, fired once when Link is fully loaded and ready to present. Use it to manage your own loading UI or defer presentation until ready.

### Android

Android SDK [5.5.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.5.0)

### Additions

- None

### Changes

- Made LinkErrorCode.errorType public.
- Fixed bug where layer "auto" customization for light/dark mode was always dark, regardless of system setting.
- Added onLoad callback to Plaid.create for detecting when Link is ready to present.

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.2](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.2)

### Changes

- Resolved `syncFinanceKit` crash when running on iPad on compatibility mode.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |



## LinkKit V12.6.1 — 2025-10-22

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolved an issue where the `selection` value was missing in `LinkEvent.EventMetadata`.
- Improved internal debugging and logging to help diagnose customer-reported issues more effectively. 
- Upgrade to Android SDK [5.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.4.0)
- Upgrade to iOS SDK [6.4.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.1)

### Android

Android SDK [5.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.4.0)

### Additions

- None

### Changes

- Resolved an issue where the `selection` value was missing in `LinkEvent.EventMetadata`.
- Improved internal debugging and logging to help diagnose customer-reported issues more effectively.

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.2](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.2)

### Changes

- Resolved `syncFinanceKit` crash when running on iPad on compatibility mode.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |


## LinkKit V12.6.0 — 2025-10-06

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolved an issue where the `selection` value was missing in `LinkEvent.EventMetadata`.
- Improved internal debugging and logging to help diagnose customer-reported issues more effectively. 
- Upgrade to Android SDK [5.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.4.0)
- Upgrade to iOS SDK [6.4.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.1)

### Android

Android SDK [5.4.0](https://github.com/plaid/plaid-link-android/releases/tag/v5.4.0)

### Additions

- None

### Changes

- Resolved an issue where the `selection` value was missing in `LinkEvent.EventMetadata`.
- Improved internal debugging and logging to help diagnose customer-reported issues more effectively.

### Removals

- None

#### Requirements

| Name | Version |
|------|---------|
| Android Studio | 4.0+ |
| Kotlin | 1.9.25+ (Kotlin integrations only) |

### iOS

iOS SDK [6.4.1](https://github.com/plaid/plaid-link-ios/releases/tag/6.4.1)

### Changes

- Resolved an issue where the `selection` value was missing in `LinkEvent.EventMetadata`.
- Improved internal debugging and logging to help diagnose customer-reported issues more effectively.

#### Requirements

| Name | Version |
|------|---------|
| Xcode | >= 16.1.0 |
| iOS | >= 14.0 |



## LinkKit V12.5.3 — 2025-09-16

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolve issue [816](https://github.com/plaid/react-native-plaid-link-sdk/issues/816) with Android SDK upgrade to v5.3.4.

### Android

Android SDK [5.3.4](https://github.com/plaid/plaid-link-android/releases/tag/v5.3.4)

### Additions

- None

### Changes

- Fix retrofit reinitialization bug in edge cases.

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



## LinkKit V12.5.2 — 2025-09-10

#### Requirements

This SDK now works with any supported version of React Native.

### Changes

- Resolve issue [810](https://github.com/plaid/react-native-plaid-link-sdk/issues/810) Support for react native 0.81+
- Adds `metadataJson` key to event data to allow for all keys to be camelCase.
- Updates Android SDK


### Android

Android SDK [5.3.3](https://github.com/plaid/plaid-link-android/releases/tag/v5.3.3)

### Additions

- None

### Changes

- Upgrade com.google.code.gson:gson to 2.9.1.
- Upgrade com.squareup.okhttp3:logging-interceptor to 4.9.2.

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
