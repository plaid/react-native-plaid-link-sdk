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
        Constant("sdkVersion") { RNPlaidLinkSdkVersion.sdkVersion }

        // Defines event names that the module can send to JavaScript.
        Events(ModuleEventName.allCases.map { $0.rawValue })

        // MARK: Views

        View(PlaidEmbeddedSearchView.self) {
            Events("onSuccess", "onExit", "onEvent", "onLoad")

            Prop("token") { (view: PlaidEmbeddedSearchView, token: String) in
                view.setToken(token)
            }
        }

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

        AsyncFunction(ModuleFunctionName.createPlaidLayerSession.rawValue) { (token: String, promise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendEvent(ModuleEventName.onSuccess.rawValue, success.asDictionary)
                self?.layerSession = nil
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendEvent(ModuleEventName.onExit.rawValue, exit.asDictionary)
                self?.layerSession = nil
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendEvent(ModuleEventName.onEvent.rawValue, event.asDictionary)
            }

            let config = LayerTokenConfiguration(
                token: token,
                onSuccess: onSuccess,
                onExit: onExit,
                onEvent: onEvent
            )

            do {
                let session = try Plaid.createPlaidLayerSession(configuration: config)
                self.layerSession = session
                DispatchQueue.main.async {
                    promise.resolve()
                }
            } catch {
                self.sessionCreationError = error
                DispatchQueue.main.async {
                    promise.reject("LAYER_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.createPlaidHeadlessSession.rawValue) {
            (token: String, onLoadPromise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendEvent(ModuleEventName.onSuccess.rawValue, success.asDictionary)
                self?.headlessSession = nil
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendEvent(ModuleEventName.onExit.rawValue, exit.asDictionary)
                self?.headlessSession = nil
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
                let session = try Plaid.createHeadlessSession(configuration: config)
                self.headlessSession = session
            } catch {
                self.sessionCreationError = error
                DispatchQueue.main.async {
                    onLoadPromise.reject("HEADLESS_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.openLinkSession.rawValue) { (fullScreen: Bool, promise: Promise) in
            guard let session = self.linkSession else {
                let errorMessage =
                    self.sessionCreationError?.localizedDescription ?? "createPlaidLinkSession was not called."
                let errorCode = self.sessionCreationError.map { String($0._code) } ?? "-1"
                self.sendEvent(
                    ModuleEventName.onExit.rawValue,
                    [
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
                        ],
                    ]
                )

                DispatchQueue.main.async {
                    promise.resolve()  // not a failure to open, just a miscall
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

        AsyncFunction(ModuleFunctionName.openLayerSession.rawValue) { (promise: Promise) in
            guard let layerSession = self.layerSession else {
                let errorMessage =
                    self.sessionCreationError?.localizedDescription ?? "createPlaidLayerSession was not called."
                let errorCode = self.sessionCreationError.map { String($0._code) } ?? "-1"
                self.sendEvent(
                    ModuleEventName.onExit.rawValue,
                    [
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
                        ],
                    ]
                )

                DispatchQueue.main.async {
                    promise.resolve()
                }

                return
            }

            DispatchQueue.main.async {
                guard let vc = self.appContext?.utilities?.currentViewController() else {
                    promise.reject("PLAID_NO_VC", "Could not find current view controller.")
                    return
                }

                print("[Swift] Opening Layer session")
                layerSession.open(using: .viewController(vc))
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.submitLayerData.rawValue) {
            (phoneNumber: String?, dateOfBirth: String?, params: [String: String]?, promise: Promise) in
            guard let layerSession = self.layerSession else {
                promise.reject("PLAID_NO_LAYER_SESSION", "Layer session not found. Call createPlaidLayerSession first.")
                return
            }

            let submissionData = LayerSubmissionData(
                phoneNumber: phoneNumber,
                dateOfBirth: dateOfBirth,
                params: params
            )

            DispatchQueue.main.async {
                layerSession.submit(data: submissionData)
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.startHeadlessSession.rawValue) { (promise: Promise) in
            guard let headlessSession = self.headlessSession else {
                let errorMessage =
                    self.sessionCreationError?.localizedDescription ?? "createPlaidHeadlessSession was not called."
                let errorCode = self.sessionCreationError.map { String($0._code) } ?? "-1"
                self.sendEvent(
                    ModuleEventName.onExit.rawValue,
                    [
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
                        ],
                    ]
                )

                DispatchQueue.main.async {
                    promise.resolve()
                }

                return
            }

            DispatchQueue.main.async {
                headlessSession.start()
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.syncFinanceKit.rawValue) {
            (token: String, requestAuthorizationIfNeeded: Bool, syncBehavior: Int, promise: Promise) in
            if #available(iOS 17.4, *) {
                let behavior: PlaidFinanceKit.SyncBehavior = syncBehavior == 0 ? .live : .simulated

                PlaidFinanceKit.sync(
                    token: token,
                    requestAuthorizationIfNeeded: requestAuthorizationIfNeeded,
                    syncBehavior: behavior,
                    completion: { result in
                        DispatchQueue.main.async {
                            switch result {
                            case .success:
                                promise.resolve()
                            case .failure(let error):
                                let errorDict = error.asFinanceKitErrorDictionary
                                promise.reject(
                                    errorDict["errorCode"] as? String ?? "FINANCE_KIT_ERROR",
                                    errorDict["errorMessage"] as? String ?? error.localizedDescription
                                )
                            }
                        }
                    }
                )
            } else {
                DispatchQueue.main.async {
                    promise.reject("UNSUPPORTED_IOS_VERSION", "FinanceKit requires iOS 17.4 or later")
                }
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
        case createPlaidLayerSession
        case createPlaidHeadlessSession
        case openLinkSession
        case openLayerSession
        case submitLayerData
        case startHeadlessSession
        case syncFinanceKit
    }

    // MARK: Private

    private var linkSession: PlaidLinkSession?
    private var layerSession: PlaidLayerSession?
    private var headlessSession: PlaidHeadlessSession?
    private var sessionCreationError: Error?
}

// MARK: Internal Extensions

extension Institution {
    var asDictionary: [String: Any] {
        return [
            "name": name,
            "id": id,
        ]
    }
}

extension Account {
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
extension AccountSubtype {
    var typeName: String {
        switch self {
        case .other: return "other"
        case .credit: return "credit"
        case .loan: return "loan"
        case .depository: return "depository"
        case .investment: return "investment"
        case .unknown(let type, _): return type
        @unknown default: return "UNKNOWN"
        }
    }
}

extension LinkSuccess {
    var asDictionary: [String: Any] {
        [
            "publicToken": publicToken,
            "metadata": [
                "linkSessionId": metadata.linkSessionID,
                "institution": metadata.institution.asDictionary,
                "accounts": metadata.accounts.map { $0.asDictionary },
                "metadataJson": metadata.metadataJSON ?? "",
            ],
        ]
    }
}

extension LinkExit {
    var asDictionary: [String: Any] {
        [
            "error": error?.asDictionary ?? [:],
            "metadata": [
                "status": metadata.status?.description ?? "",
                "institution": metadata.institution?.asDictionary ?? "",
                "requestId": metadata.requestID ?? "",
                "linkSessionId": metadata.linkSessionID ?? "",
                "metadataJson": metadata.metadataJSON ?? "",
            ],
        ]
    }
}

extension LinkEvent {
    var asDictionary: [String: Any] {
        [
            "eventName": eventName.description,
            "metadata": metadata.asDictionary,
        ]
    }
}

extension EventMetadata {
    var asDictionary: [String: Any] {
        [
            "errorType": errorCode?.description ?? "",
            "errorCode": errorCode?.errorCodeString ?? "",
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

extension ExitError {
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

extension ExitErrorCode {
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
        case .unknown(_, let code): return code
        @unknown default: return "UNKNOWN"
        }
    }
}

private func iso8601String(from date: Date) -> String {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime]
    return formatter.string(from: date)
}

struct LayerSubmissionData: SubmissionData {
    let phoneNumber: String?
    let dateOfBirth: String?
    let params: [String: String]?
}

@available(iOS 17.4, *)
extension LinkKit.FinanceKitError {
    fileprivate var asFinanceKitErrorDictionary: [String: Any] {
        let errorType: Int
        let errorCode: String
        let errorMessage: String

        switch self {
        case .invalidToken:
            errorType = 0
            errorCode = "INVALID_TOKEN"
            errorMessage = self.localizedDescription
        case .permissionError:
            errorType = 1
            errorCode = "PERMISSION_ERROR"
            errorMessage = self.localizedDescription
        case .linkApiError:
            errorType = 2
            errorCode = "LINK_API_ERROR"
            errorMessage = self.localizedDescription
        case .permissionAccessError:
            errorType = 3
            errorCode = "PERMISSION_ACCESS_ERROR"
            errorMessage = self.localizedDescription
        case .unknown(let error):
            errorType = 4
            errorCode = "UNKNOWN"
            errorMessage = error.localizedDescription
        @unknown default:
            errorType = 4
            errorCode = "UNKNOWN"
            errorMessage = self.localizedDescription
        }

        return [
            "errorType": errorType,
            "errorCode": errorCode,
            "errorMessage": errorMessage,
        ]
    }
}
