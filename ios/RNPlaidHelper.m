#import "RNPlaidHelper.h"

@implementation RNPlaidHelper

+ (id <PLKHandler> _Nullable)createWithLinkTokenConfiguration:(PLKLinkTokenConfiguration * _Nonnull)linkTokenConfiguration error:(NSError * _Nullable * _Nullable)error
{
    return [PLKPlaid createWithLinkTokenConfiguration:linkTokenConfiguration error:error];
}

+ (id <PLKHandler> _Nullable)createWithLinkPublicKeyConfiguration:(PLKLinkPublicKeyConfiguration * _Nonnull)linkPublicKeyConfiguration error:(NSError * _Nullable * _Nullable)error
{
    return [PLKPlaid createWithLinkPublicKeyConfiguration:linkPublicKeyConfiguration error:error];
}

@end
