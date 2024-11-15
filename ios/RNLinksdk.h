#ifdef RCT_NEW_ARCH_ENABLED
#import <rnplaidlink/rnplaidlink.h>
#endif
#import <React/RCTBridge.h>
#import "RCTEventEmitter.h"

@interface RNLinksdk : RCTEventEmitter
#ifdef RCT_NEW_ARCH_ENABLED
                                   <NativePlaidLinkModuleiOSSpec>
#else
                                   <RCTBridgeModule>
#endif
@end
