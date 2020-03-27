# Getting Started

In your react-native project directory:

```
npm install --save react-native-plaid-link-sdk
```

## Updating from previous versions.

When upgrading from a previous major version of this library, see the notes [here](./upgrade_notes) for additional instructions.

## iOS

Add `Plaid` to your project’s Podfile as follows (likely located at `ios/Podfile`). The current minimum version supported is `1.1.27`.

```
pod 'Plaid', '~> 1.1.27'
```

Then install your cocoapods dependencies:

```
cd ios && pod install && cd ..
```

Add a Run Script build phase (after the [CP] Embed Pods Frameworks step) to your target as [described in Plaid Link for iOS documentation](https://plaid.com/docs/link/ios/#add-run-script). This strips simulator symbols from App Store release builds.

That's it if using a recent react-native version with [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) support.

### Manual Integration

If using a version of react-native without [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) support, then you will need to:

```
`react-native link react-native-plaid-link-sdk`
```

followed by

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-plaid-link-sdk` ➜ `ios` and add `RNLinksdk.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNLinksdk.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Android
### 1. Register your app id
1. Log into your [Plaid Dashboard](https://dashboard.plaid.com/team/api) at the API page
2. Next to Allowed Android package names click "Configure" then "Add New Android Package Name"
3. Enter your package name, for example `com.plaid.example`
4. Click "Save Changes", you may be prompted to re-enter your password

### 2. Add PlaidPackage to your application
1. Go to `android/app/src/main/java/<AppName>/MainApplication.java`
2. Add `import com.plaid.PlaidPackage;` to the imports section
3. Add `packages.add(new PlaidPackage());` to `List<ReactPackage> getPackages();`

### 3. Configure Gradle
1. Go to the project level `android/app/build.gradle`
2. Make sure you are using a min sdk >= 21
3. Use the latest Android link version ![version](https://img.shields.io/bintray/v/plaid/link-android/com.plaid.link)
4. Add the following dependencies:

```groovy
dependencies {
    ...
    implementation project(':react-native-plaid-link-sdk')
    implementation 'com.plaid.link:sdk-core:<insert latest version>'
```

5. Go to `android/settings.gradle`
6. Add the following lines:

```groovy
include ':react-native-plaid-link-sdk'
project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-plaid-link-sdk/android')
```

## PlaidLink

In your app:

```
import { Text } from 'react-native';
import PlaidLink from 'react-native-plaid-link-sdk';
 
const MyPlaidComponent = () => {
  return (
    <PlaidLink
     // Replace any of the following <#VARIABLE#>s according to your setup,
     // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration
 
      publicKey='<# Your Public Key #>'
      clientName='<# Your Client Name #>'
      env='<# Environment #>'  // 'sandbox' or 'development' or 'production'
      product={['<# Product #>']}
      onSuccess={data => console.log('success: ', data)}
      onExit={data => console.log('exit: ', data)}
      onCancelled = {(result) => {console.log('Cancelled: ', result)}}
 
      // Optional props
      countryCodes={['<# Country Code #>']}
      language='<# Language #>'
      userEmailAddress='<# User Email #>'
      userLegalName='<# User Legal Name #>'
      userPhoneNumber='<# User Phone Number #>'
      webhook='<# Webhook URL #>'
    >
      <Text>Add Account</Text>
    </PlaidLink>
  );
};
```

### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here](https://plaid.com/docs/#onevent-callback). To receive these events in your React Native app, wrap the `PlaidLink` react component with the following in order to listen for those events:

```
import React from 'react';
import { Text, NativeEventEmitter, NativeModules } from 'react-native';
 
class PlaidEventContainer extends React.Component {
 
  componentDidMount() {
    const emitter = new NativeEventEmitter(Platform.OS === 'ios' ? NativeModules.RNLinksdk : NativeModules.PlaidAndroid);
    this._listener = emitter.addListener('onEvent', (e) => console.log(e));
  }
 
  componentWillUnmount() {
    if (this._listener) {
      this._listener.remove();
    }
  }
 
  render() {
    return (
      <PlaidLink
        clientName='##YOUR CLIENT NAME##'
        publicKey='#YOUR PUBLIC KEY##'
        env='sandbox'
        onSuccess={data => console.log('success: ', data)}
        onExit={data => console.log('exit: ', data)}
        onCancelled = {(result) => {console.log('Cancelled: ', result)}}
        product={['transactions']}
        language='en'
        countryCodes={['US']}
      >
        <Text>Add Account</Text>
      </PlaidLink>
    );
  }
}
```

### Customizing the PlaidLink component

By default, `PlaidLink` renders a `TouchableOpacity` component. You may override the component used by passing `component` and `componentProps`. For example:

```
      <PlaidLink
        clientName = "Component Test"
        publicKey = "##YOUR PUBLIC KEY##"
        products = {["transactions"]}
        env = "sandbox"
        component= {Button}
        componentProps = {{title: 'Add Account'}}
        onSuccess = {(result) => {console.log('Success: ', result)}}
        onError = {(result) => {console.log('Error: ', result)}}
        onCancelled = {(result) => {console.log('Cancelled: ', result)}}
        product = {["transactions"]}
        language = "en"
        countryCodes = {["US"]}
    >
```
