# React Native Plaid Link SDK v13 Migration Guide

This guide covers breaking changes introduced in `react-native-plaid-link-sdk` v13 and how to update your integration.

## Breaking Changes

### `LinkAccountSubtypeInvestment.SIIP` renamed to `SIPP`

The misspelled investment account subtype constant `LinkAccountSubtypeInvestment.SIIP` has been removed and replaced with the correctly spelled `LinkAccountSubtypeInvestment.SIPP` (Self-Invested Personal Pension).

The underlying runtime value is unchanged (`"sipp"`), so this is a compile-time rename only. No behavior changes for accounts that were already filtered correctly.

Before (v12 and earlier):

```ts
import { LinkAccountSubtypeInvestment } from 'react-native-plaid-link-sdk';

const subtypes = [LinkAccountSubtypeInvestment.SIIP];
```

After (v13):

```ts
import { LinkAccountSubtypeInvestment } from 'react-native-plaid-link-sdk';

const subtypes = [LinkAccountSubtypeInvestment.SIPP];
```

Action required: replace any usage of `LinkAccountSubtypeInvestment.SIIP` with `LinkAccountSubtypeInvestment.SIPP`. TypeScript will surface the removed member as a compile error:

```
Property 'SIIP' does not exist on type 'typeof LinkAccountSubtypeInvestment'. Did you mean 'SIPP'?
```
