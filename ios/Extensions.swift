import Foundation
import LinkKit

extension LinkKit.Plaid.CreateError {
  var code: Int {
    switch self {
    case .configurationError(let nestedError):
      return nestedError.code
    @unknown default:
      return -1
    }
  }
}

extension LinkKit.ConfigurationError {
  var code: Int {
    switch self {
    case .malformedClientID: return 0
    case .missingAuthorization: return 1
    case .noProduct: return 2
    case .invalidOptionValue: return 3
    case .invalidOptionCombination: return 4
    case .invalidToken: return 5
    @unknown default: return -1
    }
  }
}

@available(iOS 17.4, *)
extension LinkKit.FinanceKitError {
  var code: Int {
    switch self {
    case .invalidToken: return 0
    case .permissionError: return 1
    case .linkApiError: return 2
    case .permissionAccessError: return 3
    case .unknown: return 4
    @unknown default: return -1
    }
  }
}
