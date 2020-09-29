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

@interface RNLinksdk ()
@property (nonatomic, strong) id<PLKHandler> linkHandler;
@property (nonatomic, strong) UIViewController* presentingViewController;
@property (nonatomic, strong) RCTResponseSenderBlock completionCallback;
@property (nonatomic, assign) BOOL hasObservers;
@property (nonatomic, copy) NSString *institutionID;
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
        // TODO: Actual version numbers again
        kRNLinkKitVersionConstant: [NSString stringWithFormat:@"%s+%.0f", "LinkKitVersionString", 1],
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
    NSString *institution = [RCTConvert NSString:configuration[kRNLinkKitConfigInstitutionKey]];

    BOOL isUsingLinkToken = [linkTokenInput length];

    // Cache the presenting view controller so it can be used to dismiss when done.
    self.presentingViewController = RCTPresentedViewController();

    __weak typeof(self) weakSelf = self;
    void (^onSuccess)(PLKLinkSuccess *) = ^(PLKLinkSuccess *success) {
        __typeof(weakSelf) strongSelf = weakSelf;
        [strongSelf dismissLinkViewController];

        if (strongSelf.completionCallback) {
            NSMutableDictionary<NSString*, id> *jsMetadata = [[RNLinksdk dictionaryFromSuccessMetadata:success.metadata] mutableCopy];
            jsMetadata[kRNLinkKitEventTokenKey] = success.publicToken;
            strongSelf.completionCallback(@[[NSNull null], jsMetadata]);
            strongSelf.completionCallback = nil;
        }
    };
    
    void (^onExit)(PLKLinkExit *) = ^(PLKLinkExit *exit) {
        __typeof(weakSelf) strongSelf = weakSelf;
        [weakSelf dismissLinkViewController];

        if (strongSelf.completionCallback) {
            if (exit.error) {
                NSDictionary *exitMetadata = [RNLinksdk dictionaryFromExitMetadata:exit.metadata];
                strongSelf.completionCallback(@[RCTMakeError(exit.error.localizedDescription, nil, nil), exitMetadata]);
            } else {
                strongSelf.completionCallback(@[[NSNull null], exit.metadata]);
            }
            strongSelf.completionCallback = nil;
        }
    };
    
    void (^onEvent)(PLKLinkEvent *) = ^(PLKLinkEvent *event) {
        __typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf.hasObservers) {
            NSDictionary *eventMetadata = [RNLinksdk dictionaryFromEventMetadata:event.eventMetadata];
            [strongSelf sendEventWithName:kRNLinkKitOnEventEvent
                                     body:@{kRNLinkKitEventNameKey: event.eventName, kRNLinkKitEventMetadataKey: eventMetadata}];
        }
    };

    if (isUsingLinkToken) {
        PLKLinkTokenConfiguration *config = [self getLinkTokenConfiguration:configuration
                                                           onSuccessHandler:onSuccess];
        config.onEvent = onEvent;
        config.onExit = onExit;
        self.linkHandler = [PLKPlaid createWithLinkTokenConfiguration:config
                                                                error:NULL];
    } else {
        PLKLinkPublicKeyConfiguration *config = [self getLegacyLinkConfiguration:configuration
                                                                onSuccessHandler:onSuccess];
        config.onEvent = onEvent;
        config.onExit = onExit;
        self.linkHandler = [PLKPlaid createWithLinkPublicKeyConfiguration:config
                                                                    error:NULL];
    }
    if ([institution length] > 0) {
        self.institutionID = institution;

    }
}

RCT_EXPORT_METHOD(open:(RCTResponseSenderBlock)callback) {
    if (self.linkHandler) {
        self.completionCallback = callback;
        self.presentingViewController = RCTPresentedViewController();
        [self.linkHandler openWithContextViewController:self.presentingViewController];
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
    self.linkHandler = nil;
}

- (PLKLinkTokenConfiguration *)getLinkTokenConfiguration:(NSDictionary *)configuration
                                        onSuccessHandler:(void(^)(PLKLinkSuccess *))onSuccessHandler {
    NSString *linkTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkTokenKey]];
    
    return [PLKLinkTokenConfiguration createWithToken:linkTokenInput onSuccess:onSuccessHandler];
}

- (PLKLinkPublicKeyConfiguration *)getLegacyLinkConfiguration:(NSDictionary *)configuration
                                             onSuccessHandler:(void(^)(PLKLinkSuccess *))onSuccessHandler  {
  NSString *key = [RCTConvert NSString:configuration[kRNLinkKitConfigPublicKeyKey]];
  NSString *paymentTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigPaymentTokenKey]];
  NSString *env = [RCTConvert NSString:configuration[kRNLinkKitConfigEnvKey]];
  NSArray<NSString*> *productsInput = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigProductsKey]];
  NSString *clientName = [RCTConvert NSString:configuration[kRNLinkKitConfigClientNameKey]];
  NSString *webhook = [RCTConvert NSString:configuration[kRNLinkKitConfigWebhookKey]];
  NSString *linkCustomizationName = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkCustomizationName]];
  NSString *userLegalName = [RCTConvert NSString:configuration[kRNLinkKitConfigUserLegalNameKey]];
  NSString *userEmailAddress = [RCTConvert NSString:configuration[kRNLinkKitConfigUserEmailAddressKey]];
  NSString *userPhoneNumber = [RCTConvert NSString:configuration[kRNLinkKitConfigUserPhoneNumberKey]];
  NSString *oauthRedirectUriString = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthRedirectUriKey]];
  NSString *oauthNonce = [RCTConvert NSString:configuration[kRNLinkKitConfigOAuthNonceKey]];
  NSDictionary<NSString*, NSArray<NSString*>*> *accountSubtypes = [RCTConvert NSDictionary:configuration[kRNLinkKitConfigAccountSubtypes]];
  NSArray<NSString*> *countryCodes = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigCountryCodesKey]];
  NSString *language = [RCTConvert NSString:configuration[kRNLinkKitConfigLanguageKey]];
    
    PLKLinkPublicKeyConfigurationToken *token;
    if ([paymentTokenInput length] > 0) {
        token = [PLKLinkPublicKeyConfigurationToken createWithPaymentToken:paymentTokenInput publicKey:key];
    } else {
        token = [PLKLinkPublicKeyConfigurationToken createWithPublicKey:key];
    }
    
    PLKEnvironment environment = [RNLinksdk environmentFromString:env];
    NSArray<NSNumber *> *products = [RNLinksdk productsArrayFromProductsStringArray:productsInput];
    PLKLinkPublicKeyConfiguration *linkConfiguration = [[PLKLinkPublicKeyConfiguration alloc] initWithClientName:clientName
                                                                                                     environment:environment
                                                                                                        products:products
                                                                                                        language:language
                                                                                                           token:token
                                                                                                    countryCodes:countryCodes
                                                                                                       onSuccess:onSuccessHandler];
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
  if ([oauthRedirectUriString length] > 0 && [oauthNonce length] > 0) {
      NSURL* oauthRedirectUri = [NSURL URLWithString:oauthRedirectUriString];
      linkConfiguration.oauthConfiguration = [PLKOAuthNonceConfiguration createWithNonce:oauthNonce
                                                                             redirectUri:oauthRedirectUri];
  }
  if ([accountSubtypes count] > 0) {
      NSArray<NSString *> *accountSubtypeStrings = [RNLinksdk flatten:accountSubtypes.allValues];
      linkConfiguration.accountSubtypes = [RNLinksdk accountSubtypesArrayFromAccountSubtypesStringArray:accountSubtypeStrings];
  }

  return linkConfiguration;
}

#pragma mark - Bridging

+ (PLKEnvironment)environmentFromString:(NSString *)string {
    if ([string isEqualToString:@"production"]) {
        return PLKEnvironmentProduction;
    }
    
    if ([string isEqualToString:@"sandbox"]) {
        return PLKEnvironmentSandbox;
    }
    
    if ([string isEqualToString:@"development"]) {
        return PLKEnvironmentDevelopment;
    }
    
    // Default to Development
    NSLog(@"Unexpected environment string value: %@. Expected one of: production, sandbox, or development.", string);
    return PLKEnvironmentDevelopment;
}

+ (NSArray<NSNumber *> *)productsArrayFromProductsStringArray:(NSArray<NSString *> *)productsStringArray {
    NSMutableArray<NSNumber *> *results = [NSMutableArray arrayWithCapacity:productsStringArray.count];
    
    for (NSString *productString in productsStringArray) {
        NSNumber *product = [self productFromProductString:productString];
        if (product) {
            [results addObject:product];
        }
    }
    
    return [results copy];
}

+ (NSNumber * __nullable)productFromProductString:(NSString *)productString {
    // TODO: implement
    return nil;
}

+ (NSArray<id<PLKAccountSubtype>> *)accountSubtypesArrayFromAccountSubtypesStringArray:(NSArray<NSString *> *)accountSubtypesStringArray {
    NSMutableArray<id<PLKAccountSubtype>> *results = [NSMutableArray arrayWithCapacity:accountSubtypesStringArray.count];
    
    for (NSString *accountSubtypeString in accountSubtypesStringArray) {
        id<PLKAccountSubtype> accountSubtype = [self accountSubtypeFromString:accountSubtypeString];
        if (accountSubtype) {
            [results addObject:accountSubtype];
        }
    }
    
    return [results copy];
}

+ (NSArray *)flatten:(NSArray<NSArray *> *)nestedArray {
    NSMutableArray *results = [NSMutableArray array];
    
    for (id obj in nestedArray) {
        if ([obj isKindOfClass:[NSArray class]]) {
            [results addObjectsFromArray:obj];
        } else {
            [results addObject:obj];
        }
    }
    
    return [results copy];
}

+ (id<PLKAccountSubtype> __nullable)accountSubtypeFromString:(NSString *)accountSubtypeString {
    // TODO: implement
    return nil;
}

+ (NSDictionary *)dictionaryFromSuccessMetadata:(PLKSuccessMetadata *)metadata {
    // TODO
    return @{};
}

+ (NSDictionary *)dictionaryFromEventMetadata:(PLKEventMetadata *)metadata {
    // TODO
    return @{};
}

+ (NSDictionary *)dictionaryFromExitMetadata:(PLKExitMetadata *)metadata {
    // TODO
    return @{};
}

@end
