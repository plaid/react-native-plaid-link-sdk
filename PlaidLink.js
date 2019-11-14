import PropTypes from 'prop-types';
import React from 'react';
import { NativeModules, Platform, View } from 'react-native';
import { Button } from 'native-base';

const openLink = async ({ onExit, onSuccess, ...serializable }) => {
  if (Platform.OS === 'android') {
    const constants = NativeModules.PlaidAndroid.getConstants();
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
          case constants.RESULT_CANCELLED:
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
        if (onExit != null) {
          var data = metadata || {};
          data.error = error;
          onExit(data);
        }
      } else {
        switch (metadata.status) {
          case 'connected':
            if (onSuccess != null) {
              onSuccess(metadata);
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

export const PlaidLink = ({ children, className, styles, ...linkProps }) => {
  return (
    <View>
      <Button
        className={className}
        onPress={() => openLink(linkProps)}
        style={styles}
      >
        {children}
      </Button>
    </View>
  );
};

PlaidLink.propTypes = {
  // Required props

  // Displayed once a user has successfully linked their account
  clientName: PropTypes.string.isRequired,

  // The Plaid API environment on which to create user accounts.
  env: PropTypes.oneOf(['development', 'sandbox', 'production']).isRequired,

  // A function that is called when a user has successfully onboarded their
  // account. The function should expect two arguments, the public_key and a
  // metadata object.
  onSuccess: PropTypes.func.isRequired,

  // The Plaid product(s) you wish to use, an array containing some of
  // auth, identity, income, transactions, assets, liabilities, investments.
  product: PropTypes.arrayOf(
    PropTypes.oneOf([
      'auth',
      'identity',
      'income',
      'transactions',
      'assets',
      'liabilities',
      'investments',
    ]),
  ).isRequired,

  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com).
  publicKey: PropTypes.string.isRequired,

  // Optional props

  // Button class name as a string.
  className: PropTypes.string,

  // A list of Plaid-supported country codes using the ISO-3166-1 alpha-2
  // country code standard.
  countryCodes: PropTypes.arrayOf(PropTypes.string),

  // Plaid-supported language to localize Link. English will be used by default.
  language: PropTypes.string,

  // A function that is called when a user has specifically exited Link flow.
  onExit: PropTypes.func,

  // Specify an existing user's public token to launch Link in update mode.
  // This will cause Link to open directly to the authentication step for
  // that user's institution.
  token: PropTypes.string,

  // Specify a user to enable all Auth features. Reach out to your
  // account manager or integrations@plaid.com to get enabled. See the Auth
  // [https://plaid.com/docs#auth] docs for integration details.
  userEmailAddress: PropTypes.string,
  userLegalName: PropTypes.string,
  userPhoneNumber: PropTypes.string,

  // Specify a webhook to associate with a user.
  webhook: PropTypes.string,

  // Note: onEvent is omitted here, to handle onEvent callbacks refer to
  // the documentation here: https://github.com/plaid/react-native-plaid-link-sdk#to-receive-onevent-callbacks
};
