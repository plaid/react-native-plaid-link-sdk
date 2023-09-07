import Foundation
import XCTest

enum ElementPredicate {
    case containing(String)
    case matching(String)
    case identifiedBy(String)
    case custom((XCUIElementAttributes) -> Bool)
    case oneOf([ElementPredicate])

    func toNSPredicate() -> NSPredicate {
        switch self {
        case .containing(let string):
            return NSPredicate(format: "label CONTAINS[c] %@", string)
        case .matching(let string):
            return NSPredicate(format: "label = %@", string)
        case .identifiedBy(let identifier):
            return NSPredicate(format: "identifier = %@", identifier)
        case .custom(let evaluation):
            return NSPredicate { object, _ in
                guard let element = object as? XCUIElementAttributes else {
                    return false
                }

                return evaluation(element)
            }
        case .oneOf(let predicates):
            return NSCompoundPredicate(type: .or, subpredicates: predicates.map { $0.toNSPredicate() })
        }
    }
}
