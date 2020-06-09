import PropTypes from 'prop-types';
import React from 'react';
import { NativeModules, Platform, TouchableOpacity } from 'react-native';

export const openLink = async ({ onExit, onSuccess, ...serializable }) => {
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

export const dismissLink = () => {
  if (Platform.OS === 'ios') {
    NativeModules.RNLinksdk.dismiss();
  }
};

const handlePress = (linkProps, componentProps) => {
  openLink(linkProps);
  if (componentProps && componentProps.onPress) {
    componentProps.onPress();
  }
};

export const PlaidLink = ({
  component,
  componentProps,
  children,
  ...linkProps
}) => {
  const Component = component;
  return (
    <Component
      {...componentProps}
      onPress={() => handlePress(linkProps, componentProps)}
    >
      {children}
    </Component>
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

  // Optional props

  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com).
  // Either publicKey or token is required.
  publicKey: props => {
    if (!props.publicKey && !props.token) {
      return new Error(`One of props 'publicKey' or 'token' is required`);
    }
    if (typeof props.publicKey !== 'string') {
      return new Error(
        `Invalid prop 'publicKey': Expected string instead of ${typeof props.publicKey}`,
      );
    }
  },

  // You can configure Link to return only the accounts that
  // match a given type and subtype
  //
  // This object is a nonempty Map<account type, Array<account subtype>>
  // where account type and account subtype are strings
  //
  // see https://plaid.com/docs/#auth-filtering-institutions-in-link
  // and https://plaid.com/docs/#filtering-institutions-in-link
  accountSubtypes: PropTypes.shape({
    credit: PropTypes.arrayOf(PropTypes.string),
    depository: PropTypes.arrayOf(PropTypes.string),
    loan: PropTypes.arrayOf(PropTypes.string),
  }),

  // A list of Plaid-supported country codes using the ISO-3166-1 alpha-2
  // country code standard.
  countryCodes: PropTypes.arrayOf(PropTypes.string),

  // Allows non default customization to be retrieved by name.
  linkCustomizationName: PropTypes.string,

  // Plaid-supported language to localize Link. English will be used by default.
  language: PropTypes.string,

  // A function that is called when a user has specifically exited Link flow.
  onExit: PropTypes.func,

  // Specify an existing user's public token to launch Link in update mode.
  // This will cause Link to open directly to the authentication step for
  // that user's institution.
  // Pass an item_add_token to launch Link in regular mode without a public_key.
  // Either publicKey or token is required.
  token: PropTypes.string,

  // Specify a user to enable all Auth features. Reach out to your
  // account manager or integrations@plaid.com to get enabled. See the Auth
  // [https://plaid.com/docs#auth] docs for integration details.
  userEmailAddress: PropTypes.string,
  userLegalName: PropTypes.string,
  userPhoneNumber: PropTypes.string,

  // Specify a webhook to associate with a user.
  webhook: PropTypes.string,

  // Specify an existing payment token to launch Link in payment initation mode.
  // This will cause Link to open a payment confirmation dialog prior to
  // institution selection.
  paymentToken: PropTypes.string,

  // An oauthNonce is required to support OAuth authentication flows when
  // launching Link on iOS and using one or more European country codes.
  oauthNonce: PropTypes.string,

  // An oauthRedirectUri is required to support OAuth authentication flows when
  // launching or re-launching Link on iOS and using one or more European
  // country codes.
  oauthRedirectUri: function(props, propName) {
    let value = props[propName];
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value !== 'string') {
      return new Error(
        'Invalid `' +
          propName +
          '`: Expected string instead of ' +
          typeof value,
      );
    }
    if (/^https?:\/\/(localhost|127.0.0.1)/.test(value)) {
      return new Error('Invalid `' + propName + '`: localhost disallowed');
    }
  },

  // An oauthStateId is required to support OAuth authentication flows when
  // re-launching Link on iOS and using one or more European country codes.
  oauthStateId: PropTypes.string,

  // Underlying component to render
  component: PropTypes.elementType,

  // Props for underlying component
  componentProps: PropTypes.object,

  // Note: onEvent is omitted here, to handle onEvent callbacks refer to
  // the documentation here: https://github.com/plaid/react-native-plaid-link-sdk#to-receive-onevent-callbacks
};

PlaidLink.defaultProps = {
  component: TouchableOpacity,
};
