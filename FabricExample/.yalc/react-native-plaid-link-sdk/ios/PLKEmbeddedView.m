#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PLKEmbeddedViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(token, NSString)
RCT_EXPORT_VIEW_PROPERTY(iOSPresentationStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(onEmbeddedEvent, RCTDirectEventBlock)
@end
