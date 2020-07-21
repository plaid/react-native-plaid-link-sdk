import PropTypes from 'prop-types';
import React from 'react';
import { NativeModules, Platform, TouchableOpacity } from 'react-native';

export const openLink = async ({ onExit, onSuccess, ...serializable }) => {
  if (Platform.OS === 'android') {
    const constants = NativeModules.PlaidAndroid.getConstants();
    NativeModules.PlaidAndroid.startLinkActivityForResult(
      JSON.stringify(serializable),
      result => {
        if (onSuccess != null) {
          onSuccess(result.data);
        }
      },
      result => {
        if (onExit != null) {
          onExit(result.data);
        }
      }
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

  // A function that is called when a user has successfully onboarded their
  // account. The function should expect two arguments, the public_key and a
  // metadata object.
  onSuccess: PropTypes.func.isRequired,

  // Optional props

  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com).
  // 
  // [DEPRECATED] - instead, pass a Link token into the token field.
  // Create a Link token with the /link/token/create endpoint.
  publicKey: props => {
    if (!props.publicKey && !props.token) {
      return new Error(`One of props 'publicKey' or 'token' is required`);
    }
    if (typeof props.publicKey !== 'string' && !props.token) {
      return new Error(
        `Invalid prop 'publicKey': Expected string instead of ${typeof props.publicKey}`,
      );
    }
    console.log("The public_key is being deprecated. Learn how to upgrade to link_tokens at https://plaid.com/docs/#create-link-token");
  },

  // Displayed once a user has successfully linked their account
  clientName: PropTypes.string,

  // The Plaid API environment on which to create user accounts.
  env: PropTypes.oneOf(['development', 'sandbox', 'production']),

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
  ),

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

  // Specify a Link token to launch link. To create a Link token, use the
  // /link/token/create endpoint.
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
  // launching Link within a WebView and using one or more European country
  // codes. The nonce must be at least 16 characters long.
  oauthNonce: PropTypes.string,

  // An oauthRedirectUri is required to support OAuth authentication flows when
  // launching or re-launching Link within a WebView and using one or more
  // European country codes.
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

  // An oauthStateId is required to support OAuth authentication and payment flows when
  // re-launching Link within a WebView and using one or more European country
  // codes.
  oauthStateId: PropTypes.string,

  // Underlying component to render
  component: PropTypes.func,

  // Props for underlying component
  componentProps: PropTypes.object,

  // Note: onEvent is omitted here, to handle onEvent callbacks refer to
  // the documentation here: https://github.com/plaid/react-native-plaid-link-sdk#to-receive-onevent-callbacks
};

PlaidLink.defaultProps = {
  component: TouchableOpacity,
};
