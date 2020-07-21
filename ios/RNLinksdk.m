#import "RNLinksdk.h"

#import <Foundation/Foundation.h>
#import <LinkKit/LinkKit.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

static NSString* const kRNLinkKitConfigPublicKeyKey = @"publicKey";
static NSString* const kRNLinkKitConfigEnvKey = @"env";
static NSString* const kRNLinkKitConfigProductsKey = @"product";
static NSString* const kRNLinkKitConfigClientNameKey = @"clientName";
static NSString* const kRNLinkKitConfigWebhookKey = @"webhook";
static NSString* const kRNLinkKitConfigLinkCustomizationName = @"linkCustomizationName";
static NSString* const kRNLinkKitConfigLinkTokenKey = @"token";
static NSString* const kRNLinkKitConfigPaymentTokenKey = @"paymentToken";
static NSString* const kRNLinkKitConfigSelectAccountKey = @"selectAccount";
static NSString* const kRNLinkKitConfigUserLegalNameKey = @"userLegalName";
static NSString* const kRNLinkKitConfigUserEmailAddressKey = @"userEmailAddress";
static NSString* const kRNLinkKitConfigUserPhoneNumberKey = @"userPhoneNumber";
static NSString* const kRNLinkKitConfigAccountSubtypes = @"accountSubtypes";
static NSString* const kRNLinkKitConfigCountryCodesKey = @"countryCodes";
static NSString* const kRNLinkKitConfigLanguageKey = @"language";
static NSString* const kRNLinkKitConfigInstitutionKey = @"institution";
static NSString* const kRNLinkKitConfigLongtailAuthKey = @"longtailAuth";
static NSString* const kRNLinkKitConfigApiVersionKey = @"apiVersion";
static NSString* const kRNLinkKitConfigOAuthRedirectUriKey = @"oauthRedirectUri";
static NSString* const kRNLinkKitConfigOAuthNonceKey = @"oauthNonce";
static NSString* const kRNLinkKitConfigOAuthStateIdKey = @"oauthStateId";

static NSString* const kRNLinkKitOnEventEvent = @"onEvent";
static NSString* const kRNLinkKitEventTokenKey = @"public_token";
static NSString* const kRNLinkKitEventErrorKey = @"error";
static NSString* const kRNLinkKitEventNameKey = @"event";
static NSString* const kRNLinkKitEventMetadataKey = @"metadata";
static NSString* const kRNLinkKitVersionConstant = @"version";

NSString* const kRNLinkKitLinkTokenPrefix = @"link-";
NSString* const kRNLinkKitItemAddTokenPrefix = @"item-add-";

@interface RNLinkkitDelegate : NSObject <PLKPlaidLinkViewDelegate>
@property (copy) void(^onSuccess)(NSString* publicToken, NSDictionary<NSString*,id>*metadata);
@property (copy) void(^onExit)(NSError* error, NSDictionary<NSString*,id>*metadata);
@property (copy) void(^onEvent)(NSString* event, NSDictionary<NSString*,id>*metadata);
@end

@interface RNLinksdk ()
@property (nonatomic, strong) PLKPlaidLinkViewController* linkViewController;
@property (nonatomic, strong) UIViewController* presentingViewController;
@property (nonatomic, strong) RNLinkkitDelegate* linkViewDelegate;
@property (nonatomic, strong) RCTResponseSenderBlock completionCallback;
@property (nonatomic, assign) BOOL hasObservers;
@end

#pragma mark -

@implementation RNLinksdk

RCT_EXPORT_MODULE();

+ (NSString*)sdkVersion {
    return @"1.1.0";
}

+ (BOOL)requiresMainQueueSetup
{
    // Because LinkKit reliese on UIKit.
    return YES;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[kRNLinkKitOnEventEvent];
}

- (NSDictionary *)constantsToExport {
    return @{
        kRNLinkKitVersionConstant: [NSString stringWithFormat:@"%s+%.0f", LinkKitVersionString, LinkKitVersionNumber],
    };
}

- (void)startObserving {
    self.hasObservers = true;
    [super startObserving];
}

- (void)stopObserving {
    [super stopObserving];
    self.hasObservers = false;
}

RCT_EXPORT_METHOD(create:(NSDictionary*)configuration) {
    // Configuration
    NSString *linkTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkTokenKey]];
    NSString *paymentTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigPaymentTokenKey]];
    NSString *oauthStateId = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthStateIdKey]];
    NSString *institution = [RCTConvert NSString:configuration[kRNLinkKitConfigInstitutionKey]];

    PLKConfiguration* linkConfiguration;
    BOOL isUsingLinkToken = [linkTokenInput length] > 0 && [linkTokenInput hasPrefix:kRNLinkKitLinkTokenPrefix];

    if (isUsingLinkToken) {
      linkConfiguration = [self getLinkTokenConfiguration: configuration];
    } else {
      linkConfiguration = [self getLegacyLinkConfiguration: configuration];
    }

    // Cache the presenting view controller so it can be used to dismiss when done.
    self.presentingViewController = RCTPresentedViewController();

    __weak typeof(self) weakSelf = self;
    self.linkViewDelegate = [[RNLinkkitDelegate alloc] init];
    self.linkViewDelegate.onSuccess = ^(NSString* publicToken, NSDictionary<NSString*,id>*metadata) {
        __typeof(weakSelf) strongSelf = weakSelf;
        [strongSelf dismissLinkViewController];

        if (strongSelf.completionCallback) {
            NSMutableDictionary<NSString*, id> *jsMetadata = [metadata mutableCopy];
            jsMetadata[kRNLinkKitEventTokenKey] = publicToken;
            strongSelf.completionCallback(@[[NSNull null], jsMetadata]);
            strongSelf.completionCallback = nil;
        }
    };
    self.linkViewDelegate.onExit = ^(NSError* error, NSDictionary<NSString*,id>*metadata) {
        __typeof(weakSelf) strongSelf = weakSelf;
        [weakSelf dismissLinkViewController];

        if (strongSelf.completionCallback) {
            if (error) {
                strongSelf.completionCallback(@[RCTMakeError(error.localizedDescription, nil, nil), metadata]);
            } else {
                strongSelf.completionCallback(@[[NSNull null], metadata]);
            }
            strongSelf.completionCallback = nil;
        }
    };
    self.linkViewDelegate.onEvent = ^(NSString* event, NSDictionary<NSString*,id>*metadata) {
        __typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf.hasObservers) {
            [strongSelf sendEventWithName:kRNLinkKitOnEventEvent
                                     body:@{kRNLinkKitEventNameKey: event, kRNLinkKitEventMetadataKey: metadata}];
        }
    };

    if ([linkTokenInput length] > 0) {
        if (isUsingLinkToken) {
            self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithLinkToken:linkTokenInput
                                                                               oauthStateId:oauthStateId
                                                                              configuration:linkConfiguration
                                                                                   delegate:self.linkViewDelegate];
        }
        else if ([linkTokenInput hasPrefix:kRNLinkKitItemAddTokenPrefix]) {
            self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithItemAddToken:linkTokenInput
                                                                                 configuration:linkConfiguration
                                                                                      delegate:self.linkViewDelegate];
        }
        else {
            self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithPublicToken:linkTokenInput
                                                                                configuration:linkConfiguration
                                                                                     delegate:self.linkViewDelegate];
        }
    }
    else if ([institution length] > 0) {
        self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithInstitution:institution
                                                                            configuration:linkConfiguration
                                                                                 delegate:self.linkViewDelegate];
    }
    else if ([paymentTokenInput length] > 0) {
        self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithPaymentToken:paymentTokenInput
                                                                              oauthStateId:oauthStateId
                                                                             configuration:linkConfiguration
                                                                                  delegate:self.linkViewDelegate];
    }
    else if ([oauthStateId length] > 0) {
        self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithOAuthStateId:oauthStateId
                                                                             configuration:linkConfiguration
                                                                                  delegate:self.linkViewDelegate];
    }
    else {
        self.linkViewController = [[PLKPlaidLinkViewController alloc] initWithConfiguration:linkConfiguration
                                                                              delegate:self.linkViewDelegate];
    }
    
    self.linkViewController.modalPresentationStyle = UIModalPresentationFullScreen;
}

RCT_EXPORT_METHOD(open:(RCTResponseSenderBlock)callback) {
    if (self.linkViewController) {
        self.completionCallback = callback;
        [RCTPresentedViewController() presentViewController:self.linkViewController animated:YES completion:nil];
    } else {
        callback(@[RCTMakeError(@"create was not called", nil, nil)]);
    }
}

RCT_EXPORT_METHOD(dismiss) {
    [self dismissLinkViewController];
}

- (void)dismissLinkViewController {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
    self.presentingViewController = nil;
    self.linkViewController = nil;
    self.linkViewDelegate = nil;
}

- (PLKConfiguration*)getLinkTokenConfiguration:(NSDictionary*)configuration {
    NSString *linkTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkTokenKey]];
    NSString *oauthRedirectUri = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthRedirectUriKey]];
    NSString *oauthNonce = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthNonceKey]];

    PLKConfiguration* linkConfiguration = [[PLKConfiguration alloc] initWithLinkToken:linkTokenInput];

    if ([oauthRedirectUri length] > 0) {
        linkConfiguration.oauthRedirectUri = [NSURL URLWithString:oauthRedirectUri];
    }
    if ([oauthNonce length] > 0) {
        linkConfiguration.oauthNonce = oauthNonce;
    }
    
    return linkConfiguration;
}

- (PLKConfiguration*)getLegacyLinkConfiguration:(NSDictionary*)configuration {
  NSString *key = [RCTConvert NSString:configuration[kRNLinkKitConfigPublicKeyKey]];
  NSString *env = [RCTConvert NSString:configuration[kRNLinkKitConfigEnvKey]];
  NSArray<NSString*> *products = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigProductsKey]];
  NSString *clientName = [RCTConvert NSString:configuration[kRNLinkKitConfigClientNameKey]];
  NSString *webhook = [RCTConvert NSString:configuration[kRNLinkKitConfigWebhookKey]];
  NSString *linkCustomizationName = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkCustomizationName]];
  NSString *userLegalName = [RCTConvert NSString:configuration[kRNLinkKitConfigUserLegalNameKey]];
  NSString *userEmailAddress = [RCTConvert NSString:configuration[kRNLinkKitConfigUserEmailAddressKey]];
  NSString *userPhoneNumber = [RCTConvert NSString:configuration[kRNLinkKitConfigUserPhoneNumberKey]];
  NSString *oauthRedirectUri = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthRedirectUriKey]];
  NSString *oauthNonce = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthNonceKey]];
  NSDictionary<NSString*, NSArray<NSString*>*> *accountSubtypes = [RCTConvert NSDictionary:configuration[kRNLinkKitConfigAccountSubtypes]];
  NSArray<NSString*> *countryCodes = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigCountryCodesKey]];
  NSString *language = [RCTConvert NSString:configuration[kRNLinkKitConfigLanguageKey]];
  BOOL selectAccount = [RCTConvert BOOL:configuration[kRNLinkKitConfigSelectAccountKey]];
  BOOL longtailAuth = [RCTConvert BOOL:configuration[kRNLinkKitConfigLongtailAuthKey]];

  PLKEnvironment environment = PLKEnvironmentFromString(env);
  PLKProduct product = PLKProductFromArray(products);
  // v1 is no longer supported, always use v2 as default.
  PLKAPIVersion apiVersion = kPLKAPIVersionDefault;
  PLKConfiguration* linkConfiguration = [[PLKConfiguration alloc] initWithKey:key
                                                        env:environment
                                                    product:product
                                              selectAccount:selectAccount
                                               longtailAuth:longtailAuth
                                                 apiVersion:apiVersion];
  if ([clientName length] > 0) {
     linkConfiguration.clientName = clientName;
  }
  if([linkCustomizationName length] > 0) {
      linkConfiguration.linkCustomizationName = linkCustomizationName;
  }
  if ([webhook length] > 0) {
     linkConfiguration.webhook = [NSURL URLWithString:webhook];
  }
  if ([userLegalName length] > 0) {
     linkConfiguration.userLegalName = userLegalName;
  }
  if ([userEmailAddress length] > 0) {
     linkConfiguration.userEmailAddress = userEmailAddress;
  }
  if ([userPhoneNumber length] > 0) {
      linkConfiguration.userPhoneNumber = userPhoneNumber;
  }
  if ([oauthRedirectUri length] > 0) {
      linkConfiguration.oauthRedirectUri = [NSURL URLWithString:oauthRedirectUri];
  }
  if ([oauthNonce length] > 0) {
      linkConfiguration.oauthNonce = oauthNonce;
  }
  if ([accountSubtypes count] > 0) {
     linkConfiguration.accountSubtypes = accountSubtypes;
  }
  if ([countryCodes count] > 0) {
     linkConfiguration.countryCodes = countryCodes;
  }
  if ([language length] > 0) {
     linkConfiguration.language = language;
  }

  return linkConfiguration;
}

@end

#pragma mark - PLKPlaidLinkViewDelegate

@implementation RNLinkkitDelegate

- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
 didSucceedWithPublicToken:(NSString*)publicToken
                  metadata:(NSDictionary<NSString*,id>*)metadata {
    if (self.onSuccess) {
        self.onSuccess(publicToken, metadata);
    }
}

- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
          didExitWithError:(NSError*)error
                  metadata:(NSDictionary<NSString*,id>*)metadata {
    if (self.onExit) {
        self.onExit(error, metadata);
    }
}

- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
            didHandleEvent:(NSString*)event
                  metadata:(NSDictionary<NSString*,id>*)metadata {
    if (self.onEvent) {
        self.onEvent(event, metadata);
    }
}

@end

