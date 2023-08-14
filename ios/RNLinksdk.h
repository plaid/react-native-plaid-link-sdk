
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#else
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#endif

#import <LinkKit/LinkKit.h>

@interface RNLinksdk : RCTEventEmitter <RCTBridgeModule>

+ (NSDictionary *)dictionaryFromSuccess:(PLKLinkSuccess *)success;
+ (NSDictionary *)dictionaryFromEvent:(PLKLinkEvent *)event;
+ (NSDictionary *)dictionaryFromExit:(PLKLinkExit *)exit;
@end
