import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface Account {
  id: string;
  mask: string;
  name: string;
  subtype: string;
  type: string;
}

export interface Institution {
  institution_id: string;
  name: string;
}

export interface OnSuccessMetadata {
  status: string;
  link_session_id: string;
  request_id: string;
  public_token: string;
  account_id: string;
  institution: Institution;
  accounts: Array<Account & {
    verification_status?: {
      pending_automatic_verification: boolean;
      pending_manual_verification: boolean;
      manually_verified: boolean;
    };
  }>;
  account: Account
}

export type ErrorStatus =
  | 'requires_questions'
  | 'requires_selections'
  | 'requires_code'
  | 'choose_device'
  | 'requires_credentials'
  | 'institution_not_found';

export interface OnExitMetadata {
  link_session_id: string;
  request_id: string;
  status: ErrorStatus;
  institution: Institution;
}

export type EventName =
  | 'ERROR'
  | 'EXIT'
  | 'HANDOFF'
  | 'OPEN'
  | 'OPEN_MY_PLAID'
  | 'SEARCH_INSTITUTION'
  | 'SELECT_INSTITUTION'
  | 'SUBMIT_CREDENTIALS'
  | 'SUBMIT_MFA'
  | 'TRANSITION_VIEW';

export type ViewName =
  | 'CONNECTED'
  | 'CONSENT'
  | 'CREDENTIAL'
  | 'ERROR'
  | 'EXIT'
  | 'LOADING'
  | 'MFA'
  | 'NUMBERS'
  | 'RECAPTCHA'
  | 'SELECT_ACCOUNT'
  | 'SELECT_INSTITUTION';

export interface EventMetadata {
  error_code: string;
  error_message: string;
  error_type: string;
  exit_status: string;
  institution_id: string;
  institution_name: string;
  institution_search_query: string;
  request_id: string;
  link_session_id: string;
  mfa_type: string;
  view_name: ViewName;
  timestamp: string;
}

export interface OnEventArgs {
  eventName: EventName;
  metadata: EventMetadata;
}

export type Product =
  | 'auth'
  | 'identity'
  | 'income'
  | 'transactions'
  | 'assets'
  | 'liabilities'
  | 'investments';

declare module 'react-native-plaid-link-sdk' {
  export interface PlaidLinkProps<
    C = TouchableOpacity,
    P = TouchableOpacityProps
  > {
    // Required props

    // Displayed once a user has successfully linked their account
    clientName: string;

    // The Plaid API environment on which to create user accounts.
    env: 'development' | 'sandbox' | 'production';

    // A function that is called when a user has successfully onboarded their account.
    // The function should expect one argument, a metadata object.
    onSuccess: (metadata: OnSuccessMetadata) => void;

    // The Plaid product(s) you wish to use, an array containing some of
    // auth, identity, income, transactions, assets, liabilities, investments.
    product: Array<Product>;

    // The public_key associated with your account; available from
    // the Plaid dashboard (https://dashboard.plaid.com).
    publicKey: string;

    // Optional props

    // A list of Plaid-supported country codes using the ISO-3166-1 alpha-2
    // country code standard.
    countryCodes?: Array<string>;

    // Allows non default customization to be retrieved by name.
    linkCustomizationName?: string;

    // Plaid-supported language to localize Link. English will be used by default.
    language?: string;

    // A function that is called when a user has specifically exited Link flow.
    onExit?: (metadata: OnExitMetadata) => void;

    // Specify an existing user's public token to launch Link in update mode.
    // This will cause Link to open directly to the authentication step for
    // that user's institution.
    token?: string;

    // Specify a user to enable all Auth features. Reach out to your
    // account manager or integrations@plaid.com to get enabled. See the Auth
    // [https://plaid.com/docs#auth] docs for integration details.
    userEmailAddress?: string; // specify for microdeposit support
    userLegalName?: string; // specify for microdeposit support
    userPhoneNumber?: string;

    // Specify a webhook to associate with a user.
    webhook?: string;

    // Specify an existing payment token to launch Link in payment initation mode.
    // This will cause Link to open a payment confirmation dialog prior to
    // institution selection.
    paymentToken?: string;

    // An oauthNonce is required to support OAuth authentication flows when
    // launching Link within a WebView and using one or more European country
    // codes. The nonce must be at least 16 characters long.
    oauthNonce?: string;

    // An oauthRedirectUri is required to support OAuth authentication flows when
    // launching or re-launching Link within a WebView and using one or more
    // European country codes.
    oauthRedirectUri?: <P>(props: P, propName: keyof P) => void | Error;

    // An oauthStateId is required to support OAuth authentication and payment flows when
    // re-launching Link within a WebView and using one or more European country
    // codes.
    oauthStateId?: string;

    // Underlying component to render
    component?: C;

    // Props for underlying component
    componentProps?: P;

    // Note: onEvent is omitted here, to handle onEvent callbacks refer to
    // the documentation here: https://github.com/plaid/react-native-plaid-link-sdk#to-receive-onevent-callbacks
  }

  const PlaidLink: (
    props: PlaidLinkProps & { children: React.ReactNode },
  ) => JSX.Element;
  export default PlaidLink;

  interface OpenLinkProps {
    publicKey: string;
    onSuccess?: (metadata: OnSuccessMetadata) => void | null;
    onExit?: (metadata: OnExitMetadata) => void | null;
  }
  export function openLink(props: OpenLinkProps): Promise<void>;
}
