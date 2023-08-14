#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PLKEmbeddedViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(token, NSString)
RCT_EXPORT_VIEW_PROPERTY(presentationStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(onSuccess, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEvent, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onExit, RCTDirectEventBlock)
@end
