#import "RNLinksdk.h"
#import "RNPlaidHelper.h"

#import <Foundation/Foundation.h>
#import <LinkKit/LinkKit.h>
#import <React/RCTConvert.h>
#import <React/RCTUtils.h>

static NSString* const kRNLinkKitOnEventEvent = @"onEvent";
static NSString* const kRNLinkKitEventErrorKey = @"error";
static NSString* const kRNLinkKitEventNameKey = @"event";
static NSString* const kRNLinkKitEventMetadataKey = @"metadata";
static NSString* const kRNLinkKitVersionConstant = @"version";

@interface RNLinksdk ()
@property (nonatomic, strong) id<PLKHandler> linkHandler;
@property (nonatomic, strong) UIViewController* presentingViewController;
@property (nonatomic, strong) RCTResponseSenderBlock successCallback;
@property (nonatomic, strong) RCTResponseSenderBlock exitCallback;
@property (nonatomic, assign) BOOL hasObservers;
@property (nonatomic, copy) NSString *institutionID;
@property (nonatomic, nullable, strong) NSError *creationError;
@end


@implementation RNLinksdk

RCT_EXPORT_MODULE();

+ (NSString*)sdkVersion {
    return @"12.0.3"; // SDK_VERSION
}

+ (NSString*)objCBridgeVersion {
    return @"2.0.0";
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

RCT_EXPORT_METHOD(create:(NSString*)token noLoadingState:(BOOL)noLoadingState) {
    __weak RNLinksdk *weakSelf = self;

    void (^onSuccess)(PLKLinkSuccess *) = ^(PLKLinkSuccess *success) {
        RNLinksdk *strongSelf = weakSelf;

        if (strongSelf.successCallback) {
            NSDictionary<NSString*, id> *jsMetadata = [RNLinksdk dictionaryFromSuccess:success];
            strongSelf.successCallback(@[jsMetadata]);
            strongSelf.successCallback = nil;
        }
    };

    void (^onExit)(PLKLinkExit *) = ^(PLKLinkExit *exit) {
        RNLinksdk *strongSelf = weakSelf;

        if (strongSelf.exitCallback) {
            NSDictionary *exitMetadata = [RNLinksdk dictionaryFromExit:exit];
            if (exit.error) {
                strongSelf.exitCallback(@[exitMetadata[@"error"], exitMetadata]);
            } else {
                strongSelf.exitCallback(@[[NSNull null], exitMetadata]);
            }
            strongSelf.exitCallback = nil;
            strongSelf.linkHandler = nil;
        }
    };

    void (^onEvent)(PLKLinkEvent *) = ^(PLKLinkEvent *event) {
        RNLinksdk *strongSelf = weakSelf;
        if (strongSelf.hasObservers) {
            NSDictionary *eventDictionary = [RNLinksdk dictionaryFromEvent:event];
            [strongSelf sendEventWithName:kRNLinkKitOnEventEvent
                                     body:eventDictionary];

            // If this is the HANDOFF event.
            if (event.eventName.value == PLKEventNameValueHandoff) {
                // If we have dismissed Link.
                if (strongSelf.presentingViewController == nil) {
                    // Deallocate the handler it's no longer needed.
                    strongSelf.linkHandler = nil;
                }
            }
        }
    };

    PLKLinkTokenConfiguration *config = [PLKLinkTokenConfiguration createWithToken:token onSuccess:onSuccess];
    config.onEvent = onEvent;
    config.onExit = onExit;
    config.noLoadingState = noLoadingState;

    NSError *creationError = nil;
    self.linkHandler = [RNPlaidHelper createWithLinkTokenConfiguration:config error:&creationError];
    self.creationError = creationError;
}

RCT_EXPORT_METHOD(open:(BOOL)fullScreen onSuccess:(RCTResponseSenderBlock)onSuccess onExit:(RCTResponseSenderBlock)onExit) {
    if (self.linkHandler) {
        self.successCallback = onSuccess;
        self.exitCallback = onExit;
        self.presentingViewController = RCTPresentedViewController();

        // Some link flows do not need to present UI, so track if presentation happened so dismissal isn't
        // unnecessarily invoked.
        __block bool didPresent = NO;

        __weak RNLinksdk *weakSelf = self;
        void(^presentationHandler)(UIViewController *) = ^(UIViewController *linkViewController) {

            if (fullScreen) {
                [linkViewController setModalPresentationStyle:UIModalPresentationOverFullScreen];
                [linkViewController setModalTransitionStyle:UIModalTransitionStyleCoverVertical];
            }

            [weakSelf.presentingViewController presentViewController:linkViewController animated:YES completion:nil];
            didPresent = YES;
        };
        void(^dismissalHandler)(UIViewController *) = ^(UIViewController *linkViewController) {
            if (didPresent) {
                [weakSelf dismiss];
                didPresent = NO;
            }
        };
        [self.linkHandler openWithPresentationHandler:presentationHandler dismissalHandler:dismissalHandler];
    } else {
        NSString *errorMessage = self.creationError ? self.creationError.userInfo[@"message"] : @"Create was not called.";
        NSString *errorCode = self.creationError ? [@(self.creationError.code) stringValue] : @"-1";

        NSDictionary *linkExit = @{
            @"displayMessage": errorMessage,
            @"errorCode": errorCode,
            @"errorType": @"creation error",
            @"errorMessage": errorMessage,
            @"errorDisplayMessage": errorMessage,
            @"errorJson": [NSNull null],
            @"metadata": @{
                @"linkSessionId": [NSNull null],
                @"institution": [NSNull null],
                @"status": [NSNull null],
                @"requestId": [NSNull null],
                @"metadataJson": [NSNull null],
            },
        };

        onExit(@[linkExit]);
    }
}

RCT_EXPORT_METHOD(dismiss) {
    [self.presentingViewController dismissViewControllerAnimated:YES
                                                      completion:nil];
    self.presentingViewController = nil;
}

RCT_EXPORT_METHOD(syncFinanceKit:(NSString *)token
                  requestAuthorizationIfNeeded:(BOOL)requestAuthorizationIfNeeded
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError) {

    [RNPlaidHelper syncFinanceKit:token
         requestAuthorizationIfNeeded:requestAuthorizationIfNeeded
         onSuccess:^{
            onSuccess(@[]);
        }
        onError:^(NSError *error) {
            
            NSDictionary *financeKitError = @{
                @"type": [NSNumber numberWithInteger: error.code],
                @"message": error.localizedDescription
            };
            
            onError(@[financeKitError]);
        }
    ];
}
                  

RCT_EXPORT_METHOD(submit:(NSString * _Nullable)phoneNumber) {
    if (self.linkHandler) {
        PLKSubmissionData *submissionData = [[PLKSubmissionData alloc] init];
        submissionData.phoneNumber = phoneNumber;
        [self.linkHandler submit: submissionData];
    }
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
            @"accountNumberMask": metadata.accountNumberMask ?: @"",
            @"isUpdateMode": metadata.isUpdateMode ?: @"",
            @"matchReason": metadata.matchReason ?: @"",
            @"routingNumber": metadata.routingNumber ?: @"",
            @"selection": metadata.selection ?: @"",
            @"linkSessionId": metadata.linkSessionID ?: @"",
            @"mfaType": [self stringForMfaType:metadata.mfaType] ?: @"",
            @"requestId": metadata.requestID ?: @"",
            @"timestamp": [self iso8601StringFromDate:metadata.timestamp] ?: @"",
            @"viewName": [self stringForViewName:metadata.viewName] ?: @"",
            @"metadata_json": metadata.metadataJSON ?: @"",
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
        case PLKEventNameValueIdentityVerificationStartStep:
            return @"IDENTITY_VERIFICATION_START_STEP";
        case PLKEventNameValueIdentityVerificationPassStep:
            return @"IDENTITY_VERIFICATION_PASS_STEP";
        case PLKEventNameValueIdentityVerificationFailStep:
            return @"IDENTITY_VERIFICATION_FAIL_STEP";
        case PLKEventNameValueIdentityVerificationPendingReviewStep:
            return @"IDENTITY_VERIFICATION_PENDING_REVIEW_STEP";
        case PLKEventNameValueIdentityVerificationCreateSession:
            return @"IDENTITY_VERIFICATION_CREATE_SESSION";
        case PLKEventNameValueIdentityVerificationResumeSession:
            return @"IDENTITY_VERIFICATION_RESUME_SESSION";
        case PLKEventNameValueIdentityVerificationPassSession:
            return @"IDENTITY_VERIFICATION_PASS_SESSION";
        case PLKEventNameValueIdentityVerificationFailSession:
            return @"IDENTITY_VERIFICATION_FAIL_SESSION";
        case PLKEventNameValueIdentityVerificationOpenUI:
            return @"IDENTITY_VERIFICATION_OPEN_UI";
        case PLKEventNameValueIdentityVerificationResumeUI:
            return @"IDENTITY_VERIFICATION_RESUME_UI";
        case PLKEventNameValueIdentityVerificationCloseUI:
            return @"IDENTITY_VERIFICATION_CLOSE_UI";
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
        case PLKEventNameValueProfileEligibilityCheckReady:
            return @"PROFILE_ELIGIBILITY_CHECK_READY";
        case PLKEventNameValueProfileEligibilityCheckError:
            return @"PROFILE_ELIGIBILITY_CHECK_ERROR";
        case PLKEventNameValueSearchInstitution:
            return @"SEARCH_INSTITUTION";
        case PLKEventNameValueSelectDegradedInstitution:
            return @"SELECT_DEGRADED_INSTITUTION";
        case PLKEventNameValueSelectDownInstitution:
            return @"SELECT_DOWN_INSTITUTION";
        case PLKEventNameValueSelectInstitution:
            return @"SELECT_INSTITUTION";
        case PLKEventNameValueSubmitCredentials:
            return @"SUBMIT_CREDENTIALS";
        case PLKEventNameValueSubmitMFA:
            return @"SUBMIT_MFA";
        case PLKEventNameValueTransitionView:
            return @"TRANSITION_VIEW";
        case PLKEventNameValueIdentityVerificationPendingReviewSession:
            return @"IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION";
        case PLKEventNameValueSelectFilteredInstitution:
            return @"SELECT_FILTERED_INSTITUTION";
        case PLKEventNameValueSelectBrand:
            return @"SELECT_BRAND";
        case PLKEventNameValueSelectAuthType:
            return @"SELECT_AUTH_TYPE";
        case PLKEventNameValueSubmitAccountNumber:
            return @"SUBMIT_ACCOUNT_NUMBER";
        case PLKEventNameValueSubmitDocuments:
            return @"SUBMIT_DOCUMENTS";
        case PLKEventNameValueSubmitDocumentsSuccess:
            return @"SUBMIT_DOCUMENTS_SUCCESS";
        case PLKEventNameValueSubmitDocumentsError:
            return @"SUBMIT_DOCUMENTS_ERROR";
        case PLKEventNameValueSubmitRoutingNumber:
            return @"SUBMIT_ROUTING_NUMBER";
        case PLKEventNameValueViewDataTypes:
            return @"VIEW_DATA_TYPES";
        case PLKEventNameValueSubmitPhone:
            return @"SUBMIT_PHONE";
        case PLKEventNameValueSkipSubmitPhone:
            return @"SKIP_SUBMIT_PHONE";
        case PLKEventNameValueVerifyPhone:
            return @"VERIFY_PHONE";
        case PLKEventNameValueConnectNewInstitution:
            return @"CONNECT_NEW_INSTITUTION";
        case PLKEventNameValueSubmitOTP:
            return @"SUBMIT_OTP";
        case PLKEventNameValueLayerReady:
            return @"LAYER_READY";
        case PLKEventNameValueLayerNotAvailable:
            return @"LAYER_NOT_AVAILABLE";
        case PLKEventNameValueSubmitEmail:
            return @"SUBMIT_EMAIL";
        case PLKEventNameValueSkipSubmitEmail:
            return @"SKIP_SUBMIT_EMAIL";
        case PLKEventNameValueRememberMeEnabled:
            return @"REMEMBER_ME_ENABLED";
        case PLKEventNameValueRememberMeDisabled:
            return @"REMEMBER_ME_DISABLED";
        case PLKEventNameValueRememberMeHoldout:
            return @"REMEMBER_ME_HOLDOUT";
        case PLKEventNameValueSelectSavedInstitution:
            return @"SELECT_SAVED_INSTITUTION";
        case PLKEventNameValueSelectSavedAccount:
            return @"SELECT_SAVED_ACCOUNT";
        case PLKEventNameValueAutoSelectSavedInstitution:
            return @"AUTO_SELECT_SAVED_INSTITUTION";
        case PLKEventNameValuePlaidCheckPane:
            return @"PLAID_CHECK_PANE";
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
        case PLKExitStatusValueContinueToThridParty:
            return @"continue_to_third_party";
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
        case PLKViewNameValueUploadDocuments:
            return @"UPLOAD_DOCUMENTS";
        case PLKViewNameValueSubmitDocuments:
            return @"SUBMIT_DOCUMENTS";
        case PLKViewNameValueSubmitDocumentsSuccess:
            return @"SUBMIT_DOCUMENTS_SUCCESS";
        case PLKViewNameValueSubmitDocumentsError:
            return @"SUBMIT_DOCUMENTS_ERROR";
        case PLKViewNameValueOauth:
            return @"OAUTH";
        case PLKViewNameValueAcceptTOS:
            return @"ACCEPT_TOS";
        case PLKViewNameValueDocumentaryVerification:
            return @"DOCUMENTARY_VERIFICATION";
        case PLKViewNameValueKYCCheck:
            return @"KYC_CHECK";
        case PLKViewNameValueSelfieCheck:
            return @"SELFIE_CHECK";
        case PLKViewNameValueRiskCheck:
            return @"RISK_CHECK";
        case PLKViewNameValueScreening:
            return @"SCREENING";
        case PLKViewNameValueVerifySMS:
            return @"VERIFY_SMS";
        case PLKViewNameValueDataTransparency:
            return @"DATA_TRANSPARENCY";
        case PLKViewNameValueDataTransparencyConsent:
            return @"DATA_TRANSPARENCY_CONSENT";
        case PLKViewNameValueSelectAuthType:
            return @"SELECT_AUTH_TYPE";
        case PLKViewNameValueSelectBrand:
            return @"SELECT_BRAND";
        case PLKViewNameValueNumbersSelectInstitution:
            return @"NUMBERS_SELECT_INSTITUTION";
        case PLKViewNameValueSubmitPhone:
            return @"SUBMIT_PHONE";
        case PLKViewNameValueVerifyPhone:
            return @"VERIFY_PHONE";
        case PLKViewNameValueSelectSavedInstitution:
            return @"SELECT_SAVED_INSTITUTION";
        case PLKViewNameValueSelectSavedAccount:
            return @"SELECT_SAVED_ACCOUNT";
        case PLKViewNameValueProfileDataReview:
            return @"PROFILE_DATA_REVIEW";
        case PLKViewNameValueSubmitEmail:
            return @"SUBMIT_EMAIL";
        case PLKViewNameValueVerifyEmail:
            return @"VERIFY_EMAIL";
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

#if RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativePlaidLinkModuleiOSSpecJSI>(params);
}
#endif

@end
