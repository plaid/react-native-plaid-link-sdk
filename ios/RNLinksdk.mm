#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNLinksdk, NSObject)

RCT_EXTERN_METHOD(create:(NSString *)token noLoadingState:(BOOL)noLoadingState)
RCT_EXTERN_METHOD(open:(BOOL)fullScreen
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onExit:(RCTResponseSenderBlock)onExit)

RCT_EXTERN_METHOD(dismiss)

RCT_EXTERN_METHOD(submit:(NSString *)phoneNumber)

RCT_EXTERN_METHOD(syncFinanceKit:(NSString *)token
                  requestAuthorizationIfNeeded:(BOOL)requestAuthorizationIfNeeded
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError)

#if RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativePlaidLinkModuleiOSSpecJSI>(params);
}
#endif

@end
