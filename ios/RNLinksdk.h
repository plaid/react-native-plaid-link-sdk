#ifdef RCT_NEW_ARCH_ENABLED
#import <rnplaidlink/rnplaidlink.h>
#else
#import <React/RCTBridge.h>
#endif
#import "RCTEventEmitter.h"

#import <LinkKit/LinkKit.h>

@interface RNLinksdk : RCTEventEmitter
#ifdef RCT_NEW_ARCH_ENABLED
                                   <NativePlaidLinkModuleSpec>
#else
                                   <RCTBridgeModule>
#endif

+ (NSDictionary *)dictionaryFromSuccess:(PLKLinkSuccess *)success;
+ (NSDictionary *)dictionaryFromEvent:(PLKLinkEvent *)event;
+ (NSDictionary *)dictionaryFromExit:(PLKLinkExit *)exit;
@end
