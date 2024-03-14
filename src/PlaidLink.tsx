import React, { useEffect } from 'react';
import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  TouchableOpacity,
} from 'react-native';
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
} from './Types';

/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param LinkEventListener the listener to call
 */
export const usePlaidEmitter = (LinkEventListener: LinkEventListener) => {
  useEffect(() => {
    const emitter = new NativeEventEmitter(
      Platform.OS === 'ios'
        ? NativeModules.RNLinksdk
        : NativeModules.PlaidAndroid,
    );
    const listener = emitter.addListener('onEvent', LinkEventListener);
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
    console.log('create is not supported on android yet');
  } else {
    NativeModules.RNLinksdk.create(token, noLoadingState);
  }
};

export const open = async (props: LinkOpenProps) => {
  if (Platform.OS === 'android') {
    console.log('open is not supported on android yet');
  } else {
    let presentFullScreen = props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN

    NativeModules.RNLinksdk.open(presentFullScreen,
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
      }
    );
  }
};

export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    NativeModules.RNLinksdk.dismiss();
  }
};

export const PlaidLink = (props: PlaidLinkComponentProps) => {

  // Create a handler.
  create(props.tokenConfig);
  
  function onPress() {
    props.onPress?.();

    const openProps: LinkOpenProps = {
      onSuccess: props.onSuccess,
      onExit: props.onExit,
      iOSPresentationStyle: props.iOSPresentationStyle,
      logLevel: props.logLevel
    };

    open(openProps);
  }

  return <TouchableOpacity onPress={onPress}>{props.children}</TouchableOpacity>;
};

/**
 * @deprecated This method is deprecated. For faster loading use the create & open methods.
 */
export const openLink = async (props: PlaidLinkProps) => {
  let config = props.tokenConfig;
  let noLoadingState = config.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    NativeModules.PlaidAndroid.startLinkActivityForResult(
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
            result.error.errorDisplayMessage = result.error.displayMessage
          }
          props.onExit(result);
        }
      },
    );
  } else {
    NativeModules.RNLinksdk.create(config.token, noLoadingState);

    let presentFullScreen = props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN

    NativeModules.RNLinksdk.open(presentFullScreen,
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
      }
    );
  }
};
