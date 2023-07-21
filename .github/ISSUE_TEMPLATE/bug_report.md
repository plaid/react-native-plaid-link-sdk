---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

# The problem

Briefly describe the issue you are experiencing (or the feature you want to see added to the Plaid Link 
React Native SDK). Tell us what you were trying to do and what happened instead. 

# Environment

|                                                  |                                                                                  |
| -----------------------------| ----------------------------------------------- |
| Plaid Link React Native          | e.g. 10.3.0                                                                 |
| ReactNative Version               | e.g. 0.67.0                                                                 |
| Occurs on Android                  | e.g. yes                                                                     |
| Android OS Version                 | e.g. 11.0.0 (30)                                                         |
| Android Devices/Emulators    | e.g. Pixel 7a physical                                                |
| Occurs on iOS                          | e.g. yes                                                                     |
| iOS Version                               | e.g. 16                                                                       |
| iOS Devices/Emulators            | e.g. iPhone 14 Pro                                                    |
| Link Session ID                         | e.g. 0de00328-44f8-4c2e-9eaf-726b2f70169c |

# Steps to Reproduce

If necessary, describe the problem you have been experiencing in more detail.
Please include the configuration you are using for Link (excluding your keys
and personally identifiable information)

For example:
```
{
   "client_id":"OMITTED",
   "secret":"OMITTED",
   "user":{
      "client_user_id":"OMITTED",
      "legal_name":"OMITTED"
   },
   "client_name":"My application",
   "products":[
      "auth"
   ],
   "country_codes":[
      "US"
   ],
   "language":"en",
   "android_package_name":"com.mycompany.myapp"
}
```

# Expected Result
What did you expect to happen?

# Screenshots
If this is a visual bug a screenshot would be helpful.

# Logs
Any relevant logs from Android Logcat or the iOS console including stacktraces.

# Code To Reproduce Issue 
With sample code it's easier to reproduce the bug and it's much faster to fix it. 
Don't forget to omit any keys or personally identifiable information.
Please provide one of the following:

1. (Best) A link to a minimal demo app showing the faulty behavior.
1. (Better) A concise code sample which can be dropped into fresh application
1. A snippet of code for your configuration for opening Link
