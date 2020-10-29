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
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
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

export enum LinkAccountType {
    CREDIT = 'credit',
    DEPOSITORY = 'depository',
    INVESTMENT = 'investment',
    LOAN = 'loan',
    OTHER = 'other'
}

export enum LinkAccountSubtype {
    CREDIT_CARD = 'credit card',
    PAYPAL = 'paypal',
    AUTO = 'auto',
    BUSINESS = 'business',
    COMMERCIAL = 'commercial',
    CONSTRUCTION = 'construction',
    CONSUMER = 'consumer',
    HOME_EQUITY = 'home equity',
    LINE_OF_CREDIT = 'line of credit',
    LOAN = 'loan',
    MORTGAGE = 'mortgage',
    OVERDRAFT = 'overdraft',
    STUDENT = 'student',
    CASH_MANAGEMENT = 'cash management',
    CD = 'cd',
    CHECKING = 'checking',
    EBT = 'ebt',
    HSA = 'hsa',
    MONEY_MARKET = 'money market',
    PREPAID = 'prepaid',
    SAVINGS = 'savings',
    FOUR_0_1_A = '401a',
    FOUR_0_1_K = '401k',
    FOUR_0_3_B = '403B',
    FOUR_5_7_B = '457b',
    FIVE_2_9 = '529',
    BROKERAGE = 'brokerage',
    CASH_ISA = 'cash isa',
    EDUCATION_SAVINGS_ACCOUNT = 'education savings account',
    FIXED_ANNUNITY = 'fixed annuity',
    GIC = 'gic',
    HEALTH_REIMBURSEMENT_ARRANGEMENT = 'health reimbursement arrangement',
    IRA = 'ira',
    ISA = 'isa',
    KEOGH = 'keogh',
    LIF = 'lif',
    LIRA = 'lira',
    LRIF = 'lrif',
    LRSP = 'lrsp',
    MUTUAL_FUND = 'mutual fund',
    NON_TAXABLE_BROKERAGE_ACCOUNT = 'non-taxable brokerage account',
    PENSION = 'pension',
    PLAN = 'plan',
    PRIF = 'prif',
    PROFIT_SHARING_PLAN = 'profit sharing plan',
    RDSP = 'rdsp',
    RESP = 'resp',
    RETIREMENT = 'retirement',
    RLIF = 'rlif',
    ROTH_401K = 'roth 401k',
    ROTH = 'roth',
    RRIF = 'rrif',
    RRSP = 'rrsp',
    SARSEP = 'sarsep',
    SEP_IRA = 'sep ira',
    SIMPLE_IRA = 'simple ira',
    SIPP = 'sipp',
    STOCK_PLAN = 'stock plan',
    TFSA = 'tfsa',
    THRIFT_SAVINGS_PLAN = 'thrift savings plan',
    TRUST = 'trust',
    UGMA = 'ugma',
    UTMA = 'utma',
    VARIABLE_ANNUITY = 'variable annuity',
}
export interface LinkSuccess {
    publicToken: string;
    metadata: LinkSuccessMetadata;
}

export interface LinkSuccessMetadata {
    institution?: LinkInstitution;
    accounts: LinkAccount[];
    linkSessionId: String;
    metadataJson: String;
}

export interface LinkAccount {
    id: String;
    name?: String;
    mask?: String;
    type: LinkAccountType;
    subtype: LinkAccountSubtype;
    verificationStatus: LinkAccountVerificationStatus;
}

export enum LinkAccountVerificationStatus {
    PENDING_AUTOMATIC_VERIFICATION = 'pending_automatic_verification',
    PENDING_MANUAL_VERIFICATION = 'pending_manual_verification',
    MANUALLY_VERIFIED = 'manually_verified',
}

export interface LinkInstitution {
    id: String;
    name: String;
}