#import <React/RCTConversions.h>
#import <folly/dynamic.h>
#import <objc/runtime.h>

#if __has_include(<rnplaidlink/react_native_plaid_link_sdk-Swift.h>)
#import <rnplaidlink/react_native_plaid_link_sdk-Swift.h>
#else
#ifdef USE_FRAMEWORKS
#import <react_native_plaid_link_sdk/react_native_plaid_link_sdk-Swift.h>
#else
#ifdef RCT_NEW_ARCH_ENABLED
#import <react_native_plaid_link_sdk/react_native_plaid_link_sdk-Swift.h>
#else
#import <react_native_plaid_link_sdk-Swift.h>
#endif
#endif
#endif

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
