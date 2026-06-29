# Contributing

Thanks for helping improve the Plaid React Native SDK. This repository contains
the JavaScript API, Expo Module bindings, native iOS and Android integrations,
and the example app used to validate releases.

## Development setup

Use the Node version in `.nvmrc`, then install dependencies:

```sh
npm ci
```

The example app has its own dependencies:

```sh
cd example
npm install
```

## Local checks

Run the focused checks before opening a pull request:

```sh
npm run lint
npm test -- --coverage --no-watch --passWithNoTests
npm run build
npm run check:package
```

For packaging or release-facing changes, also run:

```sh
npm run pack:dry-run
npm run publish:dry-run
```

## Pull requests

- Keep public v13 APIs stable unless the change is explicitly approved as
  breaking.
- Update `README.md`, `CHANGELOG.md`, or `V13_MIGRATION_GUIDE.md` when behavior,
  setup, supported versions, or migration guidance changes.
- Include Android and iOS testing notes when native behavior changes.
- Do not commit generated example projects, coverage output, build artifacts, or
  local editor/system files.

## Bug reports

Useful bug reports include the SDK version, React Native version, Expo SDK
version when applicable, whether the app is running in Expo Go or a development
build, platform, device or simulator, Link Session ID, logs, and a minimal
reproduction.
