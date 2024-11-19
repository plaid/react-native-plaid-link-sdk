import { useEffect } from 'react';
import { NativeEventEmitter, Platform } from 'react-native';
import {
  LinkError,
  LinkEventListener,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkOpenProps,
  LinkSuccess,
  LinkTokenConfiguration,
  FinanceKitErrorType,
  FinanceKitError,
  SubmissionData,
} from './Types';
import RNLinksdkAndroid from './fabric/NativePlaidLinkModuleAndroid';
import RNLinksdkiOS from './fabric/NativePlaidLinkModuleiOS';

// Choose the correct native module based on the platform.
// Use the Android or iOS implementation if available; otherwise, fallback to `undefined`.
const RNLinksdk =
  (Platform.OS === 'android' ? RNLinksdkAndroid : RNLinksdkiOS) ?? undefined;

/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this component is unmounted.
 *
 * @param {LinkEventListener} linkEventListener - The event listener to be called on 'onEvent'.
 */
export const usePlaidEmitter = (linkEventListener: LinkEventListener) => {
  useEffect(() => {
    // Create a new event emitter for the Plaid native module
    const emitter = new NativeEventEmitter(RNLinksdk);
    const listener = emitter.addListener('onEvent', linkEventListener);

    // Clean up the event listener when the component unmounts
    return function cleanup() {
      listener.remove();
    };
  }, []);
};

/**
 * Initializes the Plaid Link SDK with the provided token configuration.
 *
 * @param {LinkTokenConfiguration} props - Configuration object containing the token and options.
 */
export const create = (props: LinkTokenConfiguration) => {
  let token = props.token; // The Link token to be used for initialization.
  let noLoadingState = props.noLoadingState ?? false; // Default to `false` if `noLoadingState` is undefined.

  if (Platform.OS === 'android') {
    // Android-specific initialization with log level
    RNLinksdkAndroid?.create(
      token,
      noLoadingState,
      props.logLevel ?? LinkLogLevel.ERROR // Default log level is ERROR.
    );
  } else {
    // iOS-specific initialization
    RNLinksdkiOS?.create(token, noLoadingState);
  }
};

/**
 * Opens the Plaid Link interface.
 *
 * @param {LinkOpenProps} props - Properties required to open the Plaid Link.
 */
export const open = async (props: LinkOpenProps) => {
  if (Platform.OS === 'android') {
    // Android-specific open implementation
    RNLinksdkAndroid?.open(
      (result: LinkSuccess) => {
        // Handle successful session
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (result: LinkExit) => {
        // Handle session exit with possible error
        if (props.onExit != null) {
          if (result.error != null && result.error.displayMessage != null) {
            // Legacy field for error display message (to be removed in the next major update)
            result.error.errorDisplayMessage = result.error.displayMessage;
          }
          props.onExit(result);
        }
      }
    );
  } else {
    // Determine iOS presentation style
    let presentFullScreen =
      props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;

    RNLinksdkiOS?.open(
      presentFullScreen,
      (result: LinkSuccess) => {
        // Handle successful session
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (error: LinkError, result: LinkExit) => {
        // Handle session exit with possible error
        if (props.onExit != null) {
          if (error) {
            var data = result || {};
            data.error = error; // Attach error details to the result.
            props.onExit(data);
          } else {
            props.onExit(result);
          }
        }
      }
    );
  }
};

/**
 * Dismisses the Plaid Link interface on iOS.
 */
export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    RNLinksdkiOS?.dismiss();
  }
};

/**
 * Submits additional data, such as a phone number, to the Plaid Link interface.
 *
 * @param {SubmissionData} data - Data to be submitted.
 */
export const submit = (data: SubmissionData): void => {
  if (Platform.OS === 'android') {
    RNLinksdkAndroid?.submit(data.phoneNumber);
  } else {
    RNLinksdkiOS?.submit(data.phoneNumber);
  }
};

/**
 * Syncs the user's transactions from their Apple Card.
 *
 * @param {string} token - The LinkToken retrieved from Plaid's /link/token/create endpoint.
 *                         Must be associated with an accessToken.
 * @param {boolean} requestAuthorizationIfNeeded - Whether to prompt the user for authorization if required.
 * @param {function} completion - A callback function invoked upon completion with an error (if any).
 *
 * @warning This method only works on iOS >= 17.4.
 * @warning Not supported on Android or MacCatalyst.
 * @warning Requires prior authorization via a standard Link session and FinanceKit access.
 */
export const syncFinanceKit = (
  token: string,
  requestAuthorizationIfNeeded: boolean,
  completion: (error?: FinanceKitError) => void
): void => {
  // Check platform compatibility
  if (Platform.OS === 'android') {
    completion({
      type: FinanceKitErrorType.Unknown,
      message: 'FinanceKit is unavailable on Android!',
    });
    return;
  }

  // Ensure the iOS native module is available
  if (!RNLinksdkiOS) {
    completion({
      type: FinanceKitErrorType.Unknown,
      message: 'FinanceKit module is not available on this platform!',
    });
    return;
  }

  // Call the iOS native method
  RNLinksdkiOS.syncFinanceKit(
    token,
    requestAuthorizationIfNeeded,
    () => {
      // Success callback
      completion();
    },
    (error: FinanceKitError) => {
      // Error callback
      completion(error);
    }
  );
};
