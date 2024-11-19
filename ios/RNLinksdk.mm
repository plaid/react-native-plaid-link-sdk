#import <React/RCTBridgeModule.h>

/// This interface exposes native functions for React Native, compatible with both the old architecture (Bridge)
/// and the new architecture (TurboModules & Fabric). These methods are implemented in `RNLinksdk.swift`
/// and provide functionality to interact with the Link SDK.
@interface RCT_EXTERN_MODULE(RNLinksdk, NSObject)

// Creates a Link handler with a specified token.
// The handler initializes the Link SDK experience and prepares it for subsequent operations.
//
// Parameters:
// - token: A unique string used to authenticate and initialize the Link SDK.
// - noLoadingState: A boolean indicating whether to suppress the loading state during initialization.
RCT_EXTERN_METHOD(create:(NSString *)token noLoadingState:(BOOL)noLoadingState)

// Opens the Link experience after the handler has been created.
// This function is used to present the Link UI to the user.
//
// Parameters:
// - fullScreen: A boolean indicating whether the Link UI should be displayed in full-screen mode.
// - onSuccess: A callback triggered when the Link flow is successfully completed.
// - onExit: A callback triggered when the user exits the Link flow without completing it.
RCT_EXTERN_METHOD(open:(BOOL)fullScreen
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onExit:(RCTResponseSenderBlock)onExit)

// Dismisses the currently displayed Link UI.
// Use this function to programmatically close the Link experience if necessary.
RCT_EXTERN_METHOD(dismiss)

// Submits a user's phone number for an eligibility check for Layer services.
// This function checks if the provided phone number is eligible for additional features or services.
//
// Parameters:
// - phoneNumber: The user's phone number to be submitted for eligibility verification.
RCT_EXTERN_METHOD(submit:(NSString *)phoneNumber)

// Syncs transactions from the user's Apple Card using FinanceKit.
// This function fetches recent Apple Card transactions and updates the user's linked accounts.
//
// Parameters:
// - token: A string used to authenticate and authorize the sync operation.
// - requestAuthorizationIfNeeded: A boolean indicating whether to request user authorization if it's not already granted.
// - onSuccess: A callback triggered when the sync operation completes successfully.
// - onError: A callback triggered when the sync operation fails due to an error.
RCT_EXTERN_METHOD(syncFinanceKit:(NSString *)token
                  requestAuthorizationIfNeeded:(BOOL)requestAuthorizationIfNeeded
                  onSuccess:(RCTResponseSenderBlock)onSuccess
                  onError:(RCTResponseSenderBlock)onError)

@end
