#import "RNLinksdk.h"

#import <Foundation/Foundation.h>
#import <LinkKit/LinkKit.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

#import <objc/runtime.h>

static NSString* const kRNLinkKitConfigPublicKeyKey = @"publicKey";
static NSString* const kRNLinkKitConfigEnvKey = @"environment";
static NSString* const kRNLinkKitConfigProductsKey = @"products";
static NSString* const kRNLinkKitConfigClientNameKey = @"clientName";
static NSString* const kRNLinkKitConfigWebhookKey = @"webhook";
static NSString* const kRNLinkKitConfigLinkCustomizationName = @"linkCustomizationName";
static NSString* const kRNLinkKitConfigLinkTokenKey = @"token";
static NSString* const kRNLinkKitConfigSelectAccountKey = @"selectAccount";
static NSString* const kRNLinkKitConfigUserLegalNameKey = @"userLegalName";
static NSString* const kRNLinkKitConfigUserEmailAddressKey = @"userEmailAddress";
static NSString* const kRNLinkKitConfigUserPhoneNumberKey = @"userPhoneNumber";
static NSString* const kRNLinkKitConfigAccountSubtypes = @"accountSubtypes";
static NSString* const kRNLinkKitConfigCountryCodesKey = @"countryCodes";
static NSString* const kRNLinkKitConfigLanguageKey = @"language";
static NSString* const kRNLinkKitConfigInstitutionKey = @"institution";
static NSString* const kRNLinkKitConfigNoLoadingStateKey = @"noLoadingState";
static NSString* const kRNLinkKitConfigLongtailAuthKey = @"longtailAuth";
static NSString* const kRNLinkKitConfigApiVersionKey = @"apiVersion";
static NSString* const kRNLinkKitConfigOAuthRedirectUriKeyPath = @"oauthConfiguration.redirectUri";
static NSString* const kRNLinkKitConfigOAuthNonceKeyPath = @"oauthConfiguration.nonce";

static NSString* const kRNLinkKitOnEventEvent = @"onEvent";
static NSString* const kRNLinkKitEventErrorKey = @"error";
static NSString* const kRNLinkKitEventNameKey = @"event";
static NSString* const kRNLinkKitEventMetadataKey = @"metadata";
static NSString* const kRNLinkKitVersionConstant = @"version";

NSString* const kRNLinkKitLinkTokenPrefix = @"link-";
NSString* const kRNLinkKitItemAddTokenPrefix = @"item-add-";
NSString* const kRNLinkKitPaymentTokenPrefix = @"payment";
NSString* const kRNLinkKitDepositSwitchTokenPrefix = @"deposit-switch-";
NSString* const kRNLinkKitPublicTokenPrefix = @"public-";

@interface RNLinksdk ()
@property (nonatomic, strong) id<PLKHandler> linkHandler;
@property (nonatomic, strong) UIViewController* presentingViewController;
@property (nonatomic, strong) RCTResponseSenderBlock successCallback;
@property (nonatomic, strong) RCTResponseSenderBlock exitCallback;
@property (nonatomic, assign) BOOL hasObservers;
@property (nonatomic, copy) NSString *institutionID;
@property (nonatomic, nullable, strong) NSError *creationError;
@end

#pragma mark -

// Category to ensure both the old, typo spelling of `insitution` and
// the corrected spelling `institution` are visible to the implementation
// to allow compiling against any LinkKit dependency
@interface PLKSuccessMetadata (InstitutionTypoFix)

- (PLKInstitution * __nonnull)institution;
- (PLKInstitution * __nonnull)insitution;

@end

// Class to have a distinct +load method to hook into the runtime before
// SDK logic executes
@interface PLKSuccessMetadataTypoFix : NSObject

@end

@implementation PLKSuccessMetadataTypoFix

+ (void)load {
    static dispatch_once_t onceToken;
    // dispatch_once out of an abundance of caution in case +load is ever called multiple times
    dispatch_once(&onceToken, ^{
        Class targetClass = NSClassFromString(@"PLKSuccessMetadata");
        if (targetClass == Nil) {
          return;
        }

        SEL typoSel = NSSelectorFromString(@"insitution");
        SEL correctSel = NSSelectorFromString(@"institution");

        BOOL respondsToTypoSel = class_respondsToSelector(targetClass, typoSel);
        BOOL respondsToCorrectSel = class_respondsToSelector(targetClass, correctSel);

        BOOL respondsToBoth = respondsToCorrectSel && respondsToTypoSel;

        // If PLKSuccessMetadata responds to both, no swizzling is necessary
        if (respondsToBoth) {
            return;
        }

        BOOL respondsToNeither = !(respondsToCorrectSel || respondsToTypoSel);
        // If PLKSuccessMetadata responds to neither, swizzling cannot fix this
        if (respondsToNeither) {
            NSString *githubIssueURLString = @"https://github.com/plaid/react-native-plaid-link-sdk/issues/new?assignees=&labels=&template=bug_report.md&title=";
            NSAssert(NO, @"%@ does not respond to correctly spelled %@ or legacy, typo %@. This is a bug in either react-native-plaid-link-sdk, or LinkKit. Please file an issue at: %@", NSStringFromClass(targetClass), NSStringFromSelector(correctSel), NSStringFromSelector(typoSel), githubIssueURLString);
            return;
        }

        SEL existingSel = respondsToCorrectSel ? correctSel : typoSel;
        SEL missingSel = respondsToTypoSel ? correctSel : typoSel;

        Method method = class_getInstanceMethod(targetClass, existingSel);
        const char* types = method_getTypeEncoding(method);
        IMP implementation = class_getMethodImplementation(targetClass, existingSel);
        class_addMethod(targetClass, missingSel, implementation, types);
    });
}

@end

@implementation RNLinksdk

RCT_EXPORT_MODULE();

+ (NSString*)sdkVersion {
return @"9.0.0"; // SDK_VERSION
}

+ (NSString*)objCBridgeVersion {
    return @"1.1.0";
}

+ (BOOL)requiresMainQueueSetup
{
    // Because LinkKit relies on UIKit.
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
    self.hasObservers = YES;
    [super startObserving];
}

- (void)stopObserving {
    [super stopObserving];
    self.hasObservers = NO;
}

RCT_EXPORT_METHOD(continueFromRedirectUriString:(NSString *)redirectUriString) {
    NSURL *receivedRedirectUri = (id)redirectUriString == [NSNull null] ? nil : [NSURL URLWithString:redirectUriString];

    if (receivedRedirectUri && self.linkHandler) {
       [self.linkHandler continueFromRedirectUri:receivedRedirectUri];
    }
}

RCT_EXPORT_METHOD(create:(NSDictionary*)configuration) {
    // Configuration
    NSString *linkTokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkTokenKey]];
    NSString *institution = [RCTConvert NSString:configuration[kRNLinkKitConfigInstitutionKey]];

    BOOL isUsingLinkToken = [linkTokenInput length] && [linkTokenInput hasPrefix:kRNLinkKitLinkTokenPrefix];

    __weak typeof(self) weakSelf = self;
    void (^onSuccess)(PLKLinkSuccess *) = ^(PLKLinkSuccess *success) {
        __typeof(weakSelf) strongSelf = weakSelf;

        if (strongSelf.successCallback) {
            NSDictionary<NSString*, id> *jsMetadata = [RNLinksdk dictionaryFromSuccess:success];
            strongSelf.successCallback(@[jsMetadata]);
            strongSelf.successCallback = nil;
        }
    };

    void (^onExit)(PLKLinkExit *) = ^(PLKLinkExit *exit) {
        __typeof(weakSelf) strongSelf = weakSelf;

        if (strongSelf.exitCallback) {
            NSDictionary *exitMetadata = [RNLinksdk dictionaryFromExit:exit];
            if (exit.error) {
                strongSelf.exitCallback(@[exitMetadata[@"error"], exitMetadata]);
            } else {
                strongSelf.exitCallback(@[[NSNull null], exitMetadata]);
            }
            strongSelf.exitCallback = nil;
        }
    };

    void (^onEvent)(PLKLinkEvent *) = ^(PLKLinkEvent *event) {
        __typeof(weakSelf) strongSelf = weakSelf;
        if (strongSelf.hasObservers) {
            NSDictionary *eventDictionary = [RNLinksdk dictionaryFromEvent:event];
            [strongSelf sendEventWithName:kRNLinkKitOnEventEvent
                                     body:eventDictionary];
        }
    };

    if (isUsingLinkToken) {
        PLKLinkTokenConfiguration *config = [self getLinkTokenConfiguration:configuration
                                                           onSuccessHandler:onSuccess];
        config.onEvent = onEvent;
        config.onExit = onExit;
        config.noLoadingState = configuration[kRNLinkKitConfigNoLoadingStateKey];

        NSError *creationError = nil;
        self.linkHandler = [PLKPlaid createWithLinkTokenConfiguration:config
                                                                error:&creationError];
        self.creationError = creationError;
    } else {
        PLKLinkPublicKeyConfiguration *config = [self getLegacyLinkConfiguration:configuration
                                                                onSuccessHandler:onSuccess];
        config.onEvent = onEvent;
        config.onExit = onExit;
        NSError *creationError = nil;
        self.linkHandler = [PLKPlaid createWithLinkPublicKeyConfiguration:config
                                                                    error:&creationError];
        self.creationError = creationError;
    }

    if ([institution length] > 0) {
        self.institutionID = institution;
    }
}

RCT_EXPORT_METHOD(open:(RCTResponseSenderBlock)onSuccess :(RCTResponseSenderBlock)onExit) {
    if (self.linkHandler) {
        self.successCallback = onSuccess;
        self.exitCallback = onExit;
        self.presentingViewController = RCTPresentedViewController();
        NSDictionary *options = self.institutionID.length > 0 ? @{@"institution_id": self.institutionID} : @{};

        // Some link flows do not need to present UI, so track if presentation happened so dismissal isn't
        // unnecessarily invoked.
        __block bool didPresent = NO;

        __weak typeof(self) weakSelf = self;
        void(^presentationHandler)(UIViewController *) = ^(UIViewController *linkViewController) {
            [weakSelf.presentingViewController presentViewController:linkViewController animated:YES completion:nil];
            didPresent = YES;
        };
        void(^dismissalHandler)(UIViewController *) = ^(UIViewController *linkViewController) {
            if (didPresent) {
                [weakSelf dismiss];
                didPresent = NO;
            }
        };
        [self.linkHandler openWithPresentationHandler:presentationHandler dismissalHandler:dismissalHandler options:options];
    } else {
        id error = self.creationError ? RCTJSErrorFromNSError(self.creationError) : RCTMakeError(@"create was not called", nil, nil);
        onExit(@[error]);
    }
}

RCT_EXPORT_METHOD(dismiss) {
    [self.presentingViewController dismissViewControllerAnimated:YES
                                                      completion:nil];
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
    NSString *tokenInput = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkTokenKey]];
    NSString *env = [RCTConvert NSString:configuration[kRNLinkKitConfigEnvKey]];
    NSArray<NSString*> *productsInput = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigProductsKey]];
    NSString *clientName = [RCTConvert NSString:configuration[kRNLinkKitConfigClientNameKey]];
    NSString *webhook = [RCTConvert NSString:configuration[kRNLinkKitConfigWebhookKey]];
    NSString *linkCustomizationName = [RCTConvert NSString:configuration[kRNLinkKitConfigLinkCustomizationName]];
    NSString *userLegalName = [RCTConvert NSString:configuration[kRNLinkKitConfigUserLegalNameKey]];
    NSString *userEmailAddress = [RCTConvert NSString:configuration[kRNLinkKitConfigUserEmailAddressKey]];
    NSString *userPhoneNumber = [RCTConvert NSString:configuration[kRNLinkKitConfigUserPhoneNumberKey]];
    NSString *oauthRedirectUriInput = [configuration valueForKeyPath:kRNLinkKitConfigOAuthRedirectUriKeyPath];
    NSString *oauthRedirectUriString = [RCTConvert NSString:oauthRedirectUriInput];
    NSString *oauthNonceInput = [configuration valueForKeyPath:kRNLinkKitConfigOAuthNonceKeyPath];
    NSString *oauthNonce = [RCTConvert NSString:oauthNonceInput];
    id accountSubtypesInput = configuration[kRNLinkKitConfigAccountSubtypes];
    NSArray<NSDictionary<NSString*, NSString *>*> *accountSubtypeDictionaries = [RCTConvert NSDictionaryArray:accountSubtypesInput];
    NSArray<NSString*> *countryCodes = [RCTConvert NSStringArray:configuration[kRNLinkKitConfigCountryCodesKey]];
    NSString *language = [RCTConvert NSString:configuration[kRNLinkKitConfigLanguageKey]];

    PLKLinkPublicKeyConfigurationToken *token;
    BOOL isPaymentToken = [tokenInput hasPrefix:kRNLinkKitPaymentTokenPrefix];
    BOOL isItemAddToken = [tokenInput hasPrefix:kRNLinkKitItemAddTokenPrefix];
    BOOL isDepositSwitchToken = [tokenInput hasPrefix:kRNLinkKitDepositSwitchTokenPrefix];
    BOOL isPublicToken = [tokenInput hasPrefix:kRNLinkKitPublicTokenPrefix];
    if (isPaymentToken) {
        token = [PLKLinkPublicKeyConfigurationToken createWithPaymentToken:tokenInput publicKey:key];
    } else if (isItemAddToken) {
        token = [PLKLinkPublicKeyConfigurationToken createWithPublicToken:tokenInput publicKey:key];
    } else if (isDepositSwitchToken) {
        token = [PLKLinkPublicKeyConfigurationToken createWithDepositSwitchToken:tokenInput publicKey:key];
    } else if (isPublicToken) {
        token = [PLKLinkPublicKeyConfigurationToken createWithPublicToken:tokenInput publicKey:key];
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
  if ([linkCustomizationName length] > 0) {
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
  if ([accountSubtypeDictionaries count] > 0) {
      linkConfiguration.accountSubtypes = [RNLinksdk accountSubtypesArrayFromAccountSubtypeDictionaries:accountSubtypeDictionaries];
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
    NSDictionary *productStringMap = @{
        @"auth": @(PLKProductAuth),
        @"identity": @(PLKProductIdentity),
        @"income": @(PLKProductIncome),
        @"transactions": @(PLKProductTransactions),
        @"assets": @(PLKProductAssets),
        @"liabilities": @(PLKProductLiabilities),
        @"investments": @(PLKProductInvestments),
        @"deposit_switch": @(PLKProductDepositSwitch),
    };
    return productStringMap[productString.lowercaseString];
}

+ (NSArray<id<PLKAccountSubtype>> *)accountSubtypesArrayFromAccountSubtypeDictionaries:(NSArray<NSDictionary<NSString *, NSString *> *> *)accountSubtypeDictionaries {
    __block NSMutableArray<id<PLKAccountSubtype>> *results = [NSMutableArray array];

    for (NSDictionary *accountSubtypeDictionary in accountSubtypeDictionaries) {
        NSString *type = accountSubtypeDictionary[@"type"];
        NSString *subtype = accountSubtypeDictionary[@"subtype"];
        id<PLKAccountSubtype> result = [self accountSubtypeFromTypeString:type subtypeString:subtype];
        if (result) {
            [results addObject:result];
        }
    }

    return [results copy];
}

+ (id<PLKAccountSubtype>)accountSubtypeFromTypeString:(NSString *)typeString
                                        subtypeString:(NSString *)subtypeString {
    NSString *normalizedTypeString = typeString.lowercaseString;
    NSString *normalizedSubtypeString = subtypeString.lowercaseString;
    if ([normalizedTypeString isEqualToString:@"other"]) {
        if ([normalizedSubtypeString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeOther createWithValue:PLKAccountSubtypeValueOtherAll];
        } else if ([normalizedSubtypeString isEqualToString:@"other"]) {
            return [PLKAccountSubtypeOther createWithValue:PLKAccountSubtypeValueOtherOther];
        } else {
            return [PLKAccountSubtypeOther createWithRawStringValue:normalizedSubtypeString];
        }
    } else if ([normalizedTypeString isEqualToString:@"credit"]) {
        if ([normalizedSubtypeString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditAll];
        } else if ([normalizedSubtypeString isEqualToString:@"credit card"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditCreditCard];
        } else if ([normalizedSubtypeString isEqualToString:@"paypal"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditPaypal];
        } else {
            return [PLKAccountSubtypeCredit createWithUnknownValue:subtypeString];
        }
    } else if ([normalizedTypeString isEqualToString:@"loan"]) {
        if ([normalizedSubtypeString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanAll];
        } else if ([normalizedSubtypeString isEqualToString:@"auto"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanAuto];
        } else if ([normalizedSubtypeString isEqualToString:@"business"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanBusiness];
        } else if ([normalizedSubtypeString isEqualToString:@"commercial"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanCommercial];
        } else if ([normalizedSubtypeString isEqualToString:@"construction"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanConstruction];
        } else if ([normalizedSubtypeString isEqualToString:@"consumer"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanConsumer];
        } else if ([normalizedSubtypeString isEqualToString:@"home equity"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanHomeEquity];
        } else if ([normalizedSubtypeString isEqualToString:@"line of credit"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanLineOfCredit];
        } else if ([normalizedSubtypeString isEqualToString:@"loan"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanLoan];
        } else if ([normalizedSubtypeString isEqualToString:@"mortgage"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanMortgage];
        } else if ([normalizedSubtypeString isEqualToString:@"overdraft"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanOverdraft];
        } else if ([normalizedSubtypeString isEqualToString:@"student"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanStudent];
        } else {
            return [PLKAccountSubtypeLoan createWithUnknownValue:subtypeString];
        }
    } else if ([normalizedTypeString isEqualToString:@"depository"]) {
        if ([normalizedSubtypeString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryAll];
        } else if ([normalizedSubtypeString isEqualToString:@"cash management"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryCashManagement];
        } else if ([normalizedSubtypeString isEqualToString:@"cd"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryCd];
        } else if ([normalizedSubtypeString isEqualToString:@"checking"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryChecking];
        } else if ([normalizedSubtypeString isEqualToString:@"ebt"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryEbt];
        } else if ([normalizedSubtypeString isEqualToString:@"hsa"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryHsa];
        } else if ([normalizedSubtypeString isEqualToString:@"money market"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryMoneyMarket];
        } else if ([normalizedSubtypeString isEqualToString:@"paypal"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryPaypal];
        } else if ([normalizedSubtypeString isEqualToString:@"prepaid"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryPrepaid];
        } else if ([normalizedSubtypeString isEqualToString:@"savings"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositorySavings];
        } else {
            return [PLKAccountSubtypeDepository createWithUnknownValue:subtypeString];
        }

    } else if ([normalizedTypeString isEqualToString:@"investment"]) {
        if ([normalizedSubtypeString isEqualToString:@"all"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentAll];
        } else if ([normalizedSubtypeString isEqualToString:@"401a"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment401a];
        } else if ([normalizedSubtypeString isEqualToString:@"401k"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment401k];
        } else if ([normalizedSubtypeString isEqualToString:@"403B"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment403B];
        } else if ([normalizedSubtypeString isEqualToString:@"457b"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment457b];
        } else if ([normalizedSubtypeString isEqualToString:@"529"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment529];
        } else if ([normalizedSubtypeString isEqualToString:@"brokerage"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentBrokerage];
        } else if ([normalizedSubtypeString isEqualToString:@"cash isa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentCashIsa];
        } else if ([normalizedSubtypeString isEqualToString:@"education savings account"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentEducationSavingsAccount];
        } else if ([normalizedSubtypeString isEqualToString:@"fixed annuity"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentFixedAnnuity];
        } else if ([normalizedSubtypeString isEqualToString:@"gic"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentGic];
        } else if ([normalizedSubtypeString isEqualToString:@"health reimbursement arrangement"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentHealthReimbursementArrangement];
        } else if ([normalizedSubtypeString isEqualToString:@"hsa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentHsa];
        } else if ([normalizedSubtypeString isEqualToString:@"ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentIra];
        } else if ([normalizedSubtypeString isEqualToString:@"isa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentIsa];
        } else if ([normalizedSubtypeString isEqualToString:@"keogh"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentKeogh];
        } else if ([normalizedSubtypeString isEqualToString:@"lif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLif];
        } else if ([normalizedSubtypeString isEqualToString:@"lira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLira];
        } else if ([normalizedSubtypeString isEqualToString:@"lrif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLrif];
        } else if ([normalizedSubtypeString isEqualToString:@"lrsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLrsp];
        } else if ([normalizedSubtypeString isEqualToString:@"mutual fund"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentMutualFund];
        } else if ([normalizedSubtypeString isEqualToString:@"non-taxable brokerage account"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentNonTaxableBrokerageAccount];
        } else if ([normalizedSubtypeString isEqualToString:@"pension"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPension];
        } else if ([normalizedSubtypeString isEqualToString:@"plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPlan];
        } else if ([normalizedSubtypeString isEqualToString:@"prif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPrif];
        } else if ([normalizedSubtypeString isEqualToString:@"profit sharing plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentProfitSharingPlan];
        } else if ([normalizedSubtypeString isEqualToString:@"rdsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRdsp];
        } else if ([normalizedSubtypeString isEqualToString:@"resp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentResp];
        } else if ([normalizedSubtypeString isEqualToString:@"retirement"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRetirement];
        } else if ([normalizedSubtypeString isEqualToString:@"rlif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRlif];
        } else if ([normalizedSubtypeString isEqualToString:@"roth 401k"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRoth401k];
        } else if ([normalizedSubtypeString isEqualToString:@"roth"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRoth];
        } else if ([normalizedSubtypeString isEqualToString:@"rrif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRrif];
        } else if ([normalizedSubtypeString isEqualToString:@"rrsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRrsp];
        } else if ([normalizedSubtypeString isEqualToString:@"sarsep"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSarsep];
        } else if ([normalizedSubtypeString isEqualToString:@"sep ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSepIra];
        } else if ([normalizedSubtypeString isEqualToString:@"simple ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSimpleIra];
        } else if ([normalizedSubtypeString isEqualToString:@"sipp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSipp];
        } else if ([normalizedSubtypeString isEqualToString:@"stock plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentStockPlan];
        } else if ([normalizedSubtypeString isEqualToString:@"tfsa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentTfsa];
        } else if ([normalizedSubtypeString isEqualToString:@"thrift savings plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentThriftSavingsPlan];
        } else if ([normalizedSubtypeString isEqualToString:@"trust"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentTrust];
        } else if ([normalizedSubtypeString isEqualToString:@"ugma"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentUgma];
        } else if ([normalizedSubtypeString isEqualToString:@"utma"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentUtma];
        } else if ([normalizedSubtypeString isEqualToString:@"variable annuity"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentVariableAnnuity];
        } else {
          return [PLKAccountSubtypeInvestment createWithUnknownValue:subtypeString];
        }
    }

    return [PLKAccountSubtypeUnknown createWithRawTypeStringValue:typeString rawSubtypeStringValue:subtypeString];
}

+ (NSDictionary *)dictionaryFromSuccess:(PLKLinkSuccess *)success {
    PLKSuccessMetadata *metadata = success.metadata;

    return @{
        @"publicToken": success.publicToken ?: @"",
        @"metadata": @{
          @"linkSessionId": metadata.linkSessionID ?: @"",
          @"institution": [self dictionaryFromInstitution:metadata.institution] ?: @"",
          @"accounts": [self accountsDictionariesFromAccounts:metadata.accounts] ?: @"",
          @"metadataJson": metadata.metadataJSON ?: @"",
      },
    };
}

+ (NSArray<NSDictionary *> *)accountsDictionariesFromAccounts:(NSArray<PLKAccount *> *)accounts {
    NSMutableArray<NSDictionary *> *results = [NSMutableArray arrayWithCapacity:accounts.count];

    for (PLKAccount *account in accounts) {
        NSDictionary *accountDictionary = [self dictionaryFromAccount:account];
        [results addObject:accountDictionary];
    }
    return [results copy];
}

+ (NSDictionary *)dictionaryFromAccount:(PLKAccount *)account {
    return @{
        @"id": account.ID ?: @"",
        @"name": account.name ?: @"",
        @"mask": account.mask ?: @"",
        @"subtype": [self subtypeNameForAccountSubtype:account.subtype] ?: @"",
        @"type": [self typeNameForAccountSubtype:account.subtype] ?: @"",
        @"verificationStatus": [self stringForVerificationStatus:account.verificationStatus] ?: @"",
    };
}

+ (NSString *)stringForVerificationStatus:(PLKVerificationStatus *)verificationStatus {
    if (!verificationStatus) {
        return @"";
    }

    if (verificationStatus.unknownStringValue) {
        return verificationStatus.unknownStringValue;
    }

    switch (verificationStatus.value) {
        case PLKVerificationStatusValueNone:
            return @"";
        case PLKVerificationStatusValuePendingAutomaticVerification:
            return @"pending_automatic_verification";
        case PLKVerificationStatusValuePendingManualVerification:
            return @"pending_manual_verification";
        case PLKVerificationStatusValueManuallyVerified:
            return @"manually_verified";
    }

    return @"unknown";
}

+ (NSString *)typeNameForAccountSubtype:(id<PLKAccountSubtype>)accountSubtype {
    if ([accountSubtype isKindOfClass:[PLKAccountSubtypeUnknown class]]) {
        return ((PLKAccountSubtypeUnknown *)accountSubtype).rawStringValue;
    } else if ([accountSubtype isKindOfClass:[PLKAccountSubtypeOther class]]) {
        return @"other";
    } else if ([accountSubtype isKindOfClass:[PLKAccountSubtypeCredit class]]) {
        return @"credit";
    }  else if ([accountSubtype isKindOfClass:[PLKAccountSubtypeLoan class]]) {
        return @"loan";
    }  else if ([accountSubtype isKindOfClass:[PLKAccountSubtypeDepository class]]) {
        return @"depository";
    }  else if ([accountSubtype isKindOfClass:[PLKAccountSubtypeInvestment class]]) {
        return @"investment";
    }
    return @"unknown";
}

+ (NSString *)subtypeNameForAccountSubtype:(id<PLKAccountSubtype>)accountSubtype {
    if ([accountSubtype isKindOfClass:[PLKAccountSubtypeUnknown class]]) {
        return ((PLKAccountSubtypeUnknown *)accountSubtype).rawSubtypeStringValue;
    }
    return accountSubtype.rawStringValue;
}

+ (NSDictionary *)dictionaryFromInstitution:(PLKInstitution *)institution {
    return @{
        @"name": institution.name ?: @"",
        @"id": institution.ID ?: @"",
    };
}

+ (NSDictionary *)dictionaryFromError:(PLKExitError *)error {
    return @{
        @"errorType": [self errorTypeStringFromError:error] ?: @"",
        @"errorCode": [self errorCodeStringFromError:error] ?: @"",
        @"errorMessage": [self errorMessageFromError:error] ?: @"",
        // errorDisplayMessage is the deprecated name for displayMessage, both have to be populated
        // until errorDisplayMessage is fully removed to avoid breaking the API
        @"errorDisplayMessage": [self errorDisplayMessageFromError:error] ?: @"",
        @"displayMessage": [self errorDisplayMessageFromError:error] ?: @"",
    };
}

+ (NSDictionary *)dictionaryFromEvent:(PLKLinkEvent *)event {
    PLKEventMetadata *metadata = event.eventMetadata;

    return @{
        @"eventName": [self stringForEventName:event.eventName] ?: @"",
        @"metadata": @{
            @"errorType": [self errorTypeStringFromError:metadata.error] ?: @"",
            @"errorCode": [self errorCodeStringFromError:metadata.error] ?: @"",
            @"errorMessage": [self errorMessageFromError:metadata.error] ?: @"",
            @"exitStatus": [self stringForExitStatus:metadata.exitStatus] ?: @"",
            @"institutionId": metadata.institutionID ?: @"",
            @"institutionName": metadata.institutionName ?: @"",
            @"institutionSearchQuery": metadata.institutionSearchQuery ?: @"",
            @"linkSessionId": metadata.linkSessionID ?: @"",
            @"mfaType": [self stringForMfaType:metadata.mfaType] ?: @"",
            @"requestId": metadata.requestID ?: @"",
            @"timestamp": [self iso8601StringFromDate:metadata.timestamp] ?: @"",
            @"viewName": [self stringForViewName:metadata.viewName] ?: @"",
            @"metadataJson": metadata.metadataJSON ?: @"",
        },
    };
}

+ (NSString *)errorDisplayMessageFromError:(PLKExitError *)error {
    return error.userInfo[kPLKExitErrorDisplayMessageKey] ?: @"";
}

+ (NSString *)errorTypeStringFromError:(PLKExitError *)error {
    NSString *errorDomain = error.domain;
    if (!error || !errorDomain) {
        return @"";
    }

    NSString *normalizedErrorDomain = errorDomain;

    return @{
        kPLKExitErrorInvalidRequestDomain: @"INVALID_REQUEST",
        kPLKExitErrorInvalidInputDomain: @"INVALID_INPUT",
        kPLKExitErrorInstitutionErrorDomain: @"INSTITUTION_ERROR",
        kPLKExitErrorRateLimitExceededDomain: @"RATE_LIMIT_EXCEEDED",
        kPLKExitErrorApiDomain: @"API_ERROR",
        kPLKExitErrorItemDomain: @"ITEM_ERROR",
        kPLKExitErrorAuthDomain: @"AUTH_ERROR",
        kPLKExitErrorAssetReportDomain: @"ASSET_REPORT_ERROR",
        kPLKExitErrorInternalDomain: @"INTERNAL",
        kPLKExitErrorUnknownDomain: error.userInfo[kPLKExitErrorUnknownTypeKey] ?: @"UNKNOWN",
    }[normalizedErrorDomain] ?: @"UNKNOWN";
}

+ (NSString *)errorCodeStringFromError:(PLKExitError *)error {
   NSString *errorDomain = error.domain;

    if (!error || !errorDomain) {
        return @"";
    }
    return error.userInfo[kPLKExitErrorCodeKey];
}

+ (NSString *)errorMessageFromError:(PLKExitError *)error {
    return error.userInfo[kPLKExitErrorMessageKey] ?: @"";
}

+ (NSString *)stringForEventName:(PLKEventName *)eventName {
    if (!eventName) {
        return @"";
    }

    if (eventName.unknownStringValue) {
        return eventName.unknownStringValue;
    }

    switch (eventName.value) {
        case PLKEventNameValueNone:
            return @"";
        case PLKEventNameValueBankIncomeInsightsCompleted:
            return @"BANK_INCOME_INSIGHTS_COMPLETED";
        case PLKEventNameValueCloseOAuth:
            return @"CLOSE_OAUTH";
        case PLKEventNameValueError:
            return @"ERROR";
        case PLKEventNameValueExit:
            return @"EXIT";
        case PLKEventNameValueFailOAuth:
            return @"FAIL_OAUTH";
        case PLKEventNameValueHandoff:
            return @"HANDOFF";
        case PLKEventNameValueMatchedSelectInstitution:
            return @"MATCHED_SELECT_INSTITUTION";
        case PLKEventNameValueMatchedSelectVerifyMethod:
            return @"MATCHED_SELECT_VERIFY_METHOD";
        case PLKEventNameValueOpen:
            return @"OPEN";
        case PLKEventNameValueOpenMyPlaid:
            return @"OPEN_MY_PLAID";
        case PLKEventNameValueOpenOAuth:
            return @"OPEN_OAUTH";
        case PLKEventNameValueSearchInstitution:
            return @"SEARCH_INSTITUTION";
        case PLKEventNameValueSelectInstitution:
            return @"SELECT_INSTITUTION";
        case PLKEventNameValueSubmitCredentials:
            return @"SUBMIT_CREDENTIALS";
        case PLKEventNameValueSubmitMFA:
            return @"SUBMIT_MFA";
        case PLKEventNameValueTransitionView:
            return @"TRANSITION_VIEW";
        case PLKEventNameValueSelectDegradedInstitution:
            return @"SELECT_DEGRADED_INSTITUTION";
        case PLKEventNameValueSelectDownInstitution:
            return @"SELECT_DOWN_INSTITUTION";
     }
     return @"unknown";
}

+ (NSString *)iso8601StringFromDate:(NSDate *)date {
    static NSISO8601DateFormatter *dateFormatter = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        dateFormatter = [[NSISO8601DateFormatter alloc] init];
        dateFormatter.formatOptions |= NSISO8601DateFormatWithFractionalSeconds;
    });
    return [dateFormatter stringFromDate:date];
}

+ (NSString *)stringForExitStatus:(PLKExitStatus *)exitStatus {
    if (!exitStatus) {
        return @"";
    }

    if (exitStatus.unknownStringValue) {
        return exitStatus.unknownStringValue;
    }

    switch (exitStatus.value) {
        case PLKExitStatusValueNone:
            return @"";
        case PLKExitStatusValueRequiresQuestions:
            return @"requires_questions";
        case PLKExitStatusValueRequiresSelections:
            return @"requires_selections";
        case PLKExitStatusValueRequiresCode:
            return @"requires_code";
        case PLKExitStatusValueChooseDevice:
            return @"choose_device";
        case PLKExitStatusValueRequiresCredentials:
            return @"requires_credentials";
        case PLKExitStatusValueInstitutionNotFound:
            return @"institution_not_found";
        case PLKExitStatusValueRequiresAccountSelection:
            return @"requires_account_selection";
    }
    return @"unknown";
}

+ (NSString *)stringForMfaType:(PLKMFAType)mfaType {
    switch (mfaType) {
        case PLKMFATypeNone:
            return @"";
        case PLKMFATypeCode:
            return @"code";
        case PLKMFATypeDevice:
            return @"device";
        case PLKMFATypeQuestions:
            return @"questions";
        case PLKMFATypeSelections:
            return @"selections";
    }

    return @"unknown";
}

+ (NSString *)stringForViewName:(PLKViewName *)viewName {
    if (!viewName) {
        return @"";
    }

    if (viewName.unknownStringValue) {
        return viewName.unknownStringValue;
    }

    switch (viewName.value) {
        case PLKViewNameValueNone:
            return @"";
        case PLKViewNameValueConnected:
            return @"CONNECTED";
        case PLKViewNameValueConsent:
            return @"CONSENT";
        case PLKViewNameValueCredential:
            return @"CREDENTIAL";
        case PLKViewNameValueError:
            return @"ERROR";
        case PLKViewNameValueExit:
            return @"EXIT";
        case PLKViewNameValueLoading:
            return @"LOADING";
        case PLKViewNameValueMatchedConsent:
            return @"MATCHED_CONSENT";
        case PLKViewNameValueMatchedCredential:
            return @"MATCHED_CREDENTIAL";
        case PLKViewNameValueMatchedMFA:
            return @"MATCHED_MFA";
        case PLKViewNameValueMFA:
            return @"MFA";
        case PLKViewNameValueNumbers:
            return @"NUMBERS";
        case PLKViewNameValueRecaptcha:
            return @"RECAPTCHA";
        case PLKViewNameValueSelectAccount:
            return @"SELECT_ACCOUNT";
        case PLKViewNameValueSelectInstitution:
            return @"SELECT_INSTITUTION";
    }

    return @"unknown";
}

+ (NSDictionary *)dictionaryFromExit:(PLKLinkExit *)exit {
    PLKExitMetadata *metadata = exit.metadata;
    return @{
        @"error": [self dictionaryFromError:exit.error] ?: @{},
        @"metadata": @{
          @"status": [self stringForExitStatus:metadata.status] ?: @"",
          @"institution": [self dictionaryFromInstitution:metadata.institution] ?: @"",
          @"requestId": metadata.requestID ?: @"",
          @"linkSessionId": metadata.linkSessionID ?: @"",
          @"metadataJson": metadata.metadataJSON ?: @"",
        },
    };
}

@end
