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
//        Constants([
//            "sdkVersion": Plaid.version
//        ])
//
//        // --- Create Link Session API ---
//        // This receives a dictionary from JS and maps it to your Swift Configuration
//        AsyncFunction("createPlaidLinkSession") { (options: [String: Any], promise: Promise) in
//          guard let token = options["token"] as? String else {
//            promise.reject("ERR_PLAID_INVALID_TOKEN", "A link token must be provided.")
//            return
//          }
//
//          // 1. Create the configuration object your SDK expects
//          // Note: You'll need to map other JS options (onSuccess, onExit) here
//          let configuration = LinkTokenConfiguration(token: token) { success in
//              // Map LinkSuccess to JS Dictionary
//              promise.resolve([
//                "publicToken": success.publicToken,
//                "metadata": success.metadata.metadataJSON // Assuming this exists or map manually
//              ])
//          } onExit: { exit in
//              // Map LinkExit to JS Error/Dictionary
//              promise.reject("ERR_PLAID_EXIT", exit.errorJSON)
//          }
//
//          // 2. Call your Framework's public API
//          do {
//            self.currentSession = try Plaid.createPlaidLinkSession(configuration: configuration)
//
//            // 3. Present the UI
//            // Expo Modules provide access to the current utilities to find the ViewController
//            guard let currentVc = self.appContext?.utilities?.currentViewController() else {
//              promise.reject("ERR_PLAID_NO_VC", "Could not find current view controller")
//              return
//            }
//
//            // Assuming PlaidLinkSession has a present method
//            self.currentSession?.present(from: currentVc)
//
//          } catch {
//            promise.reject("ERR_PLAID_CONFIG", error.localizedDescription)
//          }
//        }

        // MARK: Default stuff

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("hello") {
            return "Hello world! 👋"
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("setValueAsync") { (value: String) in
            // Send an event to JavaScript.
            self.sendEvent(
                "onChange",
                [
                    "value": value
                ]
            )
        }

        // Enables the module to be used as a native view. Definition components that are accepted as part of the
        // view definition: Prop, Events.
        View(ReactNativePlaidLinkSdkView.self) {
            // Defines a setter for the `url` prop.
            Prop("url") { (view: ReactNativePlaidLinkSdkView, url: URL) in
                if view.webView.url != url {
                    view.webView.load(URLRequest(url: url))
                }
            }

            Events("onLoad")
        }
    }

//    private class Storage {
//        // We need a reference to the current session to keep it alive.
//        fileprivate static var linkSession: PlaidLinkSession?
//    }
}
