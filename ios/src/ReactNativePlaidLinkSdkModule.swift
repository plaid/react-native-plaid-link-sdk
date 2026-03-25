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
    }

    // MARK: Private

    private var linkSession: PlaidLinkSession?
    private var sessionCreationError: Error?
}
