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

        OnDestroy {
            self.clearAllSessions()
        }

        // MARK: Views

        View(PlaidEmbeddedSearchView.self) {
            Events("onSuccess", "onExit", "onEvent", "onLoad")

            Prop("token") { (view: PlaidEmbeddedSearchView, token: String) in
                view.setToken(token)
            }
        }

        // MARK: Functions

        AsyncFunction(ModuleFunctionName.createPlaidLinkSession.rawValue) {
            (clientSessionId: String, token: String, onLoadPromise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendSessionEvent(
                    ModuleEventName.onSuccess.rawValue,
                    clientSessionId: clientSessionId,
                    payload: success.asDictionary
                )
                self?.retainLinkSessionAfterSuccess(clientSessionId)
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendSessionEvent(
                    ModuleEventName.onExit.rawValue,
                    clientSessionId: clientSessionId,
                    payload: exit.asDictionary
                )
                self?.clearSession(clientSessionId)
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendSessionEvent(
                    ModuleEventName.onEvent.rawValue,
                    clientSessionId: clientSessionId,
                    payload: event.asDictionary
                )
                if event.eventName == .handoff {
                    self?.clearSession(clientSessionId)
                }
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
                self.linkSessions[clientSessionId] = session
            } catch {
                self.clearSession(clientSessionId)
                DispatchQueue.main.async {
                    onLoadPromise.reject("LINK_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.createPlaidLayerSession.rawValue) {
            (clientSessionId: String, token: String, promise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendSessionEvent(
                    ModuleEventName.onSuccess.rawValue,
                    clientSessionId: clientSessionId,
                    payload: success.asDictionary
                )
                self?.clearSession(clientSessionId)
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendSessionEvent(
                    ModuleEventName.onExit.rawValue,
                    clientSessionId: clientSessionId,
                    payload: exit.asDictionary
                )
                self?.clearSession(clientSessionId)
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendSessionEvent(
                    ModuleEventName.onEvent.rawValue,
                    clientSessionId: clientSessionId,
                    payload: event.asDictionary
                )
            }

            let config = LayerTokenConfiguration(
                token: token,
                onSuccess: onSuccess,
                onExit: onExit,
                onEvent: onEvent
            )

            do {
                let session = try Plaid.createPlaidLayerSession(configuration: config)
                self.layerSessions[clientSessionId] = session
                DispatchQueue.main.async {
                    promise.resolve()
                }
            } catch {
                self.clearSession(clientSessionId)
                DispatchQueue.main.async {
                    promise.reject("LAYER_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.createPlaidHeadlessSession.rawValue) {
            (clientSessionId: String, token: String, onLoadPromise: Promise) in
            let onSuccess: OnSuccessHandler = { [weak self] success in
                self?.sendSessionEvent(
                    ModuleEventName.onSuccess.rawValue,
                    clientSessionId: clientSessionId,
                    payload: success.asDictionary
                )
                self?.clearSession(clientSessionId)
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendSessionEvent(
                    ModuleEventName.onExit.rawValue,
                    clientSessionId: clientSessionId,
                    payload: exit.asDictionary
                )
                self?.clearSession(clientSessionId)
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendSessionEvent(
                    ModuleEventName.onEvent.rawValue,
                    clientSessionId: clientSessionId,
                    payload: event.asDictionary
                )
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
                self.headlessSessions[clientSessionId] = session
            } catch {
                self.clearSession(clientSessionId)
                DispatchQueue.main.async {
                    onLoadPromise.reject("HEADLESS_SESSION_CREATE_ERROR", error.localizedDescription)
                }
            }
        }

        AsyncFunction(ModuleFunctionName.openLinkSession.rawValue) {
            (clientSessionId: String, fullScreen: Bool, promise: Promise) in
            guard let session = self.linkSessions[clientSessionId] else {
                promise.reject("PLAID_NO_SESSION", "Plaid session not found for the supplied session identifier.")
                return
            }

            DispatchQueue.main.async {
                guard self.activateSession(clientSessionId, promise: promise) else {
                    return
                }
                guard let vc = self.appContext?.utilities?.currentViewController() else {
                    self.activeSessionId = nil
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

        AsyncFunction(ModuleFunctionName.openLayerSession.rawValue) {
            (clientSessionId: String, promise: Promise) in
            guard let layerSession = self.layerSessions[clientSessionId] else {
                promise.reject("PLAID_NO_LAYER_SESSION", "Layer session not found for the supplied session identifier.")
                return
            }

            DispatchQueue.main.async {
                guard self.activateSession(clientSessionId, promise: promise) else {
                    return
                }
                guard let vc = self.appContext?.utilities?.currentViewController() else {
                    self.activeSessionId = nil
                    promise.reject("PLAID_NO_VC", "Could not find current view controller.")
                    return
                }

                print("[Swift] Opening Layer session")
                layerSession.open(using: .viewController(vc))
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.submitLayerData.rawValue) {
            (clientSessionId: String, phoneNumber: String?, dateOfBirth: String?, params: [String: String]?, promise: Promise) in
            guard let layerSession = self.layerSessions[clientSessionId] else {
                promise.reject("PLAID_NO_LAYER_SESSION", "Layer session not found for the supplied session identifier.")
                return
            }

            let submissionData = LayerSubmissionData(
                phoneNumber: phoneNumber,
                dateOfBirth: dateOfBirth,
                params: params
            )

            DispatchQueue.main.async {
                guard self.activateSession(clientSessionId, promise: promise) else {
                    return
                }
                layerSession.submit(data: submissionData)
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.startHeadlessSession.rawValue) {
            (clientSessionId: String, promise: Promise) in
            guard let headlessSession = self.headlessSessions[clientSessionId] else {
                promise.reject("PLAID_NO_SESSION", "Plaid session not found for the supplied session identifier.")
                return
            }

            DispatchQueue.main.async {
                guard self.activateSession(clientSessionId, promise: promise) else {
                    return
                }
                headlessSession.start()
                promise.resolve()
            }
        }

        AsyncFunction(ModuleFunctionName.destroySession.rawValue) { (clientSessionId: String) in
            self.clearSession(clientSessionId)
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
        case onSuccess = "PlaidLink.onSuccess"
        case onExit = "PlaidLink.onExit"
        case onEvent = "PlaidLink.onEvent"
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
        case destroySession
        case syncFinanceKit
    }

    // MARK: Private

    private var linkSessions: [String: PlaidLinkSession] = [:]
    private var layerSessions: [String: PlaidLayerSession] = [:]
    private var headlessSessions: [String: PlaidHeadlessSession] = [:]
    private var postSuccessCleanupTasks: [String: DispatchWorkItem] = [:]
    private var activeSessionId: String?

    private func sendSessionEvent(
        _ eventName: String,
        clientSessionId: String,
        payload: [String: Any]
    ) {
        sendEvent(
            eventName,
            [
                "clientSessionId": clientSessionId,
                "payload": payload,
            ]
        )
    }

    private func activateSession(_ clientSessionId: String, promise: Promise) -> Bool {
        if let activeSessionId, activeSessionId != clientSessionId {
            promise.reject("PLAID_SESSION_ALREADY_ACTIVE", "Another Plaid session is already active.")
            return false
        }
        activeSessionId = clientSessionId
        return true
    }

    private func clearSession(_ clientSessionId: String) {
        postSuccessCleanupTasks.removeValue(forKey: clientSessionId)?.cancel()
        linkSessions.removeValue(forKey: clientSessionId)
        layerSessions.removeValue(forKey: clientSessionId)
        headlessSessions.removeValue(forKey: clientSessionId)
        if activeSessionId == clientSessionId {
            activeSessionId = nil
        }
    }

    private func retainLinkSessionAfterSuccess(_ clientSessionId: String) {
        if activeSessionId == clientSessionId {
            activeSessionId = nil
        }
        postSuccessCleanupTasks.removeValue(forKey: clientSessionId)?.cancel()

        let cleanupTask = DispatchWorkItem { [weak self] in
            self?.postSuccessCleanupTasks.removeValue(forKey: clientSessionId)
            self?.linkSessions.removeValue(forKey: clientSessionId)
        }
        postSuccessCleanupTasks[clientSessionId] = cleanupTask
        DispatchQueue.main.asyncAfter(
            deadline: .now() + Self.postSuccessEventWindow,
            execute: cleanupTask
        )
    }

    private func clearAllSessions() {
        postSuccessCleanupTasks.values.forEach { $0.cancel() }
        postSuccessCleanupTasks.removeAll()
        linkSessions.removeAll()
        layerSessions.removeAll()
        headlessSessions.removeAll()
        activeSessionId = nil
    }

    private static let postSuccessEventWindow: TimeInterval = 1.5
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
