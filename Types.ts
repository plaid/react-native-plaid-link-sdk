interface CommonPlaidLinkOptions {
    logLevel?: LinkLogLevel;
    extras?: Record<string, any>;
}

export type LinkTokenConfiguration = (CommonPlaidLinkOptions & {
    token: string;
});

export type LinkPublicKeyConfiguration = (CommonPlaidLinkOptions & {
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
    oauthConfiguration?: OAuthConfiguration
});

export interface OAuthConfiguration {
    oauthNonce?: string;
    oauthRedirectUri?: string;
    oauthStateId?: string;
}

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

enum LinkAccountType {
    CREDIT = 'credit',
    DEPOSITORY = 'depository',
    INVESTMENT = 'investment',
    LOAN = 'loan',
    OTHER = 'other',
}

enum LinkAccountSubtype {
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

export interface LinkAccountSubtypeInterface {
}

export class LinkAccountSubtypeCredit implements LinkAccountSubtypeInterface {
    public static readonly ALL = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtype.ALL);
    public static readonly CREDIT_CARD = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtype.CREDIT_CARD);
    public static readonly PAYPAL = new LinkAccountSubtypeCredit(LinkAccountType.CREDIT, LinkAccountSubtype.PAYPAL);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeDepository implements LinkAccountSubtypeInterface {
    public static readonly ALL = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.ALL);
    public static readonly CASH_MANAGEMENT = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.CASH_MANAGEMENT);
    public static readonly CD = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.CD);
    public static readonly CHECKING = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.CHECKING);
    public static readonly EBT = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.EBT);
    public static readonly HSA = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.HSA);
    public static readonly MONEY_MARKET = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.MONEY_MARKET);
    public static readonly PAYPAL = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.PAYPAL);
    public static readonly PREPAID = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.PREPAID);
    public static readonly SAVINGS = new LinkAccountSubtypeDepository(LinkAccountType.DEPOSITORY, LinkAccountSubtype.SAVINGS);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeInvestment implements LinkAccountSubtypeInterface {
    public static readonly ALL = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.ALL);
    public static readonly BROKERAGE = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.BROKERAGE);
    public static readonly CASH_ISA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.CASH_ISA);
    public static readonly EDUCATION_SAVINGS_ACCOUNT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.EDUCATION_SAVINGS_ACCOUNT);
    public static readonly FIXED_ANNUNITY = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FIXED_ANNUNITY);
    public static readonly GIC = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.GIC);
    public static readonly HEALTH_REIMBURSEMENT_ARRANGEMENT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.HEALTH_REIMBURSEMENT_ARRANGEMENT);
    public static readonly HSA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.HSA);
    public static readonly INVESTMENT_401A = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FOUR_0_1_A);
    public static readonly INVESTMENT_401K = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FOUR_0_1_K);
    public static readonly INVESTMENT_403B = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FOUR_0_3_B);
    public static readonly  INVESTMENT_457B = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FOUR_5_7_B);
    public static readonly INVESTMENT_529 = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.FIVE_2_9);
    public static readonly IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.IRA);
    public static readonly ISA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.ISA);
    public static readonly KEOGH = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.KEOGH);
    public static readonly LIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.LIF);
    public static readonly LIRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.LIRA);
    public static readonly LRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.LRIF);
    public static readonly LRSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.LRSP);
    public static readonly MUTUAL_FUND = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.MUTUAL_FUND);
    public static readonly NON_TAXABLE_BROKERAGE_ACCOUNT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.NON_TAXABLE_BROKERAGE_ACCOUNT);
    public static readonly PENSION = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.PENSION);
    public static readonly PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.PLAN);
    public static readonly PRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.PRIF);
    public static readonly PROFIT_SHARING_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.PROFIT_SHARING_PLAN);
    public static readonly RDSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RDSP);
    public static readonly RESP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RESP);
    public static readonly RETIREMENT = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RETIREMENT);
    public static readonly RLIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RLIF);
    public static readonly ROTH = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.ROTH);
    public static readonly ROTH_401K = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.ROTH_401K);
    public static readonly RRIF = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RRIF);
    public static readonly RRSP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.RRSP);
    public static readonly SARSEP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.SARSEP);
    public static readonly SEP_IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.SEP_IRA);
    public static readonly SIMPLE_IRA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.SIMPLE_IRA);
    public static readonly SIIP = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.SIPP);
    public static readonly STOCK_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.STOCK_PLAN);
    public static readonly TFSA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.TFSA);
    public static readonly THRIFT_SAVINGS_PLAN = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.THRIFT_SAVINGS_PLAN);
    public static readonly TRUST = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.TRUST);
    public static readonly UGMA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.UGMA);
    public static readonly UTMA = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.UTMA);
    public static readonly VARIABLE_ANNUITY = new LinkAccountSubtypeInvestment(LinkAccountType.INVESTMENT, LinkAccountSubtype.VARIABLE_ANNUITY);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeLoan implements LinkAccountSubtypeInterface {
    public static readonly ALL = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.ALL);
    public static readonly AUTO = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.AUTO);
    public static readonly BUSINESS = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.BUSINESS);
    public static readonly COMMERCIAL = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.COMMERCIAL);
    public static readonly CONSTRUCTION = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.CONSTRUCTION);
    public static readonly CONSUMER = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.CONSUMER);
    public static readonly HOME_EQUITY = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.HOME_EQUITY);
    public static readonly LINE_OF_CREDIT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.LINE_OF_CREDIT);
    public static readonly LOAN = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.LOAN);
    public static readonly MORTGAGE = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.MORTGAGE);
    public static readonly OVERDRAFT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.OVERDRAFT);
    public static readonly STUDENT = new LinkAccountSubtypeLoan(LinkAccountType.CREDIT, LinkAccountSubtype.STUDENT);
  
    private constructor(public readonly type: LinkAccountType, public readonly subtype: LinkAccountSubtype) { }
}

export class LinkAccountSubtypeUnknown implements LinkAccountSubtypeInterface {
    constructor(public readonly type: string, public readonly subtype: string) { }
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

export enum LinkAccountVerificationStatus {
    PENDING_AUTOMATIC_VERIFICATION = 'pending_automatic_verification',
    PENDING_MANUAL_VERIFICATION = 'pending_manual_verification',
    MANUALLY_VERIFIED = 'manually_verified',
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

export enum LinkExitMetadataStatus {
    CONNECTED = 'connected',
    CHOOSE_DEVICE = 'choose_device',
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
    errorDisplayMessage?: string;
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
    INVALD_UPDATED_USERNAME = "INVALD_UPDATED_USERNAME",
    ITEM_NO_ERROR = "ITEM_NO_ERROR",
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
    timestamp: string;
}

export enum LinkEventName {
    CLOSE_OAUTH = 'close_oauth',
    ERROR = 'error',
    EXIT = 'exit',
    FAIL_OAUTH = 'fail_oauth',
    HANDOFF = 'handoff',
    MATCHED_CONSENT = 'matched_consent',
    MATCHED_SELECT_INSTITUTION = 'matched_select_institution',
    OPEN = 'open',
    OPEN_MY_PLAID = 'open_my_plaid',
    OPEN_OAUTH = 'open_oauth',
    SEARCH_INSTITUTION = 'search_institution',
    SELECT_INSTITUTION = 'select_institution',
    SUBMIT_CREDENTIALS = 'submit_credentials',
    SUBMIT_MFA = 'submit_mfa',
    TRANSITION_VIEW = 'transition_view',
}

export enum LinkEventViewName {
    CONNECTED = 'CONNECTED',
    CONSENT = 'CONSENT',
    CREDENTIAL = 'CREDENTIAL',
    ERROR = 'ERROR',
    EXIT = 'EXIT',
    LOADING = 'LOADING',
    MFA = 'MFA',
    NUMBERS = 'NUMBERS',
    RECAPTCHA = 'RECAPTCHA',
    SELECT_ACCOUNT = 'SELECT_ACCOUNT',
    SELECT_INSTITUTION = 'SELECT_INSTITUTION',
}

export type LinkSuccessListener = (LinkSuccess: LinkSuccess) => void

export type LinkExitListener = (LinkExit: LinkExit) => void

export type PlaidLinkConfiguration = LinkTokenConfiguration | LinkPublicKeyConfiguration

export interface PlaidLinkProps {
    tokenConfig?: LinkTokenConfiguration
    publicKeyConfig?: LinkPublicKeyConfiguration
    onSuccess: LinkSuccessListener
    onExit?: LinkExitListener
}

export type PlaidLinkComponentProps = (PlaidLinkProps & {
    children: React.ReactNode
});
