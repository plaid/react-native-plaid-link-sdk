import PropTypes from 'prop-types';
import React from 'react';
import { Button, NativeModules, Platform, View } from 'react-native';

const openLink = async ({
  onCancelled,
  onError,
  onExit,
  onSuccess,
  ...serializable
}) => {
  if (Platform.OS === 'android') {
    var constants = NativeModules.PlaidAndroid.getConstants();
    NativeModules.PlaidAndroid.startLinkActivityForResult(
      JSON.stringify(serializable),
      result => {
        switch (result.resultCode) {
          case constants.RESULT_SUCCESS:
            if (onSuccess != null) {
              onSuccess(result.data);
            }
            break;
          case constants.RESULT_EXCEPTION:
            if (onError != null) {
              onError(result.data);
            }
            break;
          case constants.RESULT_CANCELLED:
            if (onCancelled != null) {
              onCancelled(result.data);
            }
            break;
          case constants.RESULT_EXIT:
            if (onExit != null) {
              onExit(result.data);
            }
            break;
        }
      },
    );
  } else {
    NativeModules.RNLinksdk.create(serializable);
    NativeModules.RNLinksdk.open((error, metadata) => {
      if (error) {
        if (onError != null) {
          var data = metadata || {};
          data.error = error;
          onError(data);
        }
      } else {
        switch (metadata.status) {
          case 'connected':
            if (onSuccess != null) {
              onSuccess(metadata);
            }
            break;
          case undefined:
          case null:
          case '':
            if (onCancelled != null) {
              onCancelled(metadata);
            }
            break;
          default:
            if (onExit != null) {
              onExit(metadata);
            }
            break;
        }
      }
    });
  }
};

export const PlaidLink = props => {
  return (
    <View>
      <Button onPress={() => openLink(props)} title="Open Link" />
    </View>
  );
};

PlaidLink.propTypes = {
  // Required props
  publicKey: PropTypes.string.isRequired,
  clientName: PropTypes.string.isRequired,
  env: PropTypes.oneOf(['development', 'sandbox', 'production']).isRequired,
  onSuccess: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.string).isRequired,
  // Optional props
  apiVersion: PropTypes.oneOf(['v1', 'v2']), // is this necessary? defaults to v2
  countryCodes: PropTypes.arrayOf(PropTypes.string),
  language: PropTypes.string,
  institution: PropTypes.string,
  onCancelled: PropTypes.func,
  onError: PropTypes.func,
  onExit: PropTypes.func,
  token: PropTypes.string,
  userEmailAddress: PropTypes.string,
  userLegalName: PropTypes.string,
  userPhoneNumber: PropTypes.string,
  webhook: PropTypes.string,
};

PlaidLink.defaultProps = {
  apiVersion: 'v2',
};
