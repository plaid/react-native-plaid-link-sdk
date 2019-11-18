# Getting Started

In your react-native project directory:

```
npm install --save react-native-plaid-link-sdk
```

## iOS

Add pod 'Plaid' to your project’s Podfile (likely located at `ios/Podfile` )

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
2. Go to `node_modules` ➜ `react-native-linksdk` and add `RNLinksdk.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNLinksdk.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

## Android

### `android/app/src/main/AndroidManifest.xml`

Inside the <application> tag add:
```
<activity android:name="com.plaid.link.LinkActivity" />
 
    <meta-data
      android:name="com.plaid.link.public_key"
      android:value="YOUR KEY" />
```

 ### `android/app/src/main/java/<AppName>/MainApplication.java`

Add `import com.plaid.PlaidPackage;` on the imports section


Add `packages.add(new PlaidPackage());` in `List<ReactPackage> getPackages();`


Add `Plaid.create(this);` in `public void onCreate()` along with `import com.plaid.link.Plaid;` at the top of the file.

### `android/app/build.gradle`

Add `implementation project(':react-native-plaid-link-sdk')` and `implementation 'com.plaid.link:sdk-core:0.2.1'` in the dependencies block


### `android/settings.gradle`

Add:

```
include ':react-native-plaid-link-sdk'
project(':react-native-plaid-link-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-plaid-link-sdk/android')
```

## PlaidLink

In your app:

```
import PlaidLink from 'react-native-plaid-link-sdk';
 
const MyPlaidComponent = () => {
  return (
    <PlaidLink
      title='Add Account'

     // Replace any of the following <#VARIABLE#>s according to your setup,
     // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration
 
      publicKey='<# Your Public Key #>'
      clientName='<# Your Client Name #>'
      env='<# Environment #>'  // 'sandbox' or 'development' or 'production'
      onSuccess={e => console.log('success: ', e)}
      product={['<# Product #>']}
 
      // Optional props
      countryCodes={['<# Country Code #>']}
      language='<# Language #>'
      onExit={e => console.log('exit: ', e)}
      userEmailAddress='<# User Email #>'
      userLegalName='<# User Legal Name #>'
      userPhoneNumber='<# User Phone Number #>'
      webhook='<# Webhook URL #>'
    />
  );
};
```

### To receive onEvent callbacks:

The React Native Plaid module emits `onEvent` events throughout the account linking process — see [details here](https://plaid.com/docs/#onevent-callback). To receive these events in your React Native app, wrap the `PlaidLink` react component with the following in order to listen for those events:

```
import React from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
 
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
        onSuccess={e => console.log('success: ', e)}
        onExit={e => console.log('exit: ', e)}
        product={['transactions']}
        language='en'
        countryCodes={['US']}
      />
    );
  }
}
```
