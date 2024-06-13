import React, { useEffect } from 'react';
import { NativeEventEmitter, Platform, TouchableOpacity } from 'react-native';
import {
  LinkError,
  LinkEventListener,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkOpenProps,
  LinkSuccess,
  LinkTokenConfiguration,
  PlaidLinkComponentProps,
  PlaidLinkProps,
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
    RNLinksdkAndroid?.submit(data);
  } else {
    RNLinksdkiOS?.submit(data);
  }
};

/**
 * @deprecated This component is deprecated. Create your own component and use the create & open methods.
 */
export const PlaidLink = (props: PlaidLinkComponentProps) => {
  function onPress() {
    // Create a handler.
    create(props.tokenConfig);
    
    props.onPress?.();

    const openProps: LinkOpenProps = {
      onSuccess: props.onSuccess,
      onExit: props.onExit,
      iOSPresentationStyle: props.iOSPresentationStyle,
      logLevel: props.logLevel,
    };

    open(openProps);
  }

  return (
    <TouchableOpacity onPress={onPress}>{props.children}</TouchableOpacity>
  );
};

/**
 * @deprecated This method is deprecated. For faster loading use the create & open methods.
 */
export const openLink = async (props: PlaidLinkProps) => {
  let config = props.tokenConfig;
  let noLoadingState = config.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    RNLinksdkAndroid?.startLinkActivityForResult(
      config.token,
      noLoadingState,
      config.logLevel ?? LinkLogLevel.ERROR,
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
    RNLinksdkiOS?.create(config.token, noLoadingState);

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
