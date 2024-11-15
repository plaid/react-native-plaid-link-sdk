interface CommonPlaidLinkOptions {
    logLevel?: LinkLogLevel;
    extras?: Record<string, any>;
}

export type LinkTokenConfiguration = (CommonPlaidLinkOptions & {
    token: string;
    // A `Bool` indicating that Link should skip displaying a loading animation until the Link UI is fully loaded.
    // This can be used to display custom loading UI while Link content is loading (and will skip any initial loading UI in Link).
    // Note: Dismiss custom loading UI on the OPEN & EXIT events.
    //
    // Note: This should be set to `true` when setting the `eu_config.headless` field in /link/token/create requests to `true`.
    // For reference, see https://plaid.com/docs/api/tokens/#link-token-create-request-eu-config-headless
    noLoadingState?: boolean;
});

export enum LinkLogLevel {
    DEBUG="debug",
    INFO="info",
    WARN="warn",
    ERROR="error",
}

export enum PlaidEnvironment {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
    SANDBOX = 'sandbox',
}

export enum PlaidProduct {
    ASSETS="assets",
    AUTH="auth",
    DEPOSIT_SWITCH="deposit_switch",
    IDENTITY="identity",
    INCOME="income",
    INVESTMENTS="investments",
    LIABILITIES="liabilities",
    LIABILITIES_REPORT="liabilities_report",
    PAYMENT_INITIATION="payment_initiation",
    TRANSACTIONS="transactions",
}

export enum LinkAccountType {
    CREDIT = 'credit',
    DEPOSITORY = 'depository',
    INVESTMENT = 'investment',
    LOAN = 'loan',
    OTHER = 'other',
}

export enum LinkAccountSubtypes {
    ALL = 'all',
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
    VARIABLE_ANNUITY = 'variable annuity'
}

export interface LinkAccountSubtype {
}

export class LinkAccountSubtypeCredit implements LinkAccountSubtype {
    public static readonly ALL = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtypes.ALL);
    public static readonly CREDIT_CARD = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtypes.CREDIT_CARD);
    public static readonly PAYPAL = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtypes.PAYPAL);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeDepository implements LinkAccountSubtype {
    public static readonly ALL = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.ALL);
    public static readonly CASH_MANAGEMENT = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.CASH_MANAGEMENT);
    public static readonly CD = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.CD);
    public static readonly CHECKING = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.CHECKING);
    public static readonly EBT = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.EBT);
    public static readonly HSA = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.HSA);
    public static readonly MONEY_MARKET = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.MONEY_MARKET);
    public static readonly PAYPAL = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.PAYPAL);
    public static readonly PREPAID = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.PREPAID);
    public static readonly SAVINGS = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtypes.SAVINGS);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeInvestment implements LinkAccountSubtype {
    public static readonly ALL = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.ALL);
    public static readonly BROKERAGE = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.BROKERAGE);
    public static readonly CASH_ISA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.CASH_ISA);
    public static readonly EDUCATION_SAVINGS_ACCOUNT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.EDUCATION_SAVINGS_ACCOUNT);
    public static readonly FIXED_ANNUNITY = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FIXED_ANNUNITY);
    public static readonly GIC = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.GIC);
    public static readonly HEALTH_REIMBURSEMENT_ARRANGEMENT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.HEALTH_REIMBURSEMENT_ARRANGEMENT);
    public static readonly HSA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.HSA);
    public static readonly INVESTMENT_401A = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FOUR_0_1_A);
    public static readonly INVESTMENT_401K = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FOUR_0_1_K);
    public static readonly INVESTMENT_403B = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FOUR_0_3_B);
    public static readonly  INVESTMENT_457B = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FOUR_5_7_B);
    public static readonly INVESTMENT_529 = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.FIVE_2_9);
    public static readonly IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.IRA);
    public static readonly ISA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.ISA);
    public static readonly KEOGH = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.KEOGH);
    public static readonly LIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.LIF);
    public static readonly LIRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.LIRA);
    public static readonly LRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.LRIF);
    public static readonly LRSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.LRSP);
    public static readonly MUTUAL_FUND = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.MUTUAL_FUND);
    public static readonly NON_TAXABLE_BROKERAGE_ACCOUNT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.NON_TAXABLE_BROKERAGE_ACCOUNT);
    public static readonly PENSION = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.PENSION);
    public static readonly PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.PLAN);
    public static readonly PRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.PRIF);
    public static readonly PROFIT_SHARING_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.PROFIT_SHARING_PLAN);
    public static readonly RDSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RDSP);
    public static readonly RESP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RESP);
    public static readonly RETIREMENT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RETIREMENT);
    public static readonly RLIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RLIF);
    public static readonly ROTH = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.ROTH);
    public static readonly ROTH_401K = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.ROTH_401K);
    public static readonly RRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RRIF);
    public static readonly RRSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.RRSP);
    public static readonly SARSEP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.SARSEP);
    public static readonly SEP_IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.SEP_IRA);
    public static readonly SIMPLE_IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.SIMPLE_IRA);
    public static readonly SIIP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.SIPP);
    public static readonly STOCK_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.STOCK_PLAN);
    public static readonly TFSA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.TFSA);
    public static readonly THRIFT_SAVINGS_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.THRIFT_SAVINGS_PLAN);
    public static readonly TRUST = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.TRUST);
    public static readonly UGMA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.UGMA);
    public static readonly UTMA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.UTMA);
    public static readonly VARIABLE_ANNUITY = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtypes.VARIABLE_ANNUITY);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeLoan implements LinkAccountSubtype {
    public static readonly ALL = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.ALL);
    public static readonly AUTO = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.AUTO);
    public static readonly BUSINESS = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.BUSINESS);
    public static readonly COMMERCIAL = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.COMMERCIAL);
    public static readonly CONSTRUCTION = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.CONSTRUCTION);
    public static readonly CONSUMER = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.CONSUMER);
    public static readonly HOME_EQUITY = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.HOME_EQUITY);
    public static readonly LINE_OF_CREDIT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.LINE_OF_CREDIT);
    public static readonly LOAN = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.LOAN);
    public static readonly MORTGAGE = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.MORTGAGE);
    public static readonly OVERDRAFT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.OVERDRAFT);
    public static readonly STUDENT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtypes.STUDENT);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeUnknown implements LinkAccountSubtype {
    constructor(public readonly type: string, public readonly subtype: string) { }
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

export enum LinkAccountVerificationStatus {
    PENDING_AUTOMATIC_VERIFICATION = 'pending_automatic_verification',
    PENDING_MANUAL_VERIFICATION = 'pending_manual_verification',
    MANUALLY_VERIFIED = 'manually_verified',
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

export enum LinkExitMetadataStatus {
    CONNECTED = 'connected',
    CHOOSE_DEVICE = 'choose_device',
    REQUIRES_ACCOUNT_SELECTION = 'requires_account_selection',
    REQUIRES_CODE = 'requires_code',
    REQUIRES_CREDENTIALS = 'requires_credentials',
    REQUIRES_EXTERNAL_ACTION = 'requires_external_action',
    REQUIRES_OAUTH = 'requires_oauth',
    REQUIRES_QUESTIONS = 'requires_questions',
    REQUIRES_RECAPTCHA = 'requires_recaptcha',
    REQUIRES_SELECTIONS = 'requires_selections',
    REQUIRES_DEPOSIT_SWITCH_ALLOCATION_CONFIGURATION = 'requires_deposit_switch_allocation_configuration',
    REQUIRES_DEPOSIT_SWITCH_ALLOCATION_SELECTION = 'requires_deposit_switch_allocation_selection',
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

export enum LinkErrorCode {
    // ITEM_ERROR
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

    // INSTITUTION_ERROR
    INSTITUTION_DOWN = "INSTITUTION_DOWN",
    INSTITUTION_NOT_RESPONDING = "INSTITUTION_NOT_RESPONDING",
    INSTITUTION_NOT_AVAILABLE = "INSTITUTION_NOT_AVAILABLE",
    INSTITUTION_NO_LONGER_SUPPORTED = "INSTITUTION_NO_LONGER_SUPPORTED",

    // API_ERROR
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    PLANNED_MAINTENANCE = "PLANNED_MAINTENANCE",

    // ASSET_REPORT_ERROR
    PRODUCT_NOT_ENABLED = "PRODUCT_NOT_ENABLED",
    DATA_UNAVAILABLE = "DATA_UNAVAILABLE",
    ASSET_PRODUCT_NOT_READY = "ASSET_PRODUCT_NOT_READY",
    ASSET_REPORT_GENERATION_FAILED = "ASSET_REPORT_GENERATION_FAILED",
    INVALID_PARENT = "INVALID_PARENT",
    INSIGHTS_NOT_ENABLED = "INSIGHTS_NOT_ENABLED",
    INSIGHTS_PREVIOUSLY_NOT_ENABLED = "INSIGHTS_PREVIOUSLY_NOT_ENABLED",

    // BANK_TRANSFER_ERROR
    BANK_TRANSFER_LIMIT_EXCEEDED = "BANK_TRANSFER_LIMIT_EXCEEDED",
    BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT = "BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT",
    BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT = "BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT",
    BANK_TRANSFER_ACCOUNT_BLOCKED = "BANK_TRANSFER_ACCOUNT_BLOCKED",
    BANK_TRANSFER_INSUFFICIENT_FUNDS = "BANK_TRANSFER_INSUFFICIENT_FUNDS",
    BANK_TRANSFER_NOT_CANCELLABLE = "BANK_TRANSFER_NOT_CANCELLABLE",
    BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE = "BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE",
    BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT = "BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT",

    // SANDBOX_ERROR
    SANDBOX_PRODUCT_NOT_ENABLED = "SANDBOX_PRODUCT_NOT_ENABLED",
    SANDBOX_WEBHOOK_INVALID = "SANDBOX_WEBHOOK_INVALID",
    SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID = "SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID",

    // INVALID_REQUEST
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

    // INVALID_INPUT
    // From above ITEM_LOGIN_REQUIRED = "INVALID_CREDENTIALS",
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

    // INVALID_RESULT
    PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA = "PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA",

    // RATE_LIMIT_EXCEEDED
    ACCOUNTS_LIMIT = "ACCOUNTS_LIMIT",
    ADDITION_LIMIT = "ADDITION_LIMIT",
    AUTH_LIMIT = "AUTH_LIMIT",
    BALANCE_LIMIT = "BALANCE_LIMIT",
    IDENTITY_LIMIT = "IDENTITY_LIMIT",
    ITEM_GET_LIMIT = "ITEM_GET_LIMIT",
    RATE_LIMIT = "RATE_LIMIT",
    TRANSACTIONS_LIMIT = "TRANSACTIONS_LIMIT",

    // RECAPTCHA_ERROR
    RECAPTCHA_REQUIRED = "RECAPTCHA_REQUIRED",
    RECAPTCHA_BAD = "RECAPTCHA_BAD",

    // OAUTH_ERROR
    INCORRECT_OAUTH_NONCE = "INCORRECT_OAUTH_NONCE",
    OAUTH_STATE_ID_ALREADY_PROCESSED = "OAUTH_STATE_ID_ALREADY_PROCESSED",
}

export enum LinkErrorType {
    BANK_TRANSFER = 'BANK_TRANSFER_ERROR',
    INVALID_REQUEST = 'INVALID_REQUEST',
    INVALID_RESULT = 'INVALID_RESULT',
    INVALID_INPUT = 'INVALID_INPUT',
    INSTITUTION_ERROR = 'INSTITUTION_ERROR',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    API_ERROR = 'API_ERROR',
    ITEM_ERROR = 'ITEM_ERROR',
    AUTH_ERROR = 'AUTH_ERROR',
    ASSET_REPORT_ERROR = 'ASSET_REPORT_ERROR',
    SANDBOX_ERROR = 'SANDBOX_ERROR',
    RECAPTCHA_ERROR = 'RECAPTCHA_ERROR',
    OAUTH_ERROR = 'OAUTH_ERROR',
}

export type LinkEventListener = (linkEvent: LinkEvent) => void

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
  // see possible values for selection at https://plaid.com/docs/link/web/#link-web-onevent-selection
    selection?: null | string;
    timestamp: string;
}

export enum LinkEventName {
    AUTO_SELECT_SAVED_INSTITUTION = 'AUTO_SELECT_SAVED_INSTITUTION',
    BANK_INCOME_INSIGHTS_COMPLETED = 'BANK_INCOME_INSIGHTS_COMPLETED',
    CLOSE_OAUTH = 'CLOSE_OAUTH',
    CONNECT_NEW_INSTITUTION = 'CONNECT_NEW_INSTITUTION',
    ERROR = 'ERROR',
    EXIT = 'EXIT',
    FAIL_OAUTH = 'FAIL_OAUTH',
    HANDOFF = 'HANDOFF',
    IDENTITY_VERIFICATION_CLOSE_UI = 'IDENTITY_VERIFICATION_CLOSE_UI',
    IDENTITY_VERIFICATION_CREATE_SESSION = 'IDENTITY_VERIFICATION_CREATE_SESSION',
    IDENTITY_VERIFICATION_FAIL_SESSION = 'IDENTITY_VERIFICATION_FAIL_SESSION',
    IDENTITY_VERIFICATION_FAIL_STEP = 'IDENTITY_VERIFICATION_FAIL_STEP',
    IDENTITY_VERIFICATION_OPEN_UI = 'IDENTITY_VERIFICATION_OPEN_UI',
    IDENTITY_VERIFICATION_PASS_SESSION = 'IDENTITY_VERIFICATION_PASS_SESSION',
    IDENTITY_VERIFICATION_PASS_STEP = 'IDENTITY_VERIFICATION_PASS_STEP',
    IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION = 'IDENTITY_VERIFICATION_PENDING_REVIEW_SESSION',
    IDENTITY_VERIFICATION_PENDING_REVIEW_STEP = 'IDENTITY_VERIFICATION_PENDING_REVIEW_STEP',
    IDENTITY_VERIFICATION_RESUME_SESSION = 'IDENTITY_VERIFICATION_RESUME_SESSION',
    IDENTITY_VERIFICATION_RESUME_UI = 'IDENTITY_VERIFICATION_RESUME_UI',
    IDENTITY_VERIFICATION_START_STEP = 'IDENTITY_VERIFICATION_START_STEP',
    LAYER_NOT_AVAILABLE = 'LAYER_NOT_AVAILABLE',
    LAYER_READY = 'LAYER_READY',
    MATCHED_CONSENT = 'MATCHED_CONSENT',
    MATCHED_SELECT_INSTITUTION = 'MATCHED_SELECT_INSTITUTION',
    MATCHED_SELECT_VERIFY_METHOD = 'MATCHED_SELECT_VERIFY_METHOD',
    OPEN = 'OPEN',
    OPEN_MY_PLAID = 'OPEN_MY_PLAID',
    OPEN_OAUTH = 'OPEN_OAUTH',
    PLAID_CHECK_PANE = 'PLAID_CHECK_PANE',
    PROFILE_ELIGIBILITY_CHECK_ERROR = 'PROFILE_ELIGIBILITY_CHECK_ERROR',
    PROFILE_ELIGIBILITY_CHECK_READY = 'PROFILE_ELIGIBILITY_CHECK_READY',
    REMEMBER_ME_DISABLED = 'REMEMBER_ME_DISABLED',
    REMEMBER_ME_ENABLED = 'REMEMBER_ME_ENABLED',
    REMEMBER_ME_HOLDOUT = 'REMEMBER_ME_HOLDOUT',
    SEARCH_INSTITUTION = 'SEARCH_INSTITUTION',
    SELECT_AUTH_TYPE = 'SELECT_AUTH_TYPE',
    SELECT_BRAND = 'SELECT_BRAND',
    SELECT_DEGRADED_INSTITUTION = 'SELECT_DEGRADED_INSTITUTION',
    SELECT_DOWN_INSTITUTION = 'SELECT_DOWN_INSTITUTION',
    SELECT_FILTERED_INSTITUTION = 'SELECT_FILTERED_INSTITUTION',
    SELECT_INSTITUTION = 'SELECT_INSTITUTION',
    SELECT_SAVED_ACCOUNT = 'SELECT_SAVED_ACCOUNT',
    SELECT_SAVED_INSTITUTION = 'SELECT_SAVED_INSTITUTION',
    SKIP_SUBMIT_EMAIL = 'SKIP_SUBMIT_EMAIL',
    SKIP_SUBMIT_PHONE = 'SKIP_SUBMIT_PHONE',
    SUBMIT_ACCOUNT_NUMBER = 'SUBMIT_ACCOUNT_NUMBER',
    SUBMIT_CREDENTIALS = 'SUBMIT_CREDENTIALS',
    SUBMIT_DOCUMENTS = 'SUBMIT_DOCUMENTS',
    SUBMIT_DOCUMENTS_ERROR = 'SUBMIT_DOCUMENTS_ERROR',
    SUBMIT_DOCUMENTS_SUCCESS = 'SUBMIT_DOCUMENTS_SUCCESS',
    SUBMIT_EMAIL = 'SUBMIT_EMAIL',
    SUBMIT_MFA = 'SUBMIT_MFA',
    SUBMIT_PHONE = 'SUBMIT_PHONE',
    SUBMIT_ROUTING_NUMBER = 'SUBMIT_ROUTING_NUMBER',
    TRANSITION_VIEW = 'TRANSITION_VIEW',
    VERIFY_PHONE = 'VERIFY_PHONE',
    VIEW_DATA_TYPES = 'VIEW_DATA_TYPES',
}

export enum LinkEventViewName {
    ACCEPT_TOS = 'ACCEPT_TOS',
    CONNECTED = 'CONNECTED',
    CONSENT = 'CONSENT',
    CREDENTIAL = 'CREDENTIAL',
    DATA_TRANSPARENCY = 'DATA_TRANSPARENCY',
    DATA_TRANSPARENCY_CONSENT = 'DATA_TRANSPARENCY_CONSENT',
    DOCUMENTARY_VERIFICATION = 'DOCUMENTARY_VERIFICATION',
    ERROR = 'ERROR',
    EXIT = 'EXIT',
    KYC_CHECK = 'KYC_CHECK',
    SELFIE_CHECK = 'SELFIE_CHECK',
    LOADING = 'LOADING',
    MATCHED_CONSENT = 'MATCHED_CONSENT',
    MATCHED_CREDENTIAL = 'MATCHED_CREDENTIAL',
    MATCHED_MFA = 'MATCHED_MFA',
    MFA = 'MFA',
    NUMBERS = 'NUMBERS',
    NUMBERS_SELECT_INSTITUTION = 'NUMBERS_SELECT_INSTITUTION',
    OAUTH = 'OAUTH',
    RECAPTCHA = 'RECAPTCHA',
    RISK_CHECK = 'RISK_CHECK',
    SCREENING = 'SCREENING',
    SELECT_ACCOUNT = 'SELECT_ACCOUNT',
    SELECT_AUTH_TYPE = 'SELECT_AUTH_TYPE',
    SUBMIT_EMAIL = "SUBMIT_EMAIL",
    SUBMIT_PHONE = 'SUBMIT_PHONE',
    VERIFY_PHONE = 'VERIFY_PHONE',
    SELECT_SAVED_INSTITUTION = 'SELECT_SAVED_INSTITUTION',
    SELECT_SAVED_ACCOUNT = 'SELECT_SAVED_ACCOUNT',
    SELECT_BRAND = 'SELECT_BRAND',
    SELECT_INSTITUTION = 'SELECT_INSTITUTION',
    SUBMIT_DOCUMENTS = 'SUBMIT_DOCUMENTS',
    SUBMIT_DOCUMENTS_SUCCESS = 'SUBMIT_DOCUMENTS_SUCCESS',
    SUBMIT_DOCUMENTS_ERROR = 'SUBMIT_DOCUMENTS_ERROR',
    UPLOAD_DOCUMENTS = 'UPLOAD_DOCUMENTS',
    VERIFY_EMAIL = "VERIFY_EMAIL",
    VERIFY_SMS = 'VERIFY_SMS',
}

/// Methods to present Link on iOS.
/// FULL_SCREEN is the converts to UIModalPresentationOverFullScreen on the native side.
/// MODAL will use the default presentation style for iOS which is UIModalPresentationAutomatic.
export enum LinkIOSPresentationStyle {
    FULL_SCREEN = 'FULL_SCREEN',
    MODAL = 'MODAL'
}

export type LinkSuccessListener = (LinkSuccess: LinkSuccess) => void

export type LinkExitListener = (LinkExit: LinkExit) => void

export type LinkOnEventListener = (LinkEvent: LinkEvent) => void

export interface PlaidLinkProps {
    tokenConfig: LinkTokenConfiguration
    onSuccess: LinkSuccessListener
    onExit?: LinkExitListener
    iOSPresentationStyle?: LinkIOSPresentationStyle
    logLevel?: LinkLogLevel
    onPress?(): any
}

export interface LinkOpenProps {
    onSuccess: LinkSuccessListener
    onExit?: LinkExitListener
    iOSPresentationStyle?: LinkIOSPresentationStyle
    logLevel?: LinkLogLevel
}

export type PlaidLinkComponentProps = (PlaidLinkProps & {
    children: React.ReactNode
});

export enum FinanceKitErrorType {
    InvalidToken = 0,
    PermissionError = 1,
    LinkApiError = 2,
    PermissionAccessError = 3,
    Unknown = 4
}

interface InvalidTokenError {
    type: FinanceKitErrorType.InvalidToken;
    message: string;
}
  
interface PermissionError {
    type: FinanceKitErrorType.PermissionError;
    message: string;
}
  
interface LinkApiError {
    type: FinanceKitErrorType.LinkApiError;
    message: string;
}
  
interface PermissionAccessError {
    type: FinanceKitErrorType.PermissionAccessError;
    message: string;
}
  
interface UnknownError {
    type: FinanceKitErrorType.Unknown;
    message: string;
}

export type FinanceKitError =
  | InvalidTokenError
  | PermissionError
  | LinkApiError
  | PermissionAccessError
  | UnknownError;

export interface SubmissionData {
    phoneNumber?: string;
};

