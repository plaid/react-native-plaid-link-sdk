#import <React/RCTConversions.h>
#import <folly/dynamic.h>
#import <objc/runtime.h>

// This block checks for the appropriate header file inclusion for the Plaid Link SDK.
// It handles various project configurations such as the presence of `USE_FRAMEWORKS`
// and whether the new architecture (`RCT_NEW_ARCH_ENABLED`) is enabled.

#if __has_include(<rnplaidlink/react_native_plaid_link_sdk-Swift.h>)
// If the header file is available under the rnplaidlink module, include it.
// This is typically the case when the module is structured with this specific header path.
#import <rnplaidlink/react_native_plaid_link_sdk-Swift.h>

#else
// If the header is not found at the above path, check for other configurations.
#if defined(RCT_NEW_ARCH_ENABLED) && defined(USE_FRAMEWORKS)
// Include the header for projects with the new React Native architecture and `use_frameworks!` enabled.
// This path supports modular builds with frameworks.
#import <react_native_plaid_link_sdk/react_native_plaid_link_sdk-Swift.h>

#else
#if __has_include(<react_native_plaid_link_sdk/react_native_plaid_link_sdk-Swift.h>)
// Include the header for projects using frameworks (`use_frameworks!` in the Podfile).
// Frameworks are being used (static or dynamic).
#import <react_native_plaid_link_sdk/react_native_plaid_link_sdk-Swift.h>

#else
// Default to including the header directly for non-framework builds.
#import <react_native_plaid_link_sdk-Swift.h>
#endif
#endif
#endif

/*

 ### Notes for Developers: If you experience a compiler error above!

 1. If you're using frameworks - Ensure your pods are installed with the `USE_FRAMEWORKS=1` environment variable:
    USE_FRAMEWORKS=1 bundle exec pod install

 2. Verify that your `Podfile` includes either:
        use_frameworks! :linkage => :dynamic
    or
        use_frameworks! :linkage => :static

 3. Refer to these GitHub issues for more details:
    - https://github.com/plaid/react-native-plaid-link-sdk/issues/713
    - https://github.com/plaid/react-native-plaid-link-sdk/issues/732
    - https://github.com/plaid/react-native-plaid-link-sdk/issues/747

 ### Troubleshooting:
 - If `USE_FRAMEWORKS` is not working, ensure it is correctly passed as a preprocessor macro in your Xcode build settings.
 - For new architecture projects, confirm `RCT_NEW_ARCH_ENABLED` is properly set in your environment.
 */


// copied from RCTFollyConvert
folly::dynamic PLKConvertIdToFollyDynamic(id json)
{
  if (json == nil || json == (id)kCFNull) {
    return nullptr;
  } else if ([json isKindOfClass:[NSNumber class]]) {
    const char *objCType = [json objCType];
    switch (objCType[0]) {
      // This is a c++ bool or C99 _Bool.  On some platforms, BOOL is a bool.
      case _C_BOOL:
        return (bool)[json boolValue];
      case _C_CHR:
        // On some platforms, objc BOOL is a signed char, but it
        // might also be a small number.  Use the same hack JSC uses
        // to distinguish them:
        // https://phabricator.intern.facebook.com/diffusion/FBS/browse/master/fbobjc/xplat/third-party/jsc/safari-600-1-4-17/JavaScriptCore/API/JSValue.mm;b8ee03916489f8b12143cd5c0bca546da5014fc9$901
        if ([json isKindOfClass:[@YES class]]) {
          return (bool)[json boolValue];
        } else {
          return [json longLongValue];
        }
      case _C_UCHR:
      case _C_SHT:
      case _C_USHT:
      case _C_INT:
      case _C_UINT:
      case _C_LNG:
      case _C_ULNG:
      case _C_LNG_LNG:
      case _C_ULNG_LNG:
        return [json longLongValue];

      case _C_FLT:
      case _C_DBL:
        return [json doubleValue];

        // default:
        //   fall through
    }
  } else if ([json isKindOfClass:[NSString class]]) {
    NSData *data = [json dataUsingEncoding:NSUTF8StringEncoding];
    return std::string(reinterpret_cast<const char *>(data.bytes), data.length);
  } else if ([json isKindOfClass:[NSArray class]]) {
    folly::dynamic array = folly::dynamic::array;
    for (id element in json) {
      array.push_back(PLKConvertIdToFollyDynamic(element));
    }
    return array;
  } else if ([json isKindOfClass:[NSDictionary class]]) {
    __block folly::dynamic object = folly::dynamic::object();

    [json enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *value, __unused BOOL *stop) {
      object.insert(PLKConvertIdToFollyDynamic(key), PLKConvertIdToFollyDynamic(value));
    }];

    return object;
  }

  return nil;
}
