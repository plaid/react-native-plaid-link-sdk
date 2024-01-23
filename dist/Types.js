export var LinkLogLevel;
(function(LinkLogLevel) {
  LinkLogLevel['DEBUG'] = 'debug';
  LinkLogLevel['INFO'] = 'info';
  LinkLogLevel['WARN'] = 'warn';
  LinkLogLevel['ERROR'] = 'error';
})(LinkLogLevel || (LinkLogLevel = {}));
export var PlaidEnvironment;
(function(PlaidEnvironment) {
  PlaidEnvironment['PRODUCTION'] = 'production';
  PlaidEnvironment['DEVELOPMENT'] = 'development';
  PlaidEnvironment['SANDBOX'] = 'sandbox';
})(PlaidEnvironment || (PlaidEnvironment = {}));
export var PlaidProduct;
(function(PlaidProduct) {
  PlaidProduct['ASSETS'] = 'assets';
  PlaidProduct['AUTH'] = 'auth';
  PlaidProduct['DEPOSIT_SWITCH'] = 'deposit_switch';
  PlaidProduct['IDENTITY'] = 'identity';
  PlaidProduct['INCOME'] = 'income';
  PlaidProduct['INVESTMENTS'] = 'investments';
  PlaidProduct['LIABILITIES'] = 'liabilities';
  PlaidProduct['LIABILITIES_REPORT'] = 'liabilities_report';
  PlaidProduct['PAYMENT_INITIATION'] = 'payment_initiation';
  PlaidProduct['TRANSACTIONS'] = 'transactions';
})(PlaidProduct || (PlaidProduct = {}));
var LinkAccountType;
(function(LinkAccountType) {
  LinkAccountType['CREDIT'] = 'credit';
  LinkAccountType['DEPOSITORY'] = 'depository';
  LinkAccountType['INVESTMENT'] = 'investment';
  LinkAccountType['LOAN'] = 'loan';
  LinkAccountType['OTHER'] = 'other';
})(LinkAccountType || (LinkAccountType = {}));
var LinkAccountSubtypes;
(function(LinkAccountSubtypes) {
  LinkAccountSubtypes['ALL'] = 'all';
  LinkAccountSubtypes['CREDIT_CARD'] = 'credit card';
  LinkAccountSubtypes['PAYPAL'] = 'paypal';
  LinkAccountSubtypes['AUTO'] = 'auto';
  LinkAccountSubtypes['BUSINESS'] = 'business';
  LinkAccountSubtypes['COMMERCIAL'] = 'commercial';
  LinkAccountSubtypes['CONSTRUCTION'] = 'construction';
  LinkAccountSubtypes['CONSUMER'] = 'consumer';
  LinkAccountSubtypes['HOME_EQUITY'] = 'home equity';
  LinkAccountSubtypes['LINE_OF_CREDIT'] = 'line of credit';
  LinkAccountSubtypes['LOAN'] = 'loan';
  LinkAccountSubtypes['MORTGAGE'] = 'mortgage';
  LinkAccountSubtypes['OVERDRAFT'] = 'overdraft';
  LinkAccountSubtypes['STUDENT'] = 'student';
  LinkAccountSubtypes['CASH_MANAGEMENT'] = 'cash management';
  LinkAccountSubtypes['CD'] = 'cd';
  LinkAccountSubtypes['CHECKING'] = 'checking';
  LinkAccountSubtypes['EBT'] = 'ebt';
  LinkAccountSubtypes['HSA'] = 'hsa';
  LinkAccountSubtypes['MONEY_MARKET'] = 'money market';
  LinkAccountSubtypes['PREPAID'] = 'prepaid';
  LinkAccountSubtypes['SAVINGS'] = 'savings';
  LinkAccountSubtypes['FOUR_0_1_A'] = '401a';
  LinkAccountSubtypes['FOUR_0_1_K'] = '401k';
  LinkAccountSubtypes['FOUR_0_3_B'] = '403B';
  LinkAccountSubtypes['FOUR_5_7_B'] = '457b';
  LinkAccountSubtypes['FIVE_2_9'] = '529';
  LinkAccountSubtypes['BROKERAGE'] = 'brokerage';
  LinkAccountSubtypes['CASH_ISA'] = 'cash isa';
  LinkAccountSubtypes['EDUCATION_SAVINGS_ACCOUNT'] =
    'education savings account';
  LinkAccountSubtypes['FIXED_ANNUNITY'] = 'fixed annuity';
  LinkAccountSubtypes['GIC'] = 'gic';
  LinkAccountSubtypes['HEALTH_REIMBURSEMENT_ARRANGEMENT'] =
    'health reimbursement arrangement';
  LinkAccountSubtypes['IRA'] = 'ira';
  LinkAccountSubtypes['ISA'] = 'isa';
  LinkAccountSubtypes['KEOGH'] = 'keogh';
  LinkAccountSubtypes['LIF'] = 'lif';
  LinkAccountSubtypes['LIRA'] = 'lira';
  LinkAccountSubtypes['LRIF'] = 'lrif';
  LinkAccountSubtypes['LRSP'] = 'lrsp';
  LinkAccountSubtypes['MUTUAL_FUND'] = 'mutual fund';
  LinkAccountSubtypes['NON_TAXABLE_BROKERAGE_ACCOUNT'] =
    'non-taxable brokerage account';
  LinkAccountSubtypes['PENSION'] = 'pension';
  LinkAccountSubtypes['PLAN'] = 'plan';
  LinkAccountSubtypes['PRIF'] = 'prif';
  LinkAccountSubtypes['PROFIT_SHARING_PLAN'] = 'profit sharing plan';
  LinkAccountSubtypes['RDSP'] = 'rdsp';
  LinkAccountSubtypes['RESP'] = 'resp';
  LinkAccountSubtypes['RETIREMENT'] = 'retirement';
  LinkAccountSubtypes['RLIF'] = 'rlif';
  LinkAccountSubtypes['ROTH_401K'] = 'roth 401k';
  LinkAccountSubtypes['ROTH'] = 'roth';
  LinkAccountSubtypes['RRIF'] = 'rrif';
  LinkAccountSubtypes['RRSP'] = 'rrsp';
  LinkAccountSubtypes['SARSEP'] = 'sarsep';
  LinkAccountSubtypes['SEP_IRA'] = 'sep ira';
  LinkAccountSubtypes['SIMPLE_IRA'] = 'simple ira';
  LinkAccountSubtypes['SIPP'] = 'sipp';
  LinkAccountSubtypes['STOCK_PLAN'] = 'stock plan';
  LinkAccountSubtypes['TFSA'] = 'tfsa';
  LinkAccountSubtypes['THRIFT_SAVINGS_PLAN'] = 'thrift savings plan';
  LinkAccountSubtypes['TRUST'] = 'trust';
  LinkAccountSubtypes['UGMA'] = 'ugma';
  LinkAccountSubtypes['UTMA'] = 'utma';
  LinkAccountSubtypes['VARIABLE_ANNUITY'] = 'variable annuity';
})(LinkAccountSubtypes || (LinkAccountSubtypes = {}));
export class LinkAccountSubtypeCredit {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
}
LinkAccountSubtypeCredit.ALL = new LinkAccountSubtypeCredit(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.ALL,
);
LinkAccountSubtypeCredit.CREDIT_CARD = new LinkAccountSubtypeCredit(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.CREDIT_CARD,
);
LinkAccountSubtypeCredit.PAYPAL = new LinkAccountSubtypeCredit(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.PAYPAL,
);
export class LinkAccountSubtypeDepository {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
}
LinkAccountSubtypeDepository.ALL = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.ALL,
);
LinkAccountSubtypeDepository.CASH_MANAGEMENT = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.CASH_MANAGEMENT,
);
LinkAccountSubtypeDepository.CD = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.CD,
);
LinkAccountSubtypeDepository.CHECKING = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.CHECKING,
);
LinkAccountSubtypeDepository.EBT = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.EBT,
);
LinkAccountSubtypeDepository.HSA = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.HSA,
);
LinkAccountSubtypeDepository.MONEY_MARKET = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.MONEY_MARKET,
);
LinkAccountSubtypeDepository.PAYPAL = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.PAYPAL,
);
LinkAccountSubtypeDepository.PREPAID = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.PREPAID,
);
LinkAccountSubtypeDepository.SAVINGS = new LinkAccountSubtypeDepository(
  LinkAccountType.DEPOSITORY,
  LinkAccountSubtypes.SAVINGS,
);
export class LinkAccountSubtypeInvestment {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
}
LinkAccountSubtypeInvestment.ALL = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.ALL,
);
LinkAccountSubtypeInvestment.BROKERAGE = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.BROKERAGE,
);
LinkAccountSubtypeInvestment.CASH_ISA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.CASH_ISA,
);
LinkAccountSubtypeInvestment.EDUCATION_SAVINGS_ACCOUNT = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.EDUCATION_SAVINGS_ACCOUNT,
);
LinkAccountSubtypeInvestment.FIXED_ANNUNITY = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FIXED_ANNUNITY,
);
LinkAccountSubtypeInvestment.GIC = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.GIC,
);
LinkAccountSubtypeInvestment.HEALTH_REIMBURSEMENT_ARRANGEMENT = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.HEALTH_REIMBURSEMENT_ARRANGEMENT,
);
LinkAccountSubtypeInvestment.HSA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.HSA,
);
LinkAccountSubtypeInvestment.INVESTMENT_401A = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FOUR_0_1_A,
);
LinkAccountSubtypeInvestment.INVESTMENT_401K = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FOUR_0_1_K,
);
LinkAccountSubtypeInvestment.INVESTMENT_403B = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FOUR_0_3_B,
);
LinkAccountSubtypeInvestment.INVESTMENT_457B = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FOUR_5_7_B,
);
LinkAccountSubtypeInvestment.INVESTMENT_529 = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.FIVE_2_9,
);
LinkAccountSubtypeInvestment.IRA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.IRA,
);
LinkAccountSubtypeInvestment.ISA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.ISA,
);
LinkAccountSubtypeInvestment.KEOGH = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.KEOGH,
);
LinkAccountSubtypeInvestment.LIF = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.LIF,
);
LinkAccountSubtypeInvestment.LIRA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.LIRA,
);
LinkAccountSubtypeInvestment.LRIF = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.LRIF,
);
LinkAccountSubtypeInvestment.LRSP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.LRSP,
);
LinkAccountSubtypeInvestment.MUTUAL_FUND = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.MUTUAL_FUND,
);
LinkAccountSubtypeInvestment.NON_TAXABLE_BROKERAGE_ACCOUNT = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.NON_TAXABLE_BROKERAGE_ACCOUNT,
);
LinkAccountSubtypeInvestment.PENSION = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.PENSION,
);
LinkAccountSubtypeInvestment.PLAN = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.PLAN,
);
LinkAccountSubtypeInvestment.PRIF = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.PRIF,
);
LinkAccountSubtypeInvestment.PROFIT_SHARING_PLAN = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.PROFIT_SHARING_PLAN,
);
LinkAccountSubtypeInvestment.RDSP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RDSP,
);
LinkAccountSubtypeInvestment.RESP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RESP,
);
LinkAccountSubtypeInvestment.RETIREMENT = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RETIREMENT,
);
LinkAccountSubtypeInvestment.RLIF = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RLIF,
);
LinkAccountSubtypeInvestment.ROTH = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.ROTH,
);
LinkAccountSubtypeInvestment.ROTH_401K = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.ROTH_401K,
);
LinkAccountSubtypeInvestment.RRIF = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RRIF,
);
LinkAccountSubtypeInvestment.RRSP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.RRSP,
);
LinkAccountSubtypeInvestment.SARSEP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.SARSEP,
);
LinkAccountSubtypeInvestment.SEP_IRA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.SEP_IRA,
);
LinkAccountSubtypeInvestment.SIMPLE_IRA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.SIMPLE_IRA,
);
LinkAccountSubtypeInvestment.SIIP = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.SIPP,
);
LinkAccountSubtypeInvestment.STOCK_PLAN = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.STOCK_PLAN,
);
LinkAccountSubtypeInvestment.TFSA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.TFSA,
);
LinkAccountSubtypeInvestment.THRIFT_SAVINGS_PLAN = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.THRIFT_SAVINGS_PLAN,
);
LinkAccountSubtypeInvestment.TRUST = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.TRUST,
);
LinkAccountSubtypeInvestment.UGMA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.UGMA,
);
LinkAccountSubtypeInvestment.UTMA = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.UTMA,
);
LinkAccountSubtypeInvestment.VARIABLE_ANNUITY = new LinkAccountSubtypeInvestment(
  LinkAccountType.INVESTMENT,
  LinkAccountSubtypes.VARIABLE_ANNUITY,
);
export class LinkAccountSubtypeLoan {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
}
LinkAccountSubtypeLoan.ALL = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.ALL,
);
LinkAccountSubtypeLoan.AUTO = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.AUTO,
);
LinkAccountSubtypeLoan.BUSINESS = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.BUSINESS,
);
LinkAccountSubtypeLoan.COMMERCIAL = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.COMMERCIAL,
);
LinkAccountSubtypeLoan.CONSTRUCTION = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.CONSTRUCTION,
);
LinkAccountSubtypeLoan.CONSUMER = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.CONSUMER,
);
LinkAccountSubtypeLoan.HOME_EQUITY = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.HOME_EQUITY,
);
LinkAccountSubtypeLoan.LINE_OF_CREDIT = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.LINE_OF_CREDIT,
);
LinkAccountSubtypeLoan.LOAN = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.LOAN,
);
LinkAccountSubtypeLoan.MORTGAGE = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.MORTGAGE,
);
LinkAccountSubtypeLoan.OVERDRAFT = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.OVERDRAFT,
);
LinkAccountSubtypeLoan.STUDENT = new LinkAccountSubtypeLoan(
  LinkAccountType.CREDIT,
  LinkAccountSubtypes.STUDENT,
);
export class LinkAccountSubtypeUnknown {
  constructor(type, subtype) {
    this.type = type;
    this.subtype = subtype;
  }
}
export var LinkAccountVerificationStatus;
(function(LinkAccountVerificationStatus) {
  LinkAccountVerificationStatus['PENDING_AUTOMATIC_VERIFICATION'] =
    'pending_automatic_verification';
  LinkAccountVerificationStatus['PENDING_MANUAL_VERIFICATION'] =
    'pending_manual_verification';
  LinkAccountVerificationStatus['MANUALLY_VERIFIED'] = 'manually_verified';
})(LinkAccountVerificationStatus || (LinkAccountVerificationStatus = {}));
export var LinkExitMetadataStatus;
(function(LinkExitMetadataStatus) {
  LinkExitMetadataStatus['CONNECTED'] = 'connected';
  LinkExitMetadataStatus['CHOOSE_DEVICE'] = 'choose_device';
  LinkExitMetadataStatus['REQUIRES_ACCOUNT_SELECTION'] =
    'requires_account_selection';
  LinkExitMetadataStatus['REQUIRES_CODE'] = 'requires_code';
  LinkExitMetadataStatus['REQUIRES_CREDENTIALS'] = 'requires_credentials';
  LinkExitMetadataStatus['REQUIRES_EXTERNAL_ACTION'] =
    'requires_external_action';
  LinkExitMetadataStatus['REQUIRES_OAUTH'] = 'requires_oauth';
  LinkExitMetadataStatus['REQUIRES_QUESTIONS'] = 'requires_questions';
  LinkExitMetadataStatus['REQUIRES_RECAPTCHA'] = 'requires_recaptcha';
  LinkExitMetadataStatus['REQUIRES_SELECTIONS'] = 'requires_selections';
  LinkExitMetadataStatus['REQUIRES_DEPOSIT_SWITCH_ALLOCATION_CONFIGURATION'] =
    'requires_deposit_switch_allocation_configuration';
  LinkExitMetadataStatus['REQUIRES_DEPOSIT_SWITCH_ALLOCATION_SELECTION'] =
    'requires_deposit_switch_allocation_selection';
})(LinkExitMetadataStatus || (LinkExitMetadataStatus = {}));
export var LinkErrorCode;
(function(LinkErrorCode) {
  // ITEM_ERROR
  LinkErrorCode['INVALID_CREDENTIALS'] = 'INVALID_CREDENTIALS';
  LinkErrorCode['INVALID_MFA'] = 'INVALID_MFA';
  LinkErrorCode['ITEM_LOGIN_REQUIRED'] = 'ITEM_LOGIN_REQUIRED';
  LinkErrorCode['INSUFFICIENT_CREDENTIALS'] = 'INSUFFICIENT_CREDENTIALS';
  LinkErrorCode['ITEM_LOCKED'] = 'ITEM_LOCKED';
  LinkErrorCode['USER_SETUP_REQUIRED'] = 'USER_SETUP_REQUIRED';
  LinkErrorCode['MFA_NOT_SUPPORTED'] = 'MFA_NOT_SUPPORTED';
  LinkErrorCode['INVALID_SEND_METHOD'] = 'INVALID_SEND_METHOD';
  LinkErrorCode['NO_ACCOUNTS'] = 'NO_ACCOUNTS';
  LinkErrorCode['ITEM_NOT_SUPPORTED'] = 'ITEM_NOT_SUPPORTED';
  LinkErrorCode['TOO_MANY_VERIFICATION_ATTEMPTS'] =
    'TOO_MANY_VERIFICATION_ATTEMPTS';
  LinkErrorCode['INVALD_UPDATED_USERNAME'] = 'INVALD_UPDATED_USERNAME';
  LinkErrorCode['INVALID_UPDATED_USERNAME'] = 'INVALID_UPDATED_USERNAME';
  LinkErrorCode['ITEM_NO_ERROR'] = 'ITEM_NO_ERROR';
  LinkErrorCode['item_no_error'] = 'item-no-error';
  LinkErrorCode['NO_AUTH_ACCOUNTS'] = 'NO_AUTH_ACCOUNTS';
  LinkErrorCode['NO_INVESTMENT_ACCOUNTS'] = 'NO_INVESTMENT_ACCOUNTS';
  LinkErrorCode['NO_INVESTMENT_AUTH_ACCOUNTS'] = 'NO_INVESTMENT_AUTH_ACCOUNTS';
  LinkErrorCode['NO_LIABILITY_ACCOUNTS'] = 'NO_LIABILITY_ACCOUNTS';
  LinkErrorCode['PRODUCTS_NOT_SUPPORTED'] = 'PRODUCTS_NOT_SUPPORTED';
  LinkErrorCode['ITEM_NOT_FOUND'] = 'ITEM_NOT_FOUND';
  LinkErrorCode['ITEM_PRODUCT_NOT_READY'] = 'ITEM_PRODUCT_NOT_READY';
  // INSTITUTION_ERROR
  LinkErrorCode['INSTITUTION_DOWN'] = 'INSTITUTION_DOWN';
  LinkErrorCode['INSTITUTION_NOT_RESPONDING'] = 'INSTITUTION_NOT_RESPONDING';
  LinkErrorCode['INSTITUTION_NOT_AVAILABLE'] = 'INSTITUTION_NOT_AVAILABLE';
  LinkErrorCode['INSTITUTION_NO_LONGER_SUPPORTED'] =
    'INSTITUTION_NO_LONGER_SUPPORTED';
  // API_ERROR
  LinkErrorCode['INTERNAL_SERVER_ERROR'] = 'INTERNAL_SERVER_ERROR';
  LinkErrorCode['PLANNED_MAINTENANCE'] = 'PLANNED_MAINTENANCE';
  // ASSET_REPORT_ERROR
  LinkErrorCode['PRODUCT_NOT_ENABLED'] = 'PRODUCT_NOT_ENABLED';
  LinkErrorCode['DATA_UNAVAILABLE'] = 'DATA_UNAVAILABLE';
  LinkErrorCode['ASSET_PRODUCT_NOT_READY'] = 'ASSET_PRODUCT_NOT_READY';
  LinkErrorCode['ASSET_REPORT_GENERATION_FAILED'] =
    'ASSET_REPORT_GENERATION_FAILED';
  LinkErrorCode['INVALID_PARENT'] = 'INVALID_PARENT';
  LinkErrorCode['INSIGHTS_NOT_ENABLED'] = 'INSIGHTS_NOT_ENABLED';
  LinkErrorCode['INSIGHTS_PREVIOUSLY_NOT_ENABLED'] =
    'INSIGHTS_PREVIOUSLY_NOT_ENABLED';
  // BANK_TRANSFER_ERROR
  LinkErrorCode['BANK_TRANSFER_LIMIT_EXCEEDED'] =
    'BANK_TRANSFER_LIMIT_EXCEEDED';
  LinkErrorCode['BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT'] =
    'BANK_TRANSFER_MISSING_ORIGINATION_ACCOUNT';
  LinkErrorCode['BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT'] =
    'BANK_TRANSFER_INVALID_ORIGINATION_ACCOUNT';
  LinkErrorCode['BANK_TRANSFER_ACCOUNT_BLOCKED'] =
    'BANK_TRANSFER_ACCOUNT_BLOCKED';
  LinkErrorCode['BANK_TRANSFER_INSUFFICIENT_FUNDS'] =
    'BANK_TRANSFER_INSUFFICIENT_FUNDS';
  LinkErrorCode['BANK_TRANSFER_NOT_CANCELLABLE'] =
    'BANK_TRANSFER_NOT_CANCELLABLE';
  LinkErrorCode['BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE'] =
    'BANK_TRANSFER_UNSUPPORTED_ACCOUNT_TYPE';
  LinkErrorCode['BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT'] =
    'BANK_TRANSFER_UNSUPPORTED_ENVIRONMENT';
  // SANDBOX_ERROR
  LinkErrorCode['SANDBOX_PRODUCT_NOT_ENABLED'] = 'SANDBOX_PRODUCT_NOT_ENABLED';
  LinkErrorCode['SANDBOX_WEBHOOK_INVALID'] = 'SANDBOX_WEBHOOK_INVALID';
  LinkErrorCode['SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID'] =
    'SANDBOX_BANK_TRANSFER_EVENT_TRANSITION_INVALID';
  // INVALID_REQUEST
  LinkErrorCode['MISSING_FIELDS'] = 'MISSING_FIELDS';
  LinkErrorCode['UNKNOWN_FIELDS'] = 'UNKNOWN_FIELDS';
  LinkErrorCode['INVALID_FIELD'] = 'INVALID_FIELD';
  LinkErrorCode['INCOMPATIBLE_API_VERSION'] = 'INCOMPATIBLE_API_VERSION';
  LinkErrorCode['INVALID_BODY'] = 'INVALID_BODY';
  LinkErrorCode['INVALID_HEADERS'] = 'INVALID_HEADERS';
  LinkErrorCode['NOT_FOUND'] = 'NOT_FOUND';
  LinkErrorCode['NO_LONGER_AVAILABLE'] = 'NO_LONGER_AVAILABLE';
  LinkErrorCode['SANDBOX_ONLY'] = 'SANDBOX_ONLY';
  LinkErrorCode['INVALID_ACCOUNT_NUMBER'] = 'INVALID_ACCOUNT_NUMBER';
  // INVALID_INPUT
  // From above ITEM_LOGIN_REQUIRED = "INVALID_CREDENTIALS",
  LinkErrorCode['INCORRECT_DEPOSIT_AMOUNTS'] = 'INCORRECT_DEPOSIT_AMOUNTS';
  LinkErrorCode['UNAUTHORIZED_ENVIRONMENT'] = 'UNAUTHORIZED_ENVIRONMENT';
  LinkErrorCode['INVALID_PRODUCT'] = 'INVALID_PRODUCT';
  LinkErrorCode['UNAUTHORIZED_ROUTE_ACCESS'] = 'UNAUTHORIZED_ROUTE_ACCESS';
  LinkErrorCode['DIRECT_INTEGRATION_NOT_ENABLED'] =
    'DIRECT_INTEGRATION_NOT_ENABLED';
  LinkErrorCode['INVALID_API_KEYS'] = 'INVALID_API_KEYS';
  LinkErrorCode['INVALID_ACCESS_TOKEN'] = 'INVALID_ACCESS_TOKEN';
  LinkErrorCode['INVALID_PUBLIC_TOKEN'] = 'INVALID_PUBLIC_TOKEN';
  LinkErrorCode['INVALID_LINK_TOKEN'] = 'INVALID_LINK_TOKEN';
  LinkErrorCode['INVALID_PROCESSOR_TOKEN'] = 'INVALID_PROCESSOR_TOKEN';
  LinkErrorCode['INVALID_AUDIT_COPY_TOKEN'] = 'INVALID_AUDIT_COPY_TOKEN';
  LinkErrorCode['INVALID_ACCOUNT_ID'] = 'INVALID_ACCOUNT_ID';
  // INVALID_RESULT
  LinkErrorCode['PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA'] =
    'PLAID_DIRECT_ITEM_IMPORT_RETURNED_INVALID_MFA';
  // RATE_LIMIT_EXCEEDED
  LinkErrorCode['ACCOUNTS_LIMIT'] = 'ACCOUNTS_LIMIT';
  LinkErrorCode['ADDITION_LIMIT'] = 'ADDITION_LIMIT';
  LinkErrorCode['AUTH_LIMIT'] = 'AUTH_LIMIT';
  LinkErrorCode['BALANCE_LIMIT'] = 'BALANCE_LIMIT';
  LinkErrorCode['IDENTITY_LIMIT'] = 'IDENTITY_LIMIT';
  LinkErrorCode['ITEM_GET_LIMIT'] = 'ITEM_GET_LIMIT';
  LinkErrorCode['RATE_LIMIT'] = 'RATE_LIMIT';
  LinkErrorCode['TRANSACTIONS_LIMIT'] = 'TRANSACTIONS_LIMIT';
  // RECAPTCHA_ERROR
  LinkErrorCode['RECAPTCHA_REQUIRED'] = 'RECAPTCHA_REQUIRED';
  LinkErrorCode['RECAPTCHA_BAD'] = 'RECAPTCHA_BAD';
  // OAUTH_ERROR
  LinkErrorCode['INCORRECT_OAUTH_NONCE'] = 'INCORRECT_OAUTH_NONCE';
  LinkErrorCode['OAUTH_STATE_ID_ALREADY_PROCESSED'] =
    'OAUTH_STATE_ID_ALREADY_PROCESSED';
})(LinkErrorCode || (LinkErrorCode = {}));
export var LinkErrorType;
(function(LinkErrorType) {
  LinkErrorType['BANK_TRANSFER'] = 'BANK_TRANSFER_ERROR';
  LinkErrorType['INVALID_REQUEST'] = 'INVALID_REQUEST';
  LinkErrorType['INVALID_RESULT'] = 'INVALID_RESULT';
  LinkErrorType['INVALID_INPUT'] = 'INVALID_INPUT';
  LinkErrorType['INSTITUTION_ERROR'] = 'INSTITUTION_ERROR';
  LinkErrorType['RATE_LIMIT_EXCEEDED'] = 'RATE_LIMIT_EXCEEDED';
  LinkErrorType['API_ERROR'] = 'API_ERROR';
  LinkErrorType['ITEM_ERROR'] = 'ITEM_ERROR';
  LinkErrorType['AUTH_ERROR'] = 'AUTH_ERROR';
  LinkErrorType['ASSET_REPORT_ERROR'] = 'ASSET_REPORT_ERROR';
  LinkErrorType['SANDBOX_ERROR'] = 'SANDBOX_ERROR';
  LinkErrorType['RECAPTCHA_ERROR'] = 'RECAPTCHA_ERROR';
  LinkErrorType['OAUTH_ERROR'] = 'OAUTH_ERROR';
})(LinkErrorType || (LinkErrorType = {}));
export var LinkEventName;
(function(LinkEventName) {
  LinkEventName['CLOSE_OAUTH'] = 'CLOSE_OAUTH';
  LinkEventName['ERROR'] = 'ERROR';
  LinkEventName['EXIT'] = 'EXIT';
  LinkEventName['FAIL_OAUTH'] = 'FAIL_OAUTH';
  LinkEventName['HANDOFF'] = 'HANDOFF';
  LinkEventName['IDENTITY_VERIFICATION_START_STEP'] =
    'IDENTITY_VERIFICATION_START_STEP';
  LinkEventName['IDENTITY_VERIFICATION_PASS_STEP'] =
    'IDENTITY_VERIFICATION_PASS_STEP';
  LinkEventName['IDENTITY_VERIFICATION_FAIL_STEP'] =
    'IDENTITY_VERIFICATION_FAIL_STEP';
  LinkEventName['IDENTITY_VERIFICATION_PENDING_REVIEW_STEP'] =
    'IDENTITY_VERIFICATION_PENDING_REVIEW_STEP';
  LinkEventName['IDENTITY_VERIFICATION_CREATE_SESSION'] =
    'IDENTITY_VERIFICATION_CREATE_SESSION';
  LinkEventName['IDENTITY_VERIFICATION_RESUME_SESSION'] =
    'IDENTITY_VERIFICATION_RESUME_SESSION';
  LinkEventName['IDENTITY_VERIFICATION_PASS_SESSION'] =
    'IDENTITY_VERIFICATION_PASS_SESSION';
  LinkEventName['IDENTITY_VERIFICATION_FAIL_SESSION'] =
    'IDENTITY_VERIFICATION_FAIL_SESSION';
  LinkEventName['IDENTITY_VERIFICATION_OPEN_UI'] =
    'IDENTITY_VERIFICATION_OPEN_UI';
  LinkEventName['IDENTITY_VERIFICATION_RESUME_UI'] =
    'IDENTITY_VERIFICATION_RESUME_UI';
  LinkEventName['IDENTITY_VERIFICATION_CLOSE_UI'] =
    'IDENTITY_VERIFICATION_CLOSE_UI';
  LinkEventName['MATCHED_CONSENT'] = 'MATCHED_CONSENT';
  LinkEventName['MATCHED_SELECT_INSTITUTION'] = 'MATCHED_SELECT_INSTITUTION';
  LinkEventName['MATCHED_SELECT_VERIFY_METHOD'] =
    'MATCHED_SELECT_VERIFY_METHOD';
  LinkEventName['OPEN'] = 'OPEN';
  LinkEventName['OPEN_MY_PLAID'] = 'OPEN_MY_PLAID';
  LinkEventName['OPEN_OAUTH'] = 'OPEN_OAUTH';
  LinkEventName['SEARCH_INSTITUTION'] = 'SEARCH_INSTITUTION';
  LinkEventName['SELECT_DEGRADED_INSTITUTION'] = 'SELECT_DEGRADED_INSTITUTION';
  LinkEventName['SELECT_DOWN_INSTITUTION'] = 'SELECT_DOWN_INSTITUTION';
  LinkEventName['SELECT_INSTITUTION'] = 'SELECT_INSTITUTION';
  LinkEventName['SUBMIT_CREDENTIALS'] = 'SUBMIT_CREDENTIALS';
  LinkEventName['SUBMIT_MFA'] = 'SUBMIT_MFA';
  LinkEventName['TRANSITION_VIEW'] = 'TRANSITION_VIEW';
})(LinkEventName || (LinkEventName = {}));
export var LinkEventViewName;
(function(LinkEventViewName) {
  LinkEventViewName['ACCEPT_TOS'] = 'ACCEPT_TOS';
  LinkEventViewName['CONNECTED'] = 'CONNECTED';
  LinkEventViewName['CONSENT'] = 'CONSENT';
  LinkEventViewName['CREDENTIAL'] = 'CREDENTIAL';
  LinkEventViewName['DOCUMENTARY_VERIFICATION'] = 'DOCUMENTARY_VERIFICATION';
  LinkEventViewName['ERROR'] = 'ERROR';
  LinkEventViewName['EXIT'] = 'EXIT';
  LinkEventViewName['KYC_CHECK'] = 'KYC_CHECK';
  LinkEventViewName['SELFIE_CHECK'] = 'SELFIE_CHECK';
  LinkEventViewName['LOADING'] = 'LOADING';
  LinkEventViewName['MATCHED_CONSENT'] = 'MATCHED_CONSENT';
  LinkEventViewName['MATCHED_CREDENTIAL'] = 'MATCHED_CREDENTIAL';
  LinkEventViewName['MATCHED_MFA'] = 'MATCHED_MFA';
  LinkEventViewName['MFA'] = 'MFA';
  LinkEventViewName['NUMBERS'] = 'NUMBERS';
  LinkEventViewName['OAUTH'] = 'OAUTH';
  LinkEventViewName['RECAPTCHA'] = 'RECAPTCHA';
  LinkEventViewName['RISK_CHECK'] = 'RISK_CHECK';
  LinkEventViewName['SCREENING'] = 'SCREENING';
  LinkEventViewName['SELECT_ACCOUNT'] = 'SELECT_ACCOUNT';
  LinkEventViewName['SELECT_INSTITUTION'] = 'SELECT_INSTITUTION';
  LinkEventViewName['VERIFY_SMS'] = 'VERIFY_SMS';
})(LinkEventViewName || (LinkEventViewName = {}));
