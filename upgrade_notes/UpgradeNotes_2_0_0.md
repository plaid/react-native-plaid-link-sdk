# Upgrade notes:

## Android:
 
### Update the Android SDK version
In the build.gradle file in the app module, update your dependency to 0.3.0

```
implementation 'com.plaid.link:sdk-core:0.3.0'
```

### Register your redirect URI
To register your redirect URI:
1. Log into your [Plaid Dashboard](https://dashboard.plaid.com/)
2. Select API under Team Settings in the top navigation bar
3. Click configure then Add New Uri then enter your Uri  (for example yourAppName://redirect)
4. Click Save Changes

### Update your manifest
```
<activity android:name="com.plaid.link.redirect.LinkRedirectActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data
      android:host="redirect"
      android:scheme="yourappname" />
  </intent-filter>
</activity>
```
 
### Update the plaid link js component

```
return <PlaidLink
      ...
      webviewRedirectUri = "yourAppName://redirect"
      ...
    />;
```
 
### Update Event Handling

We will no longer be returning a string but rather a JSONObject.  We have also renamed `event_name` to `event` to align with iOS events.
