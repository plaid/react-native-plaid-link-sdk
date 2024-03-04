var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var _a;
import React, { useEffect } from 'react';
import { NativeEventEmitter, Platform, TouchableOpacity } from 'react-native';
import { LinkIOSPresentationStyle, LinkLogLevel } from './Types';
import RNLinksdkAndroid from './fabric/NativePlaidLinkModuleAndroid';
import RNLinksdkiOS from './fabric/NativePlaidLinkModuleiOS';
const RNLinksdk =
  (_a = Platform.OS === 'android' ? RNLinksdkAndroid : RNLinksdkiOS) !== null &&
  _a !== void 0
    ? _a
    : undefined;
/**
 * A hook that registers a listener on the Plaid emitter for the 'onEvent' type.
 * The listener is cleaned up when this view is unmounted
 *
 * @param linkEventListener the listener to call
 */
export const usePlaidEmitter = linkEventListener => {
  useEffect(() => {
    const emitter = new NativeEventEmitter(RNLinksdk);
    const listener = emitter.addListener('onEvent', linkEventListener);
    // Clean up after this effect:
    return function cleanup() {
      listener.remove();
    };
  }, []);
};
export const openLink = props =>
  __awaiter(void 0, void 0, void 0, function*() {
    var _b, _c;
    let config = props.tokenConfig;
    let noLoadingState =
      (_b = config.noLoadingState) !== null && _b !== void 0 ? _b : false;
    if (Platform.OS === 'android') {
      if (RNLinksdkAndroid === null) {
        throw new Error(
          '[react-native-plaid-link-sdk] RNLinksdkAndroid is not defined',
        );
      }
      RNLinksdkAndroid.startLinkActivityForResult(
        config.token,
        noLoadingState,
        (_c = config.logLevel) !== null && _c !== void 0
          ? _c
          : LinkLogLevel.ERROR,
        // @ts-ignore we use Object type in the spec file as it maps to NSDictionary and ReadableMap
        result => {
          if (props.onSuccess != null) {
            props.onSuccess(result);
          }
        },
        result => {
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
        throw new Error(
          '[react-native-plaid-link-sdk] RNLinksdkiOS is not defined',
        );
      }
      RNLinksdkiOS.create(config.token, noLoadingState);
      let presentFullScreen =
        props.iOSPresentationStyle == LinkIOSPresentationStyle.FULL_SCREEN;
      RNLinksdkiOS.open(
        presentFullScreen,
        // @ts-ignore we use Object type in the spec file as it maps to NSDictionary and ReadableMap
        result => {
          if (props.onSuccess != null) {
            props.onSuccess(result);
          }
        },
        (error, result) => {
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
  });
export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    if (RNLinksdkiOS === null) {
      throw new Error(
        '[react-native-plaid-link-sdk] RNLinksdkiOS is not defined',
      );
    }
    RNLinksdkiOS.dismiss();
  }
};
export const PlaidLink = props => {
  function onPress() {
    var _a;
    (_a = props.onPress) === null || _a === void 0 ? void 0 : _a.call(props);
    openLink(props);
  }
  return (
    // @ts-ignore some types directories misconfiguration
    <TouchableOpacity onPress={onPress}>{props.children}</TouchableOpacity>
  );
};
