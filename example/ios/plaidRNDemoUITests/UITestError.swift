import Foundation

enum UITestError: LocalizedError {
    case appAlreadyLaunched
    case elementDoesNotExist(message: String)

    var localizedDescription: String {
        switch self {
        case .appAlreadyLaunched: return "App was already launched"
        case .elementDoesNotExist(let message): return message
        }
    }
}
