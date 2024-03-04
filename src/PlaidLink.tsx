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
import RNLinksdkAndroid from './fabric/NativePlaidLinkModuleAndroid';
import RNLinksdkiOS from './fabric/NativePlaidLinkModuleiOS';

const RNLinksdk = (Platform.OS === 'android' ? RNLinksdkAndroid : RNLinksdkiOS) ?? undefined;

/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param linkEventListener the listener to call
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

export const openLink = async (props: PlaidLinkProps) => {
  let config = props.tokenConfig;
  let noLoadingState = config.noLoadingState ?? false;

  if (Platform.OS === 'android') {
    if (RNLinksdkAndroid === null) {
      throw new Error('[react-native-plaid-link-sdk] RNLinksdkAndroid is not defined');
    }

    RNLinksdkAndroid.startLinkActivityForResult(
      config.token,
      noLoadingState,
      config.logLevel ?? LinkLogLevel.ERROR,
      // @ts-ignore we use Object type in the spec file as it maps to NSDictionary and ReadableMap
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
    if (RNLinksdkiOS === null) {
      throw new Error('[react-native-plaid-link-sdk] RNLinksdkiOS is not defined');
    }

    RNLinksdkiOS.create(config.token, noLoadingState);

    let presentFullScreen =
      props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;

    RNLinksdkiOS.open(
      presentFullScreen,
      // @ts-ignore we use Object type in the spec file as it maps to NSDictionary and ReadableMap
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
    if (RNLinksdkiOS === null) {
      throw new Error('[react-native-plaid-link-sdk] RNLinksdkiOS is not defined');
    }

    RNLinksdkiOS.dismiss();
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
