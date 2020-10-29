import { LinkAccountSubtype } from "./AccountSubtypes";

interface CommonPlaidLinkOptions {
    onSuccess: Function;
    onExit?: Function;
    logLevel?: LinkLogLevel;
    extraParams?: Record<string, any>;
  }

  export type LinkTokenConfiguration = (CommonPlaidLinkOptions & {
    token: string; 
  });

  export type LinkPublicKeyConfiguration = (CommonPlaidLinkOptions & {
    publicKey: string;
    token?: string;
    clientName: string;
    environment: PlaidEnvironment;
    product: Array<PlaidProduct>;
    countryCodes?: Array<string>;
    language?: string;
    userEmailAddress?: string;
    userLegalName?: string;
    webhook?: string;
    linkCustomizationName?: string;
    accountSubtypes?: Array<LinkAccountSubtype>;
    oauthNonce?: string;
    oauthRedirectUri?: string;
    oauthStateId?: string;
  });
   
  export enum LinkLogLevel {
    ERROR,
    WARN,
    INFO,
    DEBUG,
  }
  
  export enum PlaidEnvironment {
    PRODUCTION='production',
    DEVELOPMENT='development',
    SANDBOX = 'sandbox'
  }
   
  export enum PlaidProduct {
    ASSETS,
    AUTH,
    IDENTITY,
    INCOME,
    INVESTMENTS,
    LIABILITIES,
    LIABILITIES_REPORT,
    PAYMENT_INITIATION,
    TRANSACTIONS
  }
