import ExpoModulesCore
internal import LinkKit

public class ReactNativePlaidLinkSdkModule: Module {

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {

        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ReactNativePlaidLinkSdk')` in JavaScript.
        Name("ReactNativePlaidLinkSdk")

        // --- Version API ---
        Constant("sdkVersion") { Plaid.version }

        // Defines event names that the module can send to JavaScript.
        Events(ModuleEventName.allCases.map { $0.rawValue })

        // MARK: Functions

        AsyncFunction(ModuleFunctionName.createPlaidLinkSession.rawValue) { (token: String, onLoadPromise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendEvent(ModuleEventName.onSuccess.rawValue, success.asDictionary)
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendEvent(ModuleEventName.onExit.rawValue, exit.asDictionary)
                self?.linkSession = nil
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendEvent(ModuleEventName.onEvent.rawValue, event.asDictionary)
            }

            let onLoad: OnLoadHandler = {
                DispatchQueue.main.async {
                    onLoadPromise.resolve()
                }
            }

            let config = LinkTokenConfiguration(
                token: token,
                onSuccess: onSuccess,
                onExit: onExit,
                onEvent: onEvent,
                onLoad: onLoad
            )

            do {
                let session = try Plaid.createPlaidLinkSession(configuration: config)
                self.linkSession = session
            } catch {
                self.sessionCreationError = error
                DispatchQueue.main.async {
                    onLoadPromise.reject("LINK_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.openLinkSession.rawValue) { (fullScreen: Bool, promise: Promise) in
            guard let session = self.linkSession else {
                let errorMessage = self.sessionCreationError?.localizedDescription ?? "createPlaidLinkSession was not called."
                let errorCode = self.sessionCreationError.map { String($0._code) } ?? "-1"
                self.sendEvent(ModuleEventName.onExit.rawValue, [
                    "displayMessage": errorMessage,
                    "errorCode": errorCode,
                    "errorType": "creation error",
                    "errorMessage": errorMessage,
                    "errorDisplayMessage": errorMessage,
                    "errorJson": NSNull(),
                    "metadata": [
                        "linkSessionId": NSNull(),
                        "institution": NSNull(),
                        "status": NSNull(),
                        "requestId": NSNull(),
                        "metadataJson": NSNull(),
                    ]
                ])
                
                DispatchQueue.main.async {
                    promise.resolve() // not a failure to open, just a miscall
                }

                return
            }

            DispatchQueue.main.async {
                guard let vc = self.appContext?.utilities?.currentViewController() else {
                    promise.reject("PLAID_NO_VC", "Could not find current view controller.")
                    return
                }

                if fullScreen {
                    let presentationHandler: PresentationHandler = { linkVC in
                        linkVC.modalPresentationStyle = .overFullScreen
                        linkVC.modalTransitionStyle = .coverVertical
                        vc.present(linkVC, animated: true)
                    }
                    let dismissalHandler: DismissalHandler = { linkVC in
                        linkVC.presentingViewController?.dismiss(animated: true)
                    }
                    session.open(using: .custom(presentationHandler, dismissalHandler))
                } else {
                    session.open(using: .viewController(vc))
                }

                promise.resolve()
            }
        }
    }

    // MARK: Enums

    /// Event names that the module can send to JavaScript.
    enum ModuleEventName: String, CaseIterable {
        case onSuccess
        case onExit
        case onEvent
    }

    /// Function names that the module can call from JavaScript.
    enum ModuleFunctionName: String, CaseIterable {
        case createPlaidLinkSession
        case openLinkSession
    }

    // MARK: Private

    private var linkSession: PlaidLinkSession?
    private var sessionCreationError: Error?
}

// MARK: Private Extensions

fileprivate extension Institution {
    var asDictionary: [String: Any] {
        return [
            "name": name ?? "",
            "id": ID ?? "",
        ]
    }
}

fileprivate extension Account {
    var asDictionary: [String: Any] {
        [
            "id": self.id,
            "name": self.name,
            "mask": self.mask ?? "",
            "subtype": self.subtype.description,
            "type": subtype.typeName,
            "verificationStatus": verificationStatus?.description ?? "",
        ]
    }
}

// FIXME: Remove this once type is public on AccountSubtype.
fileprivate extension AccountSubtype {
    var typeName: String {
        switch self {
        case .other:        return "other"
        case .credit:       return "credit"
        case .loan:         return "loan"
        case .depository:   return "depository"
        case .investment:   return "investment"
        case .unknown(let type, _): return type
        }
    }
}

fileprivate extension LinkSuccess {
    var asDictionary: [String: Any] {
        [
            "publicToken": publicToken,
            "metadata": [
                "linkSessionId": metadata.linkSessionID,
                "institution": metadata.institution.asDictionary ?? "",
                "accounts": metadata.accounts.map { $0.asDictionary },
                "metadataJson": metadata.metadataJSON ?? "",
            ]
        ]
    }
}

fileprivate extension LinkExit {
    var asDictionary: [String: Any] {
        [
            "error": error?.asDictionary ?? [:],
            "metadata": [
                "status": metadata.status?.description ?? "",
                "institution": metadata.institution?.asDictionary ?? "",
                "requestId": metadata.requestID ?? "",
                "linkSessionId": metadata.linkSessionID ?? "",
                "metadataJson": metadata.metadataJSON ?? "",
            ]
        ]
    }
}

fileprivate extension LinkEvent {
    var asDictionary: [String: Any] {
        [
            "eventName": eventName.description,
            "metadata": metadata.asDictionary,
        ]
    }
}

fileprivate extension EventMetadata {
    var asDictionary: [String: Any] {
        [
            "errorType": errorCode?.errorType ?? "",
            "errorCode": errorCode?.description ?? "",
            "errorMessage": errorMessage ?? "",
            "exitStatus": exitStatus?.description ?? "",
            "institutionId": institutionID ?? "",
            "institutionName": institutionName ?? "",
            "institutionSearchQuery": institutionSearchQuery ?? "",
            "accountNumberMask": accountNumberMask ?? "",
            "isUpdateMode": isUpdateMode ?? "",
            "matchReason": matchReason ?? "",
            "routingNumber": routingNumber ?? "",
            "selection": selection ?? "",
            "linkSessionId": linkSessionID,
            "mfaType": mfaType?.description ?? "",
            "requestId": requestID ?? "",
            "issueId": issueID ?? "",
            "issueDescription": issueDescription ?? "",
            "issueDetectedAt": issueDetectedAt.map(iso8601String) ?? "",
            "timestamp": iso8601String(from: timestamp),
            "viewName": viewName?.description ?? "",
            "metadataJson": metadataJSON ?? "",
        ]
    }
}

fileprivate extension ExitStatus {
    var stringValue: String { self.description } // qwe use this directly!
}

fileprivate extension MFAType {
    var stringValue: String { self.description } // qwe use this directly!
}

fileprivate extension ExitError {
    var asDictionary: [String: Any] {
        [
            "errorType": self.errorCode.description,
            "errorCode": self.errorCode.errorCodeString,
            "errorMessage": self.errorMessage,
            "displayMessage": self.displayMessage ?? "",
            "errorJson": self.errorJSON ?? "",
        ]
    }
}

fileprivate extension ExitErrorCode {
    var errorCodeString: String {
        switch self {
        case .apiError(let code): return code.description
        case .authError(let code): return code.description
        case .assetReportError(let code): return code.description
        case .internal(let code): return code
        case .institutionError(let code): return code.description
        case .itemError(let code): return code.description
        case .invalidInput(let code): return code.description
        case .invalidRequest(let code): return code.description
        case .rateLimitExceeded(let code): return code.description
        case .unknown(let type, let code): return code
        }
    }
}

private func iso8601String(from date: Date) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime]
    return formatter.string(from: date)
}