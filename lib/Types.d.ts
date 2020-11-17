/// <reference types="react" />
interface CommonPlaidLinkOptions {
    logLevel?: LinkLogLevel;
    extraParams?: Record<string, any>;
}
export declare type LinkTokenConfiguration = (CommonPlaidLinkOptions & {
    token: string;
});
export declare type LinkPublicKeyConfiguration = (CommonPlaidLinkOptions & {
    token?: string;
    publicKey?: string;
    clientName: string;
    environment: PlaidEnvironment;
    products: Array<PlaidProduct>;
    language: string;
    countryCodes: Array<string>;
    webhook?: string;
    userLegalName?: string;
    userEmailAddress?: string;
    userPhoneNumber?: string;
    linkCustomizationName?: string;
    accountSubtypes?: Array<LinkAccountSubtype>;
    oauthConfiguration?: OAuthConfiguration;
});
export interface OAuthConfiguration {
    oauthNonce?: string;
    oauthRedirectUri?: string;
    oauthStateId?: string;
}
export declare enum LinkLogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare enum PlaidEnvironment {
    PRODUCTION = "production",
    DEVELOPMENT = "development",
    SANDBOX = "sandbox"
}
export declare enum PlaidProduct {
    ASSETS = 0,
    AUTH = 1,
    IDENTITY = 2,
    INCOME = 3,
    INVESTMENTS = 4,
    LIABILITIES = 5,
    LIABILITIES_REPORT = 6,
    PAYMENT_INITIATION = 7,
    TRANSACTIONS = 8
}
export declare enum LinkAccountType {
    CREDIT = "credit",
    DEPOSITORY = "depository",
    INVESTMENT = "investment",
    LOAN = "loan",
    OTHER = "other"
}
export declare enum LinkAccountSubtype {
    CREDIT_CARD = "credit card",
    PAYPAL = "paypal",
    AUTO = "auto",
    BUSINESS = "business",
    COMMERCIAL = "commercial",
    CONSTRUCTION = "construction",
    CONSUMER = "consumer",
    HOME_EQUITY = "home equity",
    LINE_OF_CREDIT = "line of credit",
    LOAN = "loan",
    MORTGAGE = "mortgage",
    OVERDRAFT = "overdraft",
    STUDENT = "student",
    CASH_MANAGEMENT = "cash management",
    CD = "cd",
    CHECKING = "checking",
    EBT = "ebt",
    HSA = "hsa",
    MONEY_MARKET = "money market",
    PREPAID = "prepaid",
    SAVINGS = "savings",
    FOUR_0_1_A = "401a",
    FOUR_0_1_K = "401k",
    FOUR_0_3_B = "403B",
    FOUR_5_7_B = "457b",
    FIVE_2_9 = "529",
    BROKERAGE = "brokerage",
    CASH_ISA = "cash isa",
    EDUCATION_SAVINGS_ACCOUNT = "education savings account",
    FIXED_ANNUNITY = "fixed annuity",
    GIC = "gic",
    HEALTH_REIMBURSEMENT_ARRANGEMENT = "health reimbursement arrangement",
    IRA = "ira",
    ISA = "isa",
    KEOGH = "keogh",
    LIF = "lif",
    LIRA = "lira",
    LRIF = "lrif",
    LRSP = "lrsp",
    MUTUAL_FUND = "mutual fund",
    NON_TAXABLE_BROKERAGE_ACCOUNT = "non-taxable brokerage account",
    PENSION = "pension",
    PLAN = "plan",
    PRIF = "prif",
    PROFIT_SHARING_PLAN = "profit sharing plan",
    RDSP = "rdsp",
    RESP = "resp",
    RETIREMENT = "retirement",
    RLIF = "rlif",
    ROTH_401K = "roth 401k",
    ROTH = "roth",
    RRIF = "rrif",
    RRSP = "rrsp",
    SARSEP = "sarsep",
    SEP_IRA = "sep ira",
    SIMPLE_IRA = "simple ira",
    SIPP = "sipp",
    STOCK_PLAN = "stock plan",
    TFSA = "tfsa",
    THRIFT_SAVINGS_PLAN = "thrift savings plan",
    TRUST = "trust",
    UGMA = "ugma",
    UTMA = "utma",
    VARIABLE_ANNUITY = "variable annuity"
}
export interface LinkSuccess {
    publicToken: string;
    metadata: LinkSuccessMetadata;
}
export interface LinkSuccessMetadata {
    institution?: LinkInstitution;
    accounts: LinkAccount[];
    linkSessionId: String;
    metadataJson?: String;
}
export interface LinkAccount {
    id: String;
    name?: String;
    mask?: String;
    type: LinkAccountType;
    subtype: LinkAccountSubtype;
    verificationStatus?: LinkAccountVerificationStatus;
}
export declare enum LinkAccountVerificationStatus {
    PENDING_AUTOMATIC_VERIFICATION = "pending_automatic_verification",
    PENDING_MANUAL_VERIFICATION = "pending_manual_verification",
    MANUALLY_VERIFIED = "manually_verified"
}
export interface LinkInstitution {
    id: String;
    name: String;
}
export interface LinkExit {
    error?: LinkError;
    metadata: LinkExitMetadata;
}
export interface LinkExitMetadata {
    status?: LinkExitMetadataStatus;
    institution?: LinkInstitution;
    linkSessionId: string;
    requestId: string;
    metadataJson?: String;
}
export declare enum LinkExitMetadataStatus {
    CONNECTED = "connected",
    CHOOSE_DEVICE = "choose_device",
    REQUIRES_CODE = "requires_code",
    REQUIRES_CREDENTIALS = "requires_credentials",
    REQUIRES_EXTERNAL_ACTION = "requires_external_action",
    REQUIRES_OAUTH = "requires_oauth",
    REQUIRES_QUESTIONS = "requires_questions",
    REQUIRES_RECAPTCHA = "requires_recaptcha",
    REQUIRES_SELECTIONS = "requires_selections",
    REQUIRES_DEPOSIT_SWITCH_ALLOCATION_CONFIGURATION = "requires_deposit_switch_allocation_configuration",
    REQUIRES_DEPOSIT_SWITCH_ALLOCATION_SELECTION = "requires_deposit_switch_allocation_selection"
}
export interface LinkError {
    errorCode: LinkErrorCode;
    errorType: LinkErrorType;
    errorMessage: string;
    errorDisplayMessage?: string;
    errorJson?: string;
}
export declare enum LinkErrorCode {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    INVALID_MFA = "INVALID_MFA",
    ITEM_LOGIN_REQUIRED = "ITEM_LOGIN_REQUIRED",
    INSUFFICIENT_CREDENTIALS = "INSUFFICIENT_CREDENTIALS",
    ITEM_LOCKED = "ITEM_LOCKED",
    USER_SETUP_REQUIRED = "USER_SETUP_REQUIRED",
    MFA_NOT_SUPPORTED = "MFA_NOT_SUPPORTED",
    INVALID_SEND_METHOD = "INVALID_SEND_METHOD",
    NO_ACCOUNTS = "NO_ACCOUNTS",
    ITEM_NOT_SUPPORTED = "ITEM_NOT_SUPPORTED",
    INVALD_UPDATED_USERNAME = "INVALD_UPDATED_USERNAME",
    ITEM_NO_ERROR = "ITEM_NO_ERROR",
    NO_AUTH_ACCOUNTS = "NO_AUTH_ACCOUNTS",
    NO_INVESTMENT_ACCOUNTS = "NO_INVESTMENT_ACCOUNTS",
    NO_INVESTMENT_AUTH_ACCOUNTS = "NO_INVESTMENT_AUTH_ACCOUNTS",
    NO_LIABILITY_ACCOUNTS = "NO_LIABILITY_ACCOUNTS",
    PRODUCTS_NOT_SUPPORTED = "PRODUCTS_NOT_SUPPORTED",
    ITEM_NOT_FOUND = "ITEM_NOT_FOUND",
    ITEM_PRODUCT_NOT_READY = "ITEM_PRODUCT_NOT_READY",
    INSTITUTION_DOWN = "INSTITUTION_DOWN",
    INSTITUTION_NOT_RESPONDING = "INSTITUTION_NOT_RESPONDING",
    INSTITUTION_NOT_AVAILABLE = "INSTITUTION_NOT_AVAILABLE",
    INSTITUTION_NO_LONGER_SUPPORTED = "INSTITUTION_NO_LONGER_SUPPORTED",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    PLANNED_MAINTENANCE = "PLANNED_MAINTENANCE",
    PRODUCT_NOT_ENABLED = "PRODUCT_NOT_ENABLED",
    DATA_UNAVAILABLE = "DATA_UNAVAILABLE",
    ASSET_PRODUCT_NOT_READY = "ASSET_PRODUCT_NOT_READY",
    ASSET_REPORT_GENERATION_FAILED = "ASSET_REPORT_GENERATION_FAILED",
    INVALID_PARENT = "INVALID_PARENT",
    INSIGHTS_NOT_ENABLED = "INSIGHTS_NOT_ENABLED",
    INSIGHTS_PREVIOUSLY_NOT_ENABLED = "INSIGHTS_PREVIOUSLY_NOT_ENABLED",
    BANK_TRANSFER_LIMIT_EXCEEDED = "BANK_TRANSFER_LIMIT_EXCEEDED",
    BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT = "BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT",
    BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT = "BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT",
    BANK_TRANSFER_ACCOUNT_BLOCKED = "BANK_TRANSFER_ACCOUNT_BLOCKED",
    BANK_TRANSFER_INSUFFICIENT_FUNDS = "BANK_TRANSFER_INSUFFICIENT_FUNDS",
    BANK_TRANSFER_NOT_CANCELLABLE = "BANK_TRANSFER_NOT_CANCELLABLE",
    BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE = "BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE",
    BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT = "BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT",
    SANDBOX_PRODUCT_NOT_ENABLED = "SANDBOX_PRODUCT_NOT_ENABLED",
    SANDBOX_WEBHOOK_INVALID = "SANDBOX_WEBHOOK_INVALID",
    SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID = "SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID",
    MISSING_FIELDS = "MISSING_FIELDS",
    UNKNOWN_FIELDS = "UNKNOWN_FIELDS",
    INVALID_FIELD = "INVALID_FIELD",
    INCOMPATIBLE_API_VERSION = "INCOMPATIBLE_API_VERSION",
    INVALID_BODY = "INVALID_BODY",
    INVALID_HEADERS = "INVALID_HEADERS",
    NOT_FOUND = "NOT_FOUND",
    NO_LONGER_AVAILABLE = "NO_LONGER_AVAILABLE",
    SANDBOX_ONLY = "SANDBOX_ONLY",
    INVALID_ACCOUNT_NUMBER = "INVALID_ACCOUNT_NUMBER",
    INCORRECT_DEPOSIT_AMOUNTS = "INCORRECT_DEPOSIT_AMOUNTS",
    UNAUTHORIZED_ENVIRONMENT = "UNAUTHORIZED_ENVIRONMENT",
    INVALID_PRODUCT = "INVALID_PRODUCT",
    UNAUTHORIZED_ROUTE_ACCESS = "UNAUTHORIZED_ROUTE_ACCESS",
    DIRECT_INTEGRATION_NOT_ENABLED = "DIRECT_INTEGRATION_NOT_ENABLED",
    INVALID_API_KEYS = "INVALID_API_KEYS",
    INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
    INVALID_PUBLIC_TOKEN = "INVALID_PUBLIC_TOKEN",
    INVALID_LINK_TOKEN = "INVALID_LINK_TOKEN",
    INVALID_PROCESSOR_TOKEN = "INVALID_PROCESSOR_TOKEN",
    INVALID_AUDIT_COPY_TOKEN = "INVALID_AUDIT_COPY_TOKEN",
    INVALID_ACCOUNT_ID = "INVALID_ACCOUNT_ID",
    PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA = "PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA",
    ACCOUNTS_LIMIT = "ACCOUNTS_LIMIT",
    ADDITION_LIMIT = "ADDITION_LIMIT",
    AUTH_LIMIT = "AUTH_LIMIT",
    BALANCE_LIMIT = "BALANCE_LIMIT",
    IDENTITY_LIMIT = "IDENTITY_LIMIT",
    ITEM_GET_LIMIT = "ITEM_GET_LIMIT",
    RATE_LIMIT = "RATE_LIMIT",
    TRANSACTIONS_LIMIT = "TRANSACTIONS_LIMIT",
    RECAPTCHA_REQUIRED = "RECAPTCHA_REQUIRED",
    RECAPTCHA_BAD = "RECAPTCHA_BAD",
    INCORRECT_OAUTH_NONCE = "INCORRECT_OAUTH_NONCE",
    OAUTH_STATE_ID_ALREADY_PROCESSED = "OAUTH_STATE_ID_ALREADY_PROCESSED"
}
export declare enum LinkErrorType {
    BANK_TRANSFER = "BANK_TRANSFER_ERROR",
    INVALID_REQUEST = "INVALID_REQUEST",
    INVALID_RESULT = "INVALID_RESULT",
    INVALID_INPUT = "INVALID_INPUT",
    INSTITUTION_ERROR = "INSTITUTION_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    API_ERROR = "API_ERROR",
    ITEM_ERROR = "ITEM_ERROR",
    AUTH_ERROR = "AUTH_ERROR",
    ASSET_REPORT_ERROR = "ASSET_REPORT_ERROR",
    SANDBOX_ERROR = "SANDBOX_ERROR",
    RECAPTCHA_ERROR = "RECAPTCHA_ERROR",
    OAUTH_ERROR = "OAUTH_ERROR"
}
export declare type LinkEventListener = (linkEvent: LinkEvent) => void;
export interface LinkEvent {
    eventName: LinkEventName;
    metadata: LinkEventMetadata;
}
export interface LinkEventMetadata {
    linkSessionId: string;
    mfaType: string;
    requestId?: string;
    viewName: LinkEventViewName;
    errorCode: string;
    errorMessage: string;
    errorType: string;
    exitStatus: string;
    institutionId: string;
    institutionName: string;
    institutionSearchQuery: string;
    timestamp: string;
}
export declare enum LinkEventName {
    CLOSE_OAUTH = "close_oauth",
    ERROR = "error",
    EXIT = "exit",
    FAIL_OAUTH = "fail_oauth",
    HANDOFF = "handoff",
    MATCHED_CONSENT = "matched_consent",
    MATCHED_SELECT_INSTITUTION = "matched_select_institution",
    OPEN = "open",
    OPEN_MY_PLAID = "open_my_plaid",
    OPEN_OAUTH = "open_oauth",
    SEARCH_INSTITUTION = "search_institution",
    SELECT_INSTITUTION = "select_institution",
    SUBMIT_CREDENTIALS = "submit_credentials",
    SUBMIT_MFA = "submit_mfa",
    TRANSITION_VIEW = "transition_view"
}
export declare enum LinkEventViewName {
    CONNECTED = "CONNECTED",
    CONSENT = "CONSENT",
    CREDENTIAL = "CREDENTIAL",
    ERROR = "ERROR",
    EXIT = "EXIT",
    LOADING = "LOADING",
    MFA = "MFA",
    NUMBERS = "NUMBERS",
    RECAPTCHA = "RECAPTCHA",
    SELECT_ACCOUNT = "SELECT_ACCOUNT",
    SELECT_INSTITUTION = "SELECT_INSTITUTION"
}
export declare type LinkSuccessListener = (LinkSuccess: LinkSuccess) => void;
export declare type LinkExitListener = (LinkExit: LinkExit) => void;
export declare type PlaidLinkConfiguration = LinkTokenConfiguration | LinkPublicKeyConfiguration;
export interface PlaidLinkProps {
    tokenConfig?: LinkTokenConfiguration;
    publicKeyConfig?: LinkPublicKeyConfiguration;
    onSuccess: LinkSuccessListener;
    onExit?: LinkExitListener;
    children: React.ReactNode;
}
export {};
