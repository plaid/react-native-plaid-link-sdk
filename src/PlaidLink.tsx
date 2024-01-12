import React, { useEffect } from 'react';
import { NativeEventEmitter, Platform, TouchableOpacity } from 'react-native';
import {
  LinkError,
  LinkEventListener,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkSuccess,
  PlaidLinkComponentProps,
  PlaidLinkProps,
} from './Types';
import RNLinksdk from './fabric/NativePlaidLinkModule';
/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param LinkEventListener the listener to call
 */
export const usePlaidEmitter = (LinkEventListener: LinkEventListener) => {
  useEffect(() => {
    const emitter = new NativeEventEmitter(RNLinksdk);
    const listener = emitter.addListener('onEvent', LinkEventListener);
    // Clean up after this effect:
    return function cleanup() {
      listener.remove();
    };
  }, []);
};

export const openLink = async (props: PlaidLinkProps) => {
  let config = props.tokenConfig;
  let noLoadingState = config.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    RNLinksdk.startLinkActivityForResult(
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
    RNLinksdk.create(config.token, noLoadingState);

    let presentFullScreen =
      props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;

    RNLinksdk.open(
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
    RNLinksdk.dismiss();
  }
};

export const PlaidLink = (props: PlaidLinkComponentProps) => {
  function onPress() {
    props.onPress?.();
    openLink(props);
  }

  return (
    // @ts-ignore some types directories misconfiguration
    <TouchableOpacity onPress={onPress}>{props.children}</TouchableOpacity>
  );
};
