# plaid-react-native-demo-app

Sample apps using the React Native Plaid Link SDK on both iOS and Android.

## Setup

> cxNote: This assumes you have Cocoapods & NPM installed locally.

From the root of this repo run the following commands in your terminal...

```bash
cd example
npm install
npm install react-native
```

For each platform, see relevant instructions to continue...
* [iOS](#ios)
* [Android](#android)

### iOS

Run the following commands in your terminal...

```bash
pod install
open -a Xcode plaidRNDemo.xcworkspace
```

The `plaidRNDemo.xcworkspace` should be open, run the `plaidRNDemo` target.

If you have any build errors with flipper dependencies, try commenting out or removing the flipper specific code (below) in the `Podfile`, and re-run `pod install`.

```rb
  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable these next few lines.
  use_flipper!
  post_install do |installer|
    flipper_post_install(installer)
  end 
```

Now you should be able to build, but Link won't work without a link token. See the [Configuring Link Tokens](#configuring-link-tokens) section below!

### Android

TODO

### Configuring Link Tokens

To set a link token, go to `example/components/HomeScreen.tsx` and replace `<INSERT TOKEN>` with your link token.

Build the app again, reload (Command+R) if needed, and you should be good to go!
