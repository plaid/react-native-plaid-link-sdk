---
name: Bug report
about: Report a problem with the React Native Plaid Link SDK
title: ""
labels: bug
assignees: ""
---

## Problem

Describe what you were trying to do, what happened, and what you expected
instead.

## Environment

| Field                               | Value                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- |
| React Native Plaid Link SDK version | e.g. 13.0.0                                                                |
| React Native version                | e.g. 0.83.2                                                                |
| Expo SDK version                    | e.g. 55, or N/A                                                            |
| Runtime                             | Expo development build / custom native build / bare React Native / Expo Go |
| iOS affected                        | yes / no                                                                   |
| iOS version and device              | e.g. iOS 18, iPhone 16 simulator                                           |
| Android affected                    | yes / no                                                                   |
| Android version and device          | e.g. Android 15, Pixel 9 emulator                                          |
| New Architecture enabled            | yes / no / unsure                                                          |
| Link Session ID                     | e.g. 0de00328-44f8-4c2e-9eaf-726b2f70169c                                  |

Expo Go is not supported because this SDK includes native code. If the issue is
Expo-related, please confirm it reproduces in a development build or another
custom native runtime.

## Steps to reproduce

1.
2.
3.

Include the Link configuration you are using, excluding keys, secrets, tokens,
and personally identifiable information.

```json
{
  "client_name": "OMITTED",
  "products": ["auth"],
  "country_codes": ["US"],
  "language": "en",
  "android_package_name": "com.mycompany.myapp",
  "redirect_uri": "myapp://oauth"
}
```

## Expected result

What did you expect to happen?

## Actual result

What happened instead?

## Logs and screenshots

Attach relevant Android Logcat output, iOS console logs, stack traces, or
screenshots. Omit secrets, tokens, and personally identifiable information.

## Reproduction

Provide one of the following:

1. A link to a minimal demo app showing the behavior.
2. A concise code sample that can be dropped into a fresh application.
3. A snippet of the Link setup and launch code.
