# Plaid React Native SDK

React Native SDK for Plaid Link, built on Expo Modules for the v13 native architecture.

## API documentation

- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/react-native-plaid-link-sdk/)
- [Documentation for the main branch](https://docs.expo.dev/versions/unversioned/sdk/react-native-plaid-link-sdk/)

## Migration guides

- [v13 migration guide](./V13_MIGRATION_GUIDE.md)

## Installation

### Expo projects

Install the package and run the app in a development build or another custom native runtime. Expo Go cannot load custom native modules.

```sh
npm install react-native-plaid-link-sdk
```

### Bare React Native projects

Bare React Native apps must install and configure the [`expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before using this SDK.

```sh
npm install react-native-plaid-link-sdk
npx pod-install
```

### Platform setup

Configure Android package names, iOS bundle identifiers, and OAuth redirect settings in the Plaid Dashboard for the environments your app supports.

## Contributing

Issues and pull requests are welcome in this repository.
