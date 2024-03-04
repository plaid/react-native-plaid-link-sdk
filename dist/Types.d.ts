/// <reference types="react" />
interface CommonPlaidLinkOptions {
    logLevel?: LinkLogLevel;
    extras?: Record<string, any>;
}
export type LinkTokenConfiguration = (CommonPlaidLinkOptions & {
    token: string;
    noLoadingState?: boolean;
});
export declare enum LinkLogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export declare enum PlaidEnvironment {
    PRODUCTION = "production",
    DEVELOPMENT = "development",
    SANDBOX = "sandbox"
}
export declare enum PlaidProduct {
    ASSETS = "assets",
    AUTH = "auth",
    DEPOSIT_SWITCH = "deposit_switch",
    IDENTITY = "identity",
    INCOME = "income",
    INVESTMENTS = "investments",
    LIABILITIES = "liabilities",
    LIABILITIES_REPORT = "liabilities_report",
    PAYMENT_INITIATION = "payment_initiation",
    TRANSACTIONS = "transactions"
}
export declare enum LinkAccountType {
    CREDIT = "credit",
    DEPOSITORY = "depository",
    INVESTMENT = "investment",
    LOAN = "loan",
    OTHER = "other"
}
export declare enum LinkAccountSubtypes {
    ALL = "all",
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
export interface LinkAccountSubtype {
}
export declare class LinkAccountSubtypeCredit implements LinkAccountSubtype {
    readonly type: LinkAccountType;
    readonly subtype: LinkAccountSubtype;
    static readonly ALL: LinkAccountSubtypeCredit;
    static readonly CREDIT_CARD: LinkAccountSubtypeCredit;
    static readonly PAYPAL: LinkAccountSubtypeCredit;
    private constructor();
}
export declare class LinkAccountSubtypeDepository implements LinkAccountSubtype {
    readonly type: LinkAccountType;
    readonly subtype: LinkAccountSubtype;
    static readonly ALL: LinkAccountSubtypeDepository;
    static readonly CASH_MANAGEMENT: LinkAccountSubtypeDepository;
    static readonly CD: LinkAccountSubtypeDepository;
    static readonly CHECKING: LinkAccountSubtypeDepository;
    static readonly EBT: LinkAccountSubtypeDepository;
    static readonly HSA: LinkAccountSubtypeDepository;
    static readonly MONEY_MARKET: LinkAccountSubtypeDepository;
    static readonly PAYPAL: LinkAccountSubtypeDepository;
    static readonly PREPAID: LinkAccountSubtypeDepository;
    static readonly SAVINGS: LinkAccountSubtypeDepository;
    private constructor();
}
export declare class LinkAccountSubtypeInvestment implements LinkAccountSubtype {
    readonly type: LinkAccountType;
    readonly subtype: LinkAccountSubtype;
    static readonly ALL: LinkAccountSubtypeInvestment;
    static readonly BROKERAGE: LinkAccountSubtypeInvestment;
    static readonly CASH_ISA: LinkAccountSubtypeInvestment;
    static readonly EDUCATION_SAVINGS_ACCOUNT: LinkAccountSubtypeInvestment;
    static readonly FIXED_ANNUNITY: LinkAccountSubtypeInvestment;
    static readonly GIC: LinkAccountSubtypeInvestment;
    static readonly HEALTH_REIMBURSEMENT_ARRANGEMENT: LinkAccountSubtypeInvestment;
    static readonly HSA: LinkAccountSubtypeInvestment;
    static readonly INVESTMENT_401A: LinkAccountSubtypeInvestment;
    static readonly INVESTMENT_401K: LinkAccountSubtypeInvestment;
    static readonly INVESTMENT_403B: LinkAccountSubtypeInvestment;
    static readonly INVESTMENT_457B: LinkAccountSubtypeInvestment;
    static readonly INVESTMENT_529: LinkAccountSubtypeInvestment;
    static readonly IRA: LinkAccountSubtypeInvestment;
    static readonly ISA: LinkAccountSubtypeInvestment;
    static readonly KEOGH: LinkAccountSubtypeInvestment;
    static readonly LIF: LinkAccountSubtypeInvestment;
    static readonly LIRA: LinkAccountSubtypeInvestment;
    static readonly LRIF: LinkAccountSubtypeInvestment;
    static readonly LRSP: LinkAccountSubtypeInvestment;
    static readonly MUTUAL_FUND: LinkAccountSubtypeInvestment;
    static readonly NON_TAXABLE_BROKERAGE_ACCOUNT: LinkAccountSubtypeInvestment;
    static readonly PENSION: LinkAccountSubtypeInvestment;
    static readonly PLAN: LinkAccountSubtypeInvestment;
    static readonly PRIF: LinkAccountSubtypeInvestment;
    static readonly PROFIT_SHARING_PLAN: LinkAccountSubtypeInvestment;
    static readonly RDSP: LinkAccountSubtypeInvestment;
    static readonly RESP: LinkAccountSubtypeInvestment;
    static readonly RETIREMENT: LinkAccountSubtypeInvestment;
    static readonly RLIF: LinkAccountSubtypeInvestment;
    static readonly ROTH: LinkAccountSubtypeInvestment;
    static readonly ROTH_401K: LinkAccountSubtypeInvestment;
    static readonly RRIF: LinkAccountSubtypeInvestment;
    static readonly RRSP: LinkAccountSubtypeInvestment;
    static readonly SARSEP: LinkAccountSubtypeInvestment;
    static readonly SEP_IRA: LinkAccountSubtypeInvestment;
    static readonly SIMPLE_IRA: LinkAccountSubtypeInvestment;
    static readonly SIIP: LinkAccountSubtypeInvestment;
    static readonly STOCK_PLAN: LinkAccountSubtypeInvestment;
    static readonly TFSA: LinkAccountSubtypeInvestment;
    static readonly THRIFT_SAVINGS_PLAN: LinkAccountSubtypeInvestment;
    static readonly TRUST: LinkAccountSubtypeInvestment;
    static readonly UGMA: LinkAccountSubtypeInvestment;
    static readonly UTMA: LinkAccountSubtypeInvestment;
    static readonly VARIABLE_ANNUITY: LinkAccountSubtypeInvestment;
    private constructor();
}
export declare class LinkAccountSubtypeLoan implements LinkAccountSubtype {
    readonly type: LinkAccountType;
    readonly subtype: LinkAccountSubtype;
    static readonly ALL: LinkAccountSubtypeLoan;
    static readonly AUTO: LinkAccountSubtypeLoan;
    static readonly BUSINESS: LinkAccountSubtypeLoan;
    static readonly COMMERCIAL: LinkAccountSubtypeLoan;
    static readonly CONSTRUCTION: LinkAccountSubtypeLoan;
    static readonly CONSUMER: LinkAccountSubtypeLoan;
    static readonly HOME_EQUITY: LinkAccountSubtypeLoan;
    static readonly LINE_OF_CREDIT: LinkAccountSubtypeLoan;
    static readonly LOAN: LinkAccountSubtypeLoan;
    static readonly MORTGAGE: LinkAccountSubtypeLoan;
    static readonly OVERDRAFT: LinkAccountSubtypeLoan;
    static readonly STUDENT: LinkAccountSubtypeLoan;
    private constructor();
}
export declare class LinkAccountSubtypeUnknown implements LinkAccountSubtype {
    readonly type: string;
    readonly subtype: string;
    constructor(type: string, subtype: string);
}
export interface LinkSuccess {
    publicToken: string;
    metadata: LinkSuccessMetadata;
}
export interface LinkSuccessMetadata {
    institution?: LinkInstitution;
    accounts: LinkAccount[];
    linkSessionId: string;
    metadataJson?: string;
}
export interface LinkAccount {
    id: string;
    name?: string;
    mask?: string;
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
    id: string;
    name: string;
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
    metadataJson?: string;
}
export declare enum LinkExitMetadataStatus {
    CONNECTED = "connected",
    CHOOSE_DEVICE = "choose_device",
    REQUIRES_ACCOUNT_SELECTION = "requires_account_selection",
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
    /** @deprecated DO NOT USE, data not guaranteed. Use `displayMessage` instead */
    errorDisplayMessage?: string;
    displayMessage?: string;
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
    TOO_MANY_VERIFICATION_ATTEMPTS = "TOO_MANY_VERIFICATION_ATTEMPTS",
    INVALD_UPDATED_USERNAME = "INVALD_UPDATED_USERNAME",
    INVALID_UPDATED_USERNAME = "INVALID_UPDATED_USERNAME",
    ITEM_NO_ERROR = "ITEM_NO_ERROR",
    item_no_error = "item-no-error",
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
    MICRODEPOSITS_ALREADY_VERIFIED = "MICRODEPOSITS_ALREADY_VERIFIED",
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
export type LinkEventListener = (linkEvent: LinkEvent) => void;
export interface LinkEvent {
    eventName: LinkEventName;
    metadata: LinkEventMetadata;
}
export interface LinkEventMetadata {
    accountNumberMask?: string;
    linkSessionId: string;
    mfaType?: string;
    requestId?: string;
    viewName: LinkEventViewName;
    errorCode?: string;
    errorMessage?: string;
    errorType?: string;
    exitStatus?: string;
    institutionId?: string;
    institutionName?: string;
    institutionSearchQuery?: string;
    isUpdateMode?: string;
    matchReason?: string;
    selection?: null | string;
    timestamp: string;
}
export declare enum LinkEventName {
    BANK_INCOME_INSIGHTS_COMPLETED = "BANK_INCOME_INSIGHTS_COMPLETED",
    CLOSE_OAUTH = "CLOSE_OAUTH",
    ERROR = "ERROR",
    EXIT = "EXIT",
    FAIL_OAUTH = "FAIL_OAUTH",
    HANDOFF = "HANDOFF",
    IDENTITY_VERIFICATION_START_STEP = "IDENTITY_VERIFICATION_START_STEP",
    IDENTITY_VERIFICATION_PASS_STEP = "IDENTITY_VERIFICATION_PASS_STEP",
    IDENTITY_VERIFICATION_FAIL_STEP = "IDENTITY_VERIFICATION_FAIL_STEP",
    IDENTITY_VERIFICATION_PENDING_REVIEW_STEP = "IDENTITY_VERIFICATION_PENDING_REVIEW_STEP",
    IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION = "IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION",
    IDENTITY_VERIFICATION_CREATE_SESSION = "IDENTITY_VERIFICATION_CREATE_SESSION",
    IDENTITY_VERIFICATION_RESUME_SESSION = "IDENTITY_VERIFICATION_RESUME_SESSION",
    IDENTITY_VERIFICATION_PASS_SESSION = "IDENTITY_VERIFICATION_PASS_SESSION",
    IDENTITY_VERIFICATION_FAIL_SESSION = "IDENTITY_VERIFICATION_FAIL_SESSION",
    IDENTITY_VERIFICATION_OPEN_UI = "IDENTITY_VERIFICATION_OPEN_UI",
    IDENTITY_VERIFICATION_RESUME_UI = "IDENTITY_VERIFICATION_RESUME_UI",
    IDENTITY_VERIFICATION_CLOSE_UI = "IDENTITY_VERIFICATION_CLOSE_UI",
    MATCHED_CONSENT = "MATCHED_CONSENT",
    MATCHED_SELECT_INSTITUTION = "MATCHED_SELECT_INSTITUTION",
    MATCHED_SELECT_VERIFY_METHOD = "MATCHED_SELECT_VERIFY_METHOD",
    OPEN = "OPEN",
    OPEN_MY_PLAID = "OPEN_MY_PLAID",
    OPEN_OAUTH = "OPEN_OAUTH",
    SEARCH_INSTITUTION = "SEARCH_INSTITUTION",
    SELECT_DEGRADED_INSTITUTION = "SELECT_DEGRADED_INSTITUTION",
    SELECT_DOWN_INSTITUTION = "SELECT_DOWN_INSTITUTION",
    SELECT_FILTERED_INSTITUTION = "SELECT_FILTERED_INSTITUTION",
    SELECT_INSTITUTION = "SELECT_INSTITUTION",
    SELECT_BRAND = "SELECT_BRAND",
    SELECT_AUTH_TYPE = "SELECT_AUTH_TYPE",
    SUBMIT_ACCOUNT_NUMBER = "SUBMIT_ACCOUNT_NUMBER",
    SUBMIT_DOCUMENTS = "SUBMIT_DOCUMENTS",
    SUBMIT_DOCUMENTS_SUCCESS = "SUBMIT_DOCUMENTS_SUCCESS",
    SUBMIT_DOCUMENTS_ERROR = "SUBMIT_DOCUMENTS_ERROR",
    SUBMIT_ROUTING_NUMBER = "SUBMIT_ROUTING_NUMBER",
    VIEW_DATA_TYPES = "VIEW_DATA_TYPES",
    SUBMIT_PHONE = "SUBMIT_PHONE",
    SKIP_SUBMIT_PHONE = "SKIP_SUBMIT_PHONE",
    VERIFY_PHONE = "VERIFY_PHONE",
    SUBMIT_CREDENTIALS = "SUBMIT_CREDENTIALS",
    SUBMIT_MFA = "SUBMIT_MFA",
    TRANSITION_VIEW = "TRANSITION_VIEW",
    CONNECT_NEW_INSTITUTION = "CONNECT_NEW_INSTITUTION"
}
export declare enum LinkEventViewName {
    ACCEPT_TOS = "ACCEPT_TOS",
    CONNECTED = "CONNECTED",
    CONSENT = "CONSENT",
    CREDENTIAL = "CREDENTIAL",
    DATA_TRANSPARENCY = "DATA_TRANSPARENCY",
    DATA_TRANSPARENCY_CONSENT = "DATA_TRANSPARENCY_CONSENT",
    DOCUMENTARY_VERIFICATION = "DOCUMENTARY_VERIFICATION",
    ERROR = "ERROR",
    EXIT = "EXIT",
    KYC_CHECK = "KYC_CHECK",
    SELFIE_CHECK = "SELFIE_CHECK",
    LOADING = "LOADING",
    MATCHED_CONSENT = "MATCHED_CONSENT",
    MATCHED_CREDENTIAL = "MATCHED_CREDENTIAL",
    MATCHED_MFA = "MATCHED_MFA",
    MFA = "MFA",
    NUMBERS = "NUMBERS",
    NUMBERS_SELECT_INSTITUTION = "NUMBERS_SELECT_INSTITUTION",
    OAUTH = "OAUTH",
    RECAPTCHA = "RECAPTCHA",
    RISK_CHECK = "RISK_CHECK",
    SCREENING = "SCREENING",
    SELECT_ACCOUNT = "SELECT_ACCOUNT",
    SELECT_AUTH_TYPE = "SELECT_AUTH_TYPE",
    SUBMIT_PHONE = "SUBMIT_PHONE",
    VERIFY_PHONE = "VERIFY_PHONE",
    SELECT_SAVED_INSTITUTION = "SELECT_SAVED_INSTITUTION",
    SELECT_SAVED_ACCOUNT = "SELECT_SAVED_ACCOUNT",
    SELECT_BRAND = "SELECT_BRAND",
    SELECT_INSTITUTION = "SELECT_INSTITUTION",
    SUBMIT_DOCUMENTS = "SUBMIT_DOCUMENTS",
    SUBMIT_DOCUMENTS_SUCCESS = "SUBMIT_DOCUMENTS_SUCCESS",
    SUBMIT_DOCUMENTS_ERROR = "SUBMIT_DOCUMENTS_ERROR",
    UPLOAD_DOCUMENTS = "UPLOAD_DOCUMENTS",
    VERIFY_SMS = "VERIFY_SMS"
}
export declare enum LinkIOSPresentationStyle {
    FULL_SCREEN = "FULL_SCREEN",
    MODAL = "MODAL"
}
export type LinkSuccessListener = (LinkSuccess: LinkSuccess) => void;
export type LinkExitListener = (LinkExit: LinkExit) => void;
export type LinkOnEventListener = (LinkEvent: LinkEvent) => void;
export interface PlaidLinkProps {
    tokenConfig: LinkTokenConfiguration;
    onSuccess: LinkSuccessListener;
    onExit?: LinkExitListener;
    iOSPresentationStyle?: LinkIOSPresentationStyle;
    logLevel?: LinkLogLevel;
    onPress?(): any;
}
export type PlaidLinkComponentProps = (PlaidLinkProps & {
    children: React.ReactNode;
});
export {};
