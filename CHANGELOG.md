# Changelog

## 13.0.0 - 2026-06-26

v13 is a major release that rebuilds the React Native SDK on Expo Modules,
updates the native Link integrations to iOS LinkKit 7.0.0 and Android
`sdk-core` 6.0.0, and introduces a session-based JavaScript API for Link flows.

For detailed migration examples, see [V13_MIGRATION_GUIDE.md](./V13_MIGRATION_GUIDE.md).

### Breaking Changes

- Replaced the legacy global `create`, `open`, `submit`, `openLink`,
  `PlaidLink`, and `usePlaidEmitter` APIs with explicit session objects:
  `createPlaidLinkSession`, `createPlaidLayerSession`, and
  `createPlaidHeadlessSession`.
- Rebuilt the package as an Expo Module. Bare React Native apps must install and
  configure Expo Modules before using v13.
- Expo Go is not supported because Plaid Link requires custom native code. Expo
  apps should use a development build or another custom native runtime.
- Standard Link, Layer, and Headless callbacks are now registered per session
  instead of through a shared event emitter.
- `metadataJson` is the canonical callback metadata field. Update stale
  `metadata_json` references from v11 or v12 TypeScript code.
- Removed `errorDisplayMessage` from `LinkError`. Use `displayMessage` instead.
- `syncFinanceKit` now returns a promise and remains iOS-only. Android calls
  reject with an unsupported-platform error.
- Renamed `LinkAccountSubtypeInvestment.SIIP` to
  `LinkAccountSubtypeInvestment.SIPP`.

### Native SDK Updates

- Updated iOS to LinkKit 7.0.0, including the new session-based LinkKit API,
  `PlaidLinkSession`, `PlaidLayerSession`, `PlaidHeadlessSession`,
  first-class `onLoad` handling, native Embedded Search, and the modernized
  FinanceKit sync API.
- Updated Android to `com.plaid.link:sdk-core:6.0.0`, including the native
  session APIs, Layer submit support, Headless Link support, and Embedded Search
  continuation support.

### New APIs

- Added `createPlaidLinkSession({ token, onSuccess, onExit, onEvent, onLoad })`
  for Standard Link.
- Added `createPlaidLayerSession({ token, onSuccess, onExit, onEvent })` with
  `session.open()` and `session.submit({ phoneNumber, dateOfBirth, params })`.
- Added `createPlaidHeadlessSession({ token, onSuccess, onExit, onEvent })`
  with `session.start()`.
- Added `PlaidEmbeddedSearchView` for Embedded Search on iOS and Android.
- Added promise-based `syncFinanceKit({ token, requestAuthorizationIfNeeded,
  syncBehavior })` for iOS.

### Package and Distribution

- v13 publishes JavaScript and TypeScript entrypoints from `build/index.js` and
  `build/index.d.ts`.
- v13 ships the bundled iOS `LinkKit.xcframework` in the npm package because
  LinkKit 7 no longer supports CocoaPods distribution. This intentionally
  increases the npm tarball size compared with v12.
- Excluded generated example projects, coverage output, and stale `dist` output
  from the npm package.
- Added package sanity checks to CI to verify entrypoints exist and are included
  in the packed npm tarball.

### Fixes

- Aligned iOS fallback `onExit` payloads with the public React Native callback
  contract by emitting `{ error, metadata }`.
- Added callback contract tests to catch iOS, Android, or TypeScript payload
  shape drift.
