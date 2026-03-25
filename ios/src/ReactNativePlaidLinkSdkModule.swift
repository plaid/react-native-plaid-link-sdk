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
                self?.sendEvent(ModuleEventName.onSuccess.rawValue, ["onSuccess": "fixme"])
            }

            let onExit: OnExitHandler = { [weak self] exit in
                self?.sendEvent(ModuleEventName.onExit.rawValue, ["onExit": "fixme"])
                self?.linkSession = nil
            }

            let onEvent: OnEventHandler = { [weak self] event in
                self?.sendEvent(ModuleEventName.onEvent.rawValue, ["onEvent": event.eventName.description]) // fixme!
            }

            let onLoad: OnLoadHandler = {
                onLoadPromise.resolve()
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
                onLoadPromise.reject("LINK_SESSION_CREATE_ERROR", error.localizedDescription)
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
                promise.resolve() // not a failure to open, just a miscall
                return
            }

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
