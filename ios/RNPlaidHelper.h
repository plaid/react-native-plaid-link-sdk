#import <LinkKit/LinkKit.h>

@interface RNPlaidHelper : NSObject

+ (id <PLKHandler> _Nullable)createWithLinkTokenConfiguration:(PLKLinkTokenConfiguration * _Nonnull)linkTokenConfiguration error:(NSError * _Nullable * _Nullable)error;

@end
