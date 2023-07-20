# Contributing

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

The primary contributors to this SDK are generally Plaid employees, but we do also welcome PRs from the community to fix bugs.

## SDK Structure

The Plaid React Native SDK is intended to be a thin wrapper around the native [Android](https://github.com/plaid/plaid-link-android) and [iOS](https://github.com/plaid/plaid-link-ios) SDKs. As such there is one main file that provides all of the public APIs [PlaidLink.tsx](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/PlaidLink.tsx).

To learn more you can read about [Native Modules](https://reactnative.dev/docs/native-modules-intro) in React Native, or more specifically Export a Native Method to JavaScript for [Android](https://reactnative.dev/docs/native-modules-android#export-a-native-method-to-javascript) and [iOS](https://reactnative.dev/docs/native-modules-ios#export-a-native-method-to-javascript).

Per standard React Native conventions, information to open Link is passed via JSON to either the Android or iOS Native Modules and is returned as JSON via callbacks.

[onEvent](https://plaid.com/docs/link/react-native/#onevent) events are handled using React Native's `NativeEventEmitter` due to their stream-like nature.

#### Android

Android is its own com.android.library module that contains a Package, Module and helper classes.

The Android native module constructs configurations from the JSON and opens Link via the native SDK's APIs. It also listens for Activity results and converts the resulting objects into JSON to return via the callbacks. [PlaidModule.kt](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/android/src/main/java/com/plaid/PlaidModule.kt) is where most the module wrapping occurs.

**Note** - There is an existing [known issue](https://github.com/facebook/react-native/issues/30277) with the Android SDK that is caused by an assumption in the core React Native Code.

#### iOS 

The native iOS SDK is exposed to React Native Javascript via the use of Objective-C in [RNLinksdk.m](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/ios/RNLinksdk.m). This file exports LinkKit native methods using [RCT_EXPORT_METHOD](https://reactnative.dev/docs/native-modules-ios#export-a-native-method-to-javascript) so they can be called directly in Javascript.

## Development workflow

### Running the example app

You can find information on running the example app in the [README](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/example/README.md).

### iOS changes

To edit the Objective-C files, open `example/ios/plaidRNDemo.xcworkspace` in XCode and find the source files at `Pods > Development Pods > react-native-plaid-link-sdk`.

### Android changes

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `react-native-plaid-link-sdk` under `PlaidRNDemo`.


### Typescript changes

Use your editor of choice for editing the Typescript files at the root of the project or in `example/`.

Run `tsc` from the project's root (`npm install --global typescript` if command not found) to compile the typescript source. Ensure the `dist` directory has been created.

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint --fix
```

### Testing local changes


To install local/private packages across local environment we recommend using [yalc](https://github.com/wclr/yalc).

- Run `yalc publish` in `react-native-plaid-link-sdk` package to publish all the files that should be published in remote NPM registry.
- Run `yalc add react-native-plaid-link-sdk` in your dependent project, which will copy the current version from the store to your project's `.yalc` folder and inject a `file:.yalc/react-native-plaid-link-sdk` into `package.json`.
- In your dependent project run `npm install` and `cd ios && bundle install && bundle exec pod install`.


### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
