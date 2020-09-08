# Upgrade notes:

## iOS:
No changes needed

## Android
Version 4.0 requires version 2.0+ of the [Plaid Link Android SDK](https://github.com/plaid/plaid-link-android). When upgrading to 4.0.0 of this react native library, make sure to do the following:
* Call Plaid.initialize(this) instead of passing PlaidOptions
* Don't pass in request code when calling openPlaidLink
* LinkCancellation and LinkError are merged into a single object, LinkExit

[Sample PR that migrates from 1.4.1 to 2.0](https://github.com/plaid/plaid-link-android/pull/66/files)
