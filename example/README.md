# Example App

Our example app provides a minimal React Native app that implements Plaid Link. This app allows you to link a sample bank account.

In order to test Plaid Link using this example app you'll need the following:

- A [Plaid Account](https://dashboard.plaid.com/signup) to get a API keys.
- A [Link Token](https://plaid.com/docs/api/tokens/#linktokencreate) you can quickly fetch one using your API keys and our [Postman collection](https://plaid.com/docs/api/postman/).

## Running the example app

> Note: This setup assumes you've already setup your React Native [development environment](https://reactnative.dev/docs/environment-setup). 

From the root directory of our SDK. 

1. `cd example`
2. `npm install`
3. `cd ios`
4. `bundle install`
5. `bundle exec pod install`
6. `npx react-native start`
7. `npx react-native run-ios` or `npx react-native run-android`


## Testing Plaid Link

1. Fetch a [Link Token](https://plaid.com/docs/api/tokens/#linktokencreate).
2. Paste your token into the `TextField` in the example app.
3. Press "OPEN LINK"
4. If you testing in our Sandbox you can use our provided [test credentials](https://plaid.com/docs/sandbox/test-credentials/) for any financial institution.

	> username: user_good
	
	> password: pass_good

### Screenshots

<img src=./images/android_screenshot.png width=40%>
<img src=./images/ios_screenshot.png width=40%>

