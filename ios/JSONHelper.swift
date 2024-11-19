import Foundation
import LinkKit

struct JSONHelper {
    static let dateFormatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions.insert(.withFractionalSeconds)
        return formatter
    }()

    // MARK: Success

    static func dictionaryFromSuccess(success: LinkSuccess) -> [String: Any] {
        let metadata = success.metadata

        return [
            "publicToken": success.publicToken,
            "metadata": [
                "linkSessionId": metadata.linkSessionID,
                "institution": dictionaryFromInstitution(institution: metadata.institution),
                "accounts": accountsDictionariesFromAccounts(accounts: metadata.accounts),
                "metadataJson": metadata.metadataJSON ?? "",
            ],
        ]
    }

    static func accountsDictionariesFromAccounts(accounts: [Account]) -> [[String: Any]] {
        var results = [[String: Any]]()

        for account in accounts {
            let accountDictionary = dictionaryFromAccount(account: account)
            results.append(accountDictionary)
        }

        return results
    }

    static func dictionaryFromAccount(account: Account) -> [String: Any] {
        return [
            "id": account.id,
            "name": account.name,
            "mask": account.mask ?? "",
            "subtype": subtypeNameForAccountSubtype(accountSubtype: account.subtype),
            "type": typeNameForAccountSubtype(accountSubtype: account.subtype),
            "verificationStatus": stringForVerificationStatus(verificationStatus: account.verificationStatus),
        ]
    }

    static func stringForVerificationStatus(verificationStatus: VerificationStatus?) -> String {
        guard let verificationStatus = verificationStatus else { return "" }
        switch verificationStatus {
        case .pendingAutomaticVerification: return "pending_automatic_verification"
        case .pendingManualVerification: return "pending_manual_verification"
        case .manuallyVerified: return "manually_verified"
        case .unknown(let unknownString): return unknownString
        @unknown default: return "unknown"
        }
    }

    static func typeNameForAccountSubtype(accountSubtype: AccountSubtype) -> String {
        switch accountSubtype {
        case .unknown(let type, subtype: _): return type
        case .other: return "other"
        case .credit: return "credit"
        case .loan: return "loan"
        case .depository: return "depository"
        case .investment: return "investment"
        @unknown default: return "unknown"
        }
    }

    static func subtypeNameForAccountSubtype(accountSubtype: AccountSubtype) -> String {
        switch accountSubtype {
        case .unknown(_, let subtype): return subtype
        case .other(let other):
            switch other {
            case .all: return "all"
            case .other: return "other"
            case .unknown(let unknown): return unknown
            @unknown default: return "unknown"
            }
        case .credit(let credit):
            switch credit {
            case .all: return "all"
            case .creditCard: return "credit card"
            case .paypal: return "paypal"
            case .unknown(let unknown): return unknown
            @unknown default: return "unknown"

            }
        case .loan(let loan):
            switch loan {
            case .all: return "all"
            case .auto: return "auto"
            case .business: return "business"
            case .commercial: return "commercial"
            case .construction: return "construction"
            case .consumer: return "consumer"
            case .homeEquity: return "home equity"
            case .lineOfCredit: return "line of credit"
            case .loan: return "loan"
            case .mortgage: return "mortgage"
            case .overdraft: return "overdraft"
            case .student: return "student"
            case .unknown(let unknown): return unknown
            @unknown default: return "unknown"
            }

        case .depository(let depository):
            switch depository {
            case .all: return "all"
            case .cashManagement: return "cash management"
            case .cd: return "cd"
            case .checking: return "checking"
            case .ebt: return "ebt"
            case .hsa: return "hsa"
            case .moneyMarket: return "money market"
            case .paypal: return "paypal"
            case .prepaid: return "prepaid"
            case .savings: return "savings"
            case .unknown(let unknown): return unknown
            @unknown default: return "unknown"
            }

        case .investment(let investment):
            switch investment {
            case .all: return "all"
            case .brokerage: return "brokerage"
            case .cashIsa: return "cash isa"
            case .educationSavingsAccount: return "education savings account"
            case .fixedAnnuity: return "fixed annuity"
            case .gic: return "gic"
            case .healthReimbursementArrangement: return "health reimbursement arrangement"
            case .hsa: return "hsa"
            case .investment401a: return "401a"
            case .investment401k: return "401k"
            case .investment403B: return "403b"
            case .investment457b: return "457b"
            case .investment529: return "529"
            case .ira: return "ira"
            case .isa: return "isa"
            case .keogh: return "keogh"
            case .lif: return "lif"
            case .lira: return "lira"
            case .lrif: return "lrif"
            case .lrsp: return "lrsp"
            case .mutualFund: return "mutual fund"
            case .nonTaxableBrokerageAccount: return "non-taxable brokerage account"
            case .pension: return "pension"
            case .plan: return "plan"
            case .prif: return "prif"
            case .profitSharingPlan: return "profit sharing plan"
            case .rdsp: return "rdsp"
            case .resp: return "resp"
            case .retirement: return "retirement"
            case .rlif: return "rlif"
            case .roth: return "roth"
            case .roth401k: return "roth 401k"
            case .rrif: return "rrif"
            case .rrsp: return "rrsp"
            case .sarsep: return "sarsep"
            case .sepIra: return "sep ira"
            case .simpleIra: return "simple ira"
            case .sipp: return "sipp"
            case .stockPlan: return "stock plan"
            case .tfsa: return "tfsa"
            case .thriftSavingsPlan: return "thrift savings plan"
            case .trust: return "trust"
            case .ugma: return "ugma"
            case .unknown(let unknown): return unknown
            case .utma: return "utma"
            case .variableAnnuity: return "variable annuity"
            @unknown default: return "unknown"
            }
        @unknown default: return "uknown"
        }
    }

    static func dictionaryFromInstitution(institution: Institution?) -> [String: Any] {
        return [
            "name": institution?.name ?? "",
            "id": institution?.id ?? "",
        ]
    }

    // MARK: Exit

    static func dictionaryFromExit(exit: LinkExit) -> [String: Any] {
        let metadata = exit.metadata
        return [
            "error": dictionaryFromError(error: exit.error),
            "metadata": [
                "status": stringForExitStatus(exitStatus: metadata.status),
                "institution": dictionaryFromInstitution(institution: metadata.institution),
                "requestId": metadata.requestID ?? "",
                "linkSessionId": metadata.linkSessionID ?? "",
                "metadataJson": metadata.metadataJSON ?? "",
            ],
        ]
    }

    static func stringForExitStatus(exitStatus: ExitStatus?) -> String {
        guard let exitStatus = exitStatus else { return "" }

        switch exitStatus {
        case .requiresQuestions:
            return "requires_questions"
        case .requiresSelections:
            return "requires_selections"
        case .requiresCode:
            return "requires_code"
        case .chooseDevice:
            return "choose_device"
        case .requiresCredentials:
            return "requires_credentials"
        case .institutionNotFound:
            return "institution_not_found"
        case .requiresAccountSelection:
            return "requires_account_selection"
        case .continueToThirdParty:
            return "continue_to_third_party"
        case .unknown(let unknown): return unknown
        @unknown default: return "unknown"
        }
    }

    static func dictionaryFromError(error: ExitError?) -> [String: String] {
        return [
            "errorType": errorTypeStringFromError(error: error),
            "errorCode": errorCodeStringFromError(error: error),
            "errorMessage": errorMessageFromError(error: error),
            // errorDisplayMessage is the deprecated name for displayMessage, both have to be populated
            // until errorDisplayMessage is fully removed to avoid breaking the API
            "errorDisplayMessage": errorDisplayMessageFromError(error: error),
            "displayMessage": errorDisplayMessageFromError(error: error),
        ]
    }

    static func errorTypeStringFromError(error: ExitError?) -> String {
        guard let error = error else { return "" }
        switch error.errorCode {
        case .apiError:
            return "API_ERROR"
        case .authError:
            return "AUTH_ERROR"
        case .assetReportError:
            return "ASSET_REPORT_ERROR"
        case .internal:
            return "INTERNAL"
        case .institutionError:
            return "INSTITUTION_ERROR"
        case .itemError:
            return "ITEM_ERROR"
        case .invalidInput:
            return "INVALID_INPUT"
        case .invalidRequest:
            return "INVALID_REQUEST"
        case .rateLimitExceeded:
            return "RATE_LIMIT_EXCEEDED"
        case .unknown:
            return "UNKNOWN"
        @unknown default:
            return "UNKNOWN"
        }
    }

    static func errorTypeStringFromError(error: ExitErrorCode?) -> String {
        guard let error = error else { return "" }
        switch error {
        case .apiError:
            return "API_ERROR"
        case .authError:
            return "AUTH_ERROR"
        case .assetReportError:
            return "ASSET_REPORT_ERROR"
        case .internal:
            return "INTERNAL"
        case .institutionError:
            return "INSTITUTION_ERROR"
        case .itemError:
            return "ITEM_ERROR"
        case .invalidInput:
            return "INVALID_INPUT"
        case .invalidRequest:
            return "INVALID_REQUEST"
        case .rateLimitExceeded:
            return "RATE_LIMIT_EXCEEDED"
        case .unknown:
            return "UNKNOWN"
        @unknown default:
            return "UNKNOWN"
        }
    }

    static func errorCodeStringFromError(error: ExitError?) -> String {
        guard let error = error else { return "" }

        switch error.errorCode {
        case .apiError(let apiError):
            return apiError.description
        case .authError(let authError):
            return authError.description
        case .assetReportError(let assetReportError):
            return assetReportError.description
        case .internal(let internalError):
            return internalError.description
        case .institutionError(let institutionError):
            return institutionError.description
        case .itemError(let itemError):
            return itemError.description
        case .invalidInput(let invalidInputError):
            return invalidInputError.description
        case .invalidRequest(let invalidRequestError):
            return invalidRequestError.description
        case .rateLimitExceeded(let rateLimitExceededError):
            return rateLimitExceededError.description
        case .unknown(let type, _):
            return type
        @unknown default:
            return "Unknown"
        }
    }

    static func errorCodeStringFromError(error: ExitErrorCode?) -> String {
        guard let error = error else { return "" }

        switch error {
        case .apiError(let apiError):
            return apiError.description
        case .authError(let authError):
            return authError.description
        case .assetReportError(let assetReportError):
            return assetReportError.description
        case .internal(let internalError):
            return internalError.description
        case .institutionError(let institutionError):
            return institutionError.description
        case .itemError(let itemError):
            return itemError.description
        case .invalidInput(let invalidInputError):
            return invalidInputError.description
        case .invalidRequest(let invalidRequestError):
            return invalidRequestError.description
        case .rateLimitExceeded(let rateLimitExceededError):
            return rateLimitExceededError.description
        case .unknown(let type, _):
            return type
        @unknown default:
            return "Unknown"
        }
    }

    static func errorMessageFromError(error: ExitError?) -> String {
        guard let error = error else { return "" }
        return error.errorMessage
    }

    static func errorDisplayMessageFromError(error: ExitError?) -> String {
        guard let error = error else { return "" }
        return error.displayMessage ?? ""
    }

    // MARK: Event

    static func dictionaryFromEvent(_ event: LinkEvent) -> [String: Any] {
        return [
            "eventName": event.eventName.description,
            "metadata": dictionaryFromEventMetadata(event.metadata),
        ]
    }

    static func dictionaryFromEventMetadata(_ metadata: EventMetadata) -> [String: Any] {
        return [
            "errorType": errorTypeStringFromError(error: metadata.errorCode),
            "errorCode": errorCodeStringFromError(error: metadata.errorCode),
            "errorMessage": metadata.errorMessage ?? "",
            "exitStatus": stringForExitStatus(exitStatus: metadata.exitStatus),
            "institutionId": metadata.institutionID ?? "",
            "institutionName": metadata.institutionName ?? "",
            "institutionSearchQuery": metadata.institutionSearchQuery ?? "",
            "accountNumberMask": metadata.accountNumberMask ?? "",
            "isUpdateMode": metadata.isUpdateMode ?? "",
            "matchReason": metadata.matchReason ?? "",
            "routingNumber": metadata.routingNumber ?? "",
            "selection": metadata.selection ?? "",
            "linkSessionId": metadata.linkSessionID,
            "mfaType": metadata.mfaType?.description ?? "",
            "requestId": metadata.requestID ?? "",
            "timestamp": dateFormatter.string(from: metadata.timestamp),
            "viewName": metadata.viewName?.description ?? "",
            "metadata_json": metadata.metadataJSON ?? "",
        ]
    }
}
