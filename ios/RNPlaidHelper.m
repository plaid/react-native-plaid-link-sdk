#import "RNPlaidHelper.h"

@implementation RNPlaidHelper

+ (id<PLKHandler> _Nullable)createWithLinkTokenConfiguration:(PLKLinkTokenConfiguration * _Nonnull)linkTokenConfiguration
                                                       error:(NSError * _Nullable * _Nullable)error
{
    return [PLKPlaid createWithLinkTokenConfiguration:linkTokenConfiguration error:error];
}

+ (void)syncFinanceKit:(NSString * _Nonnull)token
requestAuthorizationIfNeeded:(BOOL)requestAuthorizationIfNeeded
     simulatedBehavior:(BOOL)simulatedBehavior
              onSuccess:(void (^_Nonnull)(void))onSuccess
                onError:(void (^_Nonnull)(NSError * _Nonnull error))onError
{
    if (@available(iOS 17.4, *)) {
        [PLKPlaid syncFinanceKitWithToken:token
           requestAuthorizationIfNeeded:requestAuthorizationIfNeeded
                      simulatedBehavior:simulatedBehavior
                               onSuccess:onSuccess
                                 onError:onError];
    } else {
        NSError *error = [NSError errorWithDomain:@"com.plaid.financeKit"
                                             code:1001
                                         userInfo:@{ NSLocalizedDescriptionKey: @"FinanceKit Requires iOS >= 17.4" }];
        onError(error);
    }
}

@end
