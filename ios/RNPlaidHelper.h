#import <LinkKit/LinkKit.h>

@interface RNPlaidHelper : NSObject

+ (id <PLKHandler> _Nullable)createWithLinkTokenConfiguration:(PLKLinkTokenConfiguration * _Nonnull)linkTokenConfiguration error:(NSError * _Nullable * _Nullable)error;

+ (void) syncFinanceKit:(NSString *_Nonnull)token
        requestAuthorizationIfNeeded:(BOOL)requestAuthorizationIfNeeded
              onSuccess:(void (^_Nonnull)(void))onSuccess
                onError:(void (^_Nonnull)(NSError * _Nonnull error))onError;
@end
