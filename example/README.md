# plaid-react-native-demo-app

Sample apps using the React Native Plaid Link SDK on both iOS and Android.

## Local Developement of react-native-plaid-link-sdk

To test local changes to the `react-native-plaid-link-sdk` package...

* Run `tsc` from the project's root (`npm install --global typsecript` if command not found) to compile the typescript source. Ensure the `dist` directory has been created
* Run `cd example`
* Run `npm install` to resolve example app dependencies
* Copy the local package implementation into `example/node_modules`:<br> From `example` run `npm run sync-local-pkg`

Run the `npm run sync-local-package` each time you make changes to the local package, then reload the react native app.

At this point you should be able to build & run the app using the local package as a dependency.

Make sure you do not check these changes in! To get out of local dev mode, revert the 
changes to `example/package.json` & run `npm install` again. 

### iOS

Make sure you update / install Cocoapods after running `npm run sync-local-pkg`.


## Setup

> cxNote: This assumes you have Cocoapods & NPM installed locally.

From the root of this repo run the following commands in your terminal...

```bash
cd example
npm install
```

For each platform, see relevant instructions to continue...
* [iOS](#ios)
* [Android](#android)

### iOS

Run the following commands in your terminal...

```bash
pod update Plaid
pod install
open -a Xcode plaidRNDemo.xcworkspace
```

The `plaidRNDemo.xcworkspace` should be open, run the `plaidRNDemo` target.

Now you should be able to build, but Link won't work without a link token. See the [Configuring Link Tokens](#configuring-link-tokens) section below!

### Android

TODO

### Configuring Link Tokens

To set a link token, go to `example/components/HomeScreen.tsx` and replace `<INSERT LINK TOKEN>` with your link token.

Build the app again, reload (Command+R) if needed, and you should be good to go!

### Troubleshooting

If the app is not loading correctly, try running `npm install react-native` & rebuild.
