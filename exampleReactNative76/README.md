# Example App

Our example app provides a minimal React Native app that implements Plaid Link. This app allows you to link a sample bank account.

In order to test Plaid Link using this example app you'll need the following:

- A [Plaid Account](https://dashboard.plaid.com/signup) to get API keys.
- A [Link Token](https://plaid.com/docs/api/tokens/#linktokencreate) - you can quickly fetch one using your API keys and our [Postman collection](https://github.com/plaid/plaid-postman).

## Running the example app

> Note: This setup assumes you've already setup your React Native [development environment](https://reactnative.dev/docs/environment-setup). 

From the root directory of our SDK. 

1. `cd exampleReactNative76`
2. `npm install`
3. `cd ios`
4. `pod install`
5. `cd ..`
6. `npm run ios`

## Testing Plaid Link

1. Fetch a [Link Token](https://plaid.com/docs/api/tokens/#linktokencreate).
2. Paste your token into the `TextField` in the example app.
3. Press "Create Link" then "OPEN LINK" (see embedded Link once it loads)
4. If you testing in our Sandbox you can use our provided [test credentials](https://plaid.com/docs/sandbox/test-credentials/) for any financial institution.

	> username: user_good
	
	> password: pass_good


