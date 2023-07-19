# Contributing

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## SDK Structure

The Plaid React Native SDK is intended to be a thin wrapper around the native [Android](https://github.com/plaid/plaid-link-android) and [iOS](https://github.com/plaid/plaid-link-ios) SDKs. As such there is one main file that provides all of the public APIs [PlaidLink.tsx](https://github.com/plaid/react-native-plaid-link-sdk/blob/master/PlaidLink.tsx).

To learn more you can read about [Native Modules](https://reactnative.dev/docs/native-modules-intro) in React Native, or more specifically Export a Native Method to JavaScript for [Android](https://reactnative.dev/docs/native-modules-android#export-a-native-method-to-javascript) and [iOS](https://reactnative.dev/docs/native-modules-ios#export-a-native-method-to-javascript).

Per standard React Native conventions, information to open Link is passed via JSON to either the Android or iOS Native Modules and is returned as JSON via callbacks.

[onEvent](https://plaid.com/docs/link/react-native/#onevent) events are handled using React Native's `NativeEventEmitter` due to their stream-like nature.

#### Android

Android is it's own com.android.library module that contains a Package, Module and helper classes.

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

## Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, caste, color, religion, or sexual
identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

### Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

* Demonstrating empathy and kindness toward other people
* Being respectful of differing opinions, viewpoints, and experiences
* Giving and gracefully accepting constructive feedback
* Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
* Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

* The use of sexualized language or imagery, and sexual attention or advances of
  any kind
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or email address,
  without their explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

### Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
[INSERT CONTACT METHOD].
All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

### Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

#### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

#### 2. Warning

**Community Impact**: A violation through a single incident or series of
actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or permanent
ban.

#### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

#### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior, harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the
community.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
[https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

Community Impact Guidelines were inspired by
[Mozilla's code of conduct enforcement ladder][Mozilla CoC].

For answers to common questions about this code of conduct, see the FAQ at
[https://www.contributor-covenant.org/faq][FAQ]. Translations are available at
[https://www.contributor-covenant.org/translations][translations].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
[Mozilla CoC]: https://github.com/mozilla/diversity
[FAQ]: https://www.contributor-covenant.org/faq
[translations]: https://www.contributor-covenant.org/translations

