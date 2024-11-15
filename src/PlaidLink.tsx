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

const RNLinksdk =
  (Platform.OS === 'android' ? RNLinksdkAndroid : RNLinksdkiOS) ?? undefined;

/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param LinkEventListener the listener to call
 */
export const usePlaidEmitter = (linkEventListener: LinkEventListener) => {
  useEffect(() => {
    const emitter = new NativeEventEmitter(RNLinksdk);
    const listener = emitter.addListener('onEvent', linkEventListener);
    // Clean up after this effect:
    return function cleanup() {
      listener.remove();
    };
  }, []);
};

export const create = (props: LinkTokenConfiguration) => {
  let token = props.token;
  let noLoadingState = props.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    RNLinksdkAndroid?.create(
      token,
      noLoadingState,
      props.logLevel ?? LinkLogLevel.ERROR,
    );
  } else {
    RNLinksdkiOS?.create(token, noLoadingState);
  }
};

export const open = async (props: LinkOpenProps) => {
  if (Platform.OS === 'android') {
    RNLinksdkAndroid?.open(
      (result: LinkSuccess) => {
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (result: LinkExit) => {
        if (props.onExit != null) {
          if (result.error != null && result.error.displayMessage != null) {
            //TODO(RNSDK-118): Remove errorDisplayMessage field in next major update.
            result.error.errorDisplayMessage = result.error.displayMessage;
          }
          props.onExit(result);
        }
      },
    );
  } else {
    let presentFullScreen =
      props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;

    RNLinksdkiOS?.open(
      presentFullScreen,
      (result: LinkSuccess) => {
        if (props.onSuccess != null) {
          props.onSuccess(result);
        }
      },
      (error: LinkError, result: LinkExit) => {
        if (props.onExit != null) {
          if (error) {
            var data = result || {};
            data.error = error;
            props.onExit(data);
          } else {
            props.onExit(result);
          }
        }
      },
    );
  }
};

export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    RNLinksdkiOS?.dismiss();
  }
};

export const submit = (data: SubmissionData): void => {
  if (Platform.OS === 'android') {
    RNLinksdkAndroid?.submit(data.phoneNumber);
  } else {
    RNLinksdkiOS?.submit(data.phoneNumber);
  }
};

/**
 * Function to sync the user's transactions from their Apple card.
 *
 * @param {string} token - The `LinkToken` your server retrieved from the /link/token/create endpoint from the Plaid API.
 *                         This token must be associated with an accessToken.
 * @param {boolean} requestAuthorizationIfNeeded - Indicates if the user should be prompted to authorize the sync if
 *                                                 they have not already done so.
 * @param {function} completion - A callback function that is called when the sync has completed.
 *
 * @warning This method only works on iOS >= 17.4.
 * @warning This method is not supported on Android or MacCatalyst.
 * @warning This method can only be used once the user has granted access to their Apple card via a standard Link Session.
 * @warning This method requires that your app has been granted FinanceKit access from Apple.
 */
export const syncFinanceKit = (
  token: string,
  requestAuthorizationIfNeeded: boolean,
  completion: (error?: FinanceKitError) => void
): void => {
    if (Platform.OS === 'android') {
      completion({
        type: FinanceKitErrorType.Unknown,
        message: "FinanceKit is unavailable on Android!",
      })
    } else {
      RNLinksdkiOS?.syncFinanceKit(
        token, 
        requestAuthorizationIfNeeded, 
        () => {
          completion()
        },
        (error: FinanceKitError) => {
          completion({
            type: error.type,
            message: error.message,
          })
        }
      )
    }
};
