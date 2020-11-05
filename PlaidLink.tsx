import React, { useEffect } from 'react';
import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Pressable,
} from 'react-native';
import {
  LinkError,
  LinkEventListener,
  LinkExit,
  LinkSuccess,
  PlaidLinkProps,
} from './types/Types';

/**
 * A hook that registers a listener on the plaid emitter for the 'onEvent' type.
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


export const openLink = async (plaidLinkProps: PlaidLinkProps) => {
  if (Platform.OS === 'android') {
    NativeModules.PlaidAndroid.startLinkActivityForResult(
      JSON.stringify(plaidLinkProps.config),
      (result: LinkSuccess) => {
        if (plaidLinkProps.onSuccess != null) {
            plaidLinkProps.onSuccess(result);
        }
      },
      (result: LinkExit) => {
        if (plaidLinkProps.onExit != null) {
            plaidLinkProps.onExit(result);
        }
      },
    );
  } else {
    NativeModules.RNLinksdk.create(plaidLinkProps.config);
    NativeModules.RNLinksdk.open(
      (error: LinkError, result: LinkExit & LinkSuccess ) => {
        if (error) {
          if (plaidLinkProps.onExit != null) {
            var data = result || {};
            data.error = error;
            plaidLinkProps.onExit(data);
          }
        } else {
          switch (result.metadata.status) {
            case 'connected':
              if (plaidLinkProps.onSuccess != null) {
                delete result.metadata.status;
                plaidLinkProps.onSuccess(result);
              }
              break;
            default:
              if (plaidLinkProps.onExit != null) {
                delete result.metadata.status;
                plaidLinkProps.onExit(result);
              }
              break;
          }
        }
      },
    );
  }
};

export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    NativeModules.RNLinksdk.dismiss();
  }
};

export const useDeepLinkRedirector = () => {
  const _handleListenerChange = (event: { url: string }) => {
    if (event.url !== null && Platform.OS === 'ios') {
      NativeModules.RNLinksdk.continueFromRedirectUriString(event.url);
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', _handleListenerChange);

    return function cleanup() {
      Linking.removeEventListener('url', _handleListenerChange);
    };
  }, []);
};

export const PlaidLink = ({
  children,
  ...linkProps
}: PlaidLinkProps & { children?: React.ReactNode }) => {
  useDeepLinkRedirector();

  return <Pressable onPress={() => openLink(linkProps)}>{children}</Pressable>;
};
