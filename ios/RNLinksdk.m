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
      linkConfiguration.accountSubtypes = [RNLinksdk accountSubtypesArrayFromAccountSubtypesDictionary:accountSubtypes];
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
    };
    return productStringMap[productString.lowercaseString];
}

+ (NSArray<id<PLKAccountSubtype>> *)accountSubtypesArrayFromAccountSubtypesDictionary:(NSDictionary<NSString *, NSArray<NSString *> *> *)accountSubtypesDictionary {
    __block NSMutableArray<id<PLKAccountSubtype>> *results = [NSMutableArray array];
    
    for (NSString *type in accountSubtypesDictionary.allKeys) {
        NSArray<NSString *> *subtypes = accountSubtypesDictionary[type] ?: @[];
        
        for (NSString *subtype in subtypes) {
            id<PLKAccountSubtype> accountSubtype = [self accountSubtypeFromTypeString:type subtypeString:subtype];
            if (accountSubtype) {
                [results addObject:accountSubtype];
            }
        }
    }
    
    return [results copy];
}

+ (id<PLKAccountSubtype> __nullable)accountSubtypeFromTypeString:(NSString *)typeString
                                                   subtypeString:(NSString *)subtypeString {
    if ([typeString.lowercaseString isEqualToString:@"other"]) {
        
    } else if ([typeString.lowercaseString isEqualToString:@"credit"]) {
        if ([subtypeString.lowercaseString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditAll];
        } else if ([subtypeString.lowercaseString isEqualToString:@"credit card"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditAll];
        } else if ([subtypeString.lowercaseString isEqualToString:@"paypal"]) {
            return [PLKAccountSubtypeCredit createWithValue:PLKAccountSubtypeValueCreditPaypal];
        } else {
            return [PLKAccountSubtypeCredit createWithUnknownValue:subtypeString];
        }
    } else if ([typeString.lowercaseString isEqualToString:@"loan"]) {
        if ([subtypeString.lowercaseString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanAll];
        } else if ([subtypeString.lowercaseString isEqualToString:@"auto"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanAuto];
        } else if ([subtypeString.lowercaseString isEqualToString:@"business"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanBusiness];
        } else if ([subtypeString.lowercaseString isEqualToString:@"commercial"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanCommercial];
        } else if ([subtypeString.lowercaseString isEqualToString:@"construction"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanConstruction];
        } else if ([subtypeString.lowercaseString isEqualToString:@"consumer"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanConsumer];
        } else if ([subtypeString.lowercaseString isEqualToString:@"home equity"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanHomeEquity];
        } else if ([subtypeString.lowercaseString isEqualToString:@"line of credit"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanLineOfCredit];
        } else if ([subtypeString.lowercaseString isEqualToString:@"loan"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanLoan];
        } else if ([subtypeString.lowercaseString isEqualToString:@"mortgage"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanMortgage];
        } else if ([subtypeString.lowercaseString isEqualToString:@"overdraft"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanOverdraft];
        } else if ([subtypeString.lowercaseString isEqualToString:@"student"]) {
            return [PLKAccountSubtypeLoan createWithValue:PLKAccountSubtypeValueLoanStudent];
        } else {
            return [PLKAccountSubtypeLoan createWithUnknownValue:subtypeString];
        }
    } else if ([typeString.lowercaseString isEqualToString:@"depository"]) {
        if ([subtypeString.lowercaseString isEqualToString:@"all"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryAll];
        } else if ([subtypeString.lowercaseString isEqualToString:@"cash management"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryCashManagement];
        } else if ([subtypeString.lowercaseString isEqualToString:@"cd"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryCd];
        } else if ([subtypeString.lowercaseString isEqualToString:@"checking"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryChecking];
        } else if ([subtypeString.lowercaseString isEqualToString:@"ebt"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryEbt];
        } else if ([subtypeString.lowercaseString isEqualToString:@"hsa"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryHsa];
        } else if ([subtypeString.lowercaseString isEqualToString:@"money market"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryMoneyMarket];
        } else if ([subtypeString.lowercaseString isEqualToString:@"paypal"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryPaypal];
        } else if ([subtypeString.lowercaseString isEqualToString:@"prepaid"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositoryPrepaid];
        } else if ([subtypeString.lowercaseString isEqualToString:@"savings"]) {
            return [PLKAccountSubtypeDepository createWithValue:PLKAccountSubtypeValueDepositorySavings];
        } else {
            return [PLKAccountSubtypeDepository createWithUnknownValue:subtypeString];
        }

    } else if ([typeString.lowercaseString isEqualToString:@"investment"]) {
        if ([subtypeString.lowercaseString isEqualToString:@"all"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentAll];
        } else if ([subtypeString.lowercaseString isEqualToString:@"401a"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment401a];
        } else if ([subtypeString.lowercaseString isEqualToString:@"401k"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment401k];
        } else if ([subtypeString.lowercaseString isEqualToString:@"403B"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment403B];
        } else if ([subtypeString.lowercaseString isEqualToString:@"457b"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment457b];
        } else if ([subtypeString.lowercaseString isEqualToString:@"529"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestment529];
        } else if ([subtypeString.lowercaseString isEqualToString:@"brokerage"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentBrokerage];
        } else if ([subtypeString.lowercaseString isEqualToString:@"cash isa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentCashIsa];
        } else if ([subtypeString.lowercaseString isEqualToString:@"education savings account"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentEducationSavingsAccount];
        } else if ([subtypeString.lowercaseString isEqualToString:@"fixed annuity"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentFixedAnnuity];
        } else if ([subtypeString.lowercaseString isEqualToString:@"gic"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentGic];
        } else if ([subtypeString.lowercaseString isEqualToString:@"health reimbursement arrangement"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentHealthReimbursementArrangement];
        } else if ([subtypeString.lowercaseString isEqualToString:@"hsa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentHsa];
        } else if ([subtypeString.lowercaseString isEqualToString:@"ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentIra];
        } else if ([subtypeString.lowercaseString isEqualToString:@"isa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentIsa];
        } else if ([subtypeString.lowercaseString isEqualToString:@"keogh"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentKeogh];
        } else if ([subtypeString.lowercaseString isEqualToString:@"lif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLif];
        } else if ([subtypeString.lowercaseString isEqualToString:@"lira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLira];
        } else if ([subtypeString.lowercaseString isEqualToString:@"lrif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLrif];
        } else if ([subtypeString.lowercaseString isEqualToString:@"lrsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentLrsp];
        } else if ([subtypeString.lowercaseString isEqualToString:@"mutual fund"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentMutualFund];
        } else if ([subtypeString.lowercaseString isEqualToString:@"non-taxable brokerage account"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentNonTaxableBrokerageAccount];
        } else if ([subtypeString.lowercaseString isEqualToString:@"pension"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPension];
        } else if ([subtypeString.lowercaseString isEqualToString:@"plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPlan];
        } else if ([subtypeString.lowercaseString isEqualToString:@"prif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentPrif];
        } else if ([subtypeString.lowercaseString isEqualToString:@"profit sharing plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentProfitSharingPlan];
        } else if ([subtypeString.lowercaseString isEqualToString:@"rdsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRdsp];
        } else if ([subtypeString.lowercaseString isEqualToString:@"resp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentResp];
        } else if ([subtypeString.lowercaseString isEqualToString:@"retirement"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRetirement];
        } else if ([subtypeString.lowercaseString isEqualToString:@"rlif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRlif];
        } else if ([subtypeString.lowercaseString isEqualToString:@"roth 401k"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRoth401k];
        } else if ([subtypeString.lowercaseString isEqualToString:@"roth"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRoth];
        } else if ([subtypeString.lowercaseString isEqualToString:@"rrif"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRrif];
        } else if ([subtypeString.lowercaseString isEqualToString:@"rrsp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentRrsp];
        } else if ([subtypeString.lowercaseString isEqualToString:@"sarsep"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSarsep];
        } else if ([subtypeString.lowercaseString isEqualToString:@"sep ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSepIra];
        } else if ([subtypeString.lowercaseString isEqualToString:@"simple ira"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSimpleIra];
        } else if ([subtypeString.lowercaseString isEqualToString:@"sipp"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentSipp];
        } else if ([subtypeString.lowercaseString isEqualToString:@"stock plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentStockPlan];
        } else if ([subtypeString.lowercaseString isEqualToString:@"tfsa"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentTfsa];
        } else if ([subtypeString.lowercaseString isEqualToString:@"thrift savings plan"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentThriftSavingsPlan];
        } else if ([subtypeString.lowercaseString isEqualToString:@"trust"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentTrust];
        } else if ([subtypeString.lowercaseString isEqualToString:@"ugma"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentUgma];
        } else if ([subtypeString.lowercaseString isEqualToString:@"utma"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentUtma];
        } else if ([subtypeString.lowercaseString isEqualToString:@"variable annuity"]) {
          return [PLKAccountSubtypeInvestment createWithValue:PLKAccountSubtypeValueInvestmentVariableAnnuity];
        } else {
          return [PLKAccountSubtypeInvestment createWithUnknownValue:subtypeString];
        }
    }

    return [PLKAccountSubtypeUnknown createWithRawTypeStringValue:typeString rawSubtypeStringValue:subtypeString];
}

+ (NSDictionary *)dictionaryFromSuccessMetadata:(PLKSuccessMetadata *)metadata {
    return @{
        @"linkSessionID": metadata.linkSessionID,
        @"institution": [self dictionaryFromInstitution:metadata.insitution],
        @"accounts": metadata.accounts,
        @"metadata_json": metadata.metadataJSON ?: @"<null>",
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
        @"id": account.ID,
        @"name": account.name,
        @"mask": account.mask ?: @"<null>",
        @"subtype": [self subtypeNameForAccountSubtype:account.subtype],
        @"type": [self typeNameForAccountSubtype:account.subtype],
        @"verification_status": [self stringForVerificationStatus:account.verificationStatus],
    };
}

+ (NSString *)stringForVerificationStatus:(PLKVerificationStatus *)verificationStatus {
    if (!verificationStatus) {
        return @"<null>";
    }
    
    if (verificationStatus.unknownStringValue) {
        return verificationStatus.unknownStringValue;
    }
    
    switch (verificationStatus.value) {
        case PLKVerificationStatusValueNone:
            return @"<null>";
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
        @"name": institution.name,
        @"id": institution.ID,
    };
}

+ (NSDictionary *)dictionaryFromEventMetadata:(PLKEventMetadata *)metadata {
    return @{
        @"error": metadata.error ?: @"<null>",
        @"exit_status": [self stringForExitStatus:metadata.exitStatus],
        @"institution_id": metadata.institutionID ?: @"",
        @"institution_name": metadata.institutionName ?: @"",
        @"instituion_search_query": metadata.institutionSearchQuery ?: @"",
        @"link_session_id": metadata.linkSessionID,
        @"mfa_type": [self stringForMfaType:metadata.mfaType],
        @"request_id": metadata.requestID ?: @"<null>",
        @"timestamp": metadata.timestamp,
        @"view_name": [self stringForViewName:metadata.viewName],
        @"metadata_json": metadata.metadataJSON ?: @"<null>",
    };
}

+ (NSString *)stringForExitStatus:(PLKExitStatus)exitStatus {
    switch (exitStatus) {
        case PLKExitStatusNone:
            return @"<null>";
        case PLKExitStatusRequiresQuestions:
            return @"requires_questions";
        case PLKExitStatusRequiresSelections:
            return @"requires_selections";
        case PLKExitStatusRequiresCode:
            return @"requires_code";
        case PLKExitStatusChooseDevice:
            return @"choose_device";
        case PLKExitStatusRequiresCredentials:
            return @"requires_credentials";
        case PLKExitStatusInstitutionNotFound:
            return @"institution_not_found";
        case PLKExitStatusUnknown:
            return @"unknown";
    }
    return @"unknown";
}

+ (NSString *)stringForMfaType:(PLKMFAType)mfaType {
    switch (mfaType) {
        case PLKMFATypeNone:
            return @"<null>";
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
        return @"<null>";
    }
    
    if (viewName.unknownStringValue) {
        return viewName.unknownStringValue;
    }
    
    switch (viewName.value) {
        case PLKViewNameValueNone:
            return @"<null>";
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

+ (NSDictionary *)dictionaryFromExitMetadata:(PLKExitMetadata *)metadata {
    return @{
        @"status": [self stringForExitStatus:metadata.status],
        @"institution": [self dictionaryFromInstitution:metadata.institution] ?: @"<null>",
        @"request_id": metadata.requestID,
        @"link_session_id": metadata.linkSessionID,
        @"metadata_json": metadata.metadataJSON,
    };
}

@end
