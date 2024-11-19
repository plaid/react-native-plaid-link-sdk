import LinkKit
import React

@objc(RNLinksdk)
class RNLinksdk: RCTEventEmitter {

    // MARK: Internal Constants

    let linkKitOnEventNotification = "onEvent"
    let linkKitVersionConstant = "version"

    // MARK: RCTEventEmitter

    override func supportedEvents() -> [String] {
        return [linkKitOnEventNotification]
    }

    override func startObserving() {
        self.hasOnEventObserver = true
        super.startObserving()
    }

    override func stopObserving() {
        self.hasOnEventObserver = false
        super.stopObserving()
    }

    override class func requiresMainQueueSetup() -> Bool {
        // LinkKit relies on UIKit.
        return true
    }

    class func sdkVersion() -> String {
        // SDK_VERSION
        return "11.13.2"
    }

    class func objCBridgeVersion() -> String {
        return "3.0.0"
    }

    override func constantsToExport() -> [AnyHashable: Any]! {
        [
            linkKitVersionConstant: String(format: "%s+%.0f", Plaid.version, LinkKitBuild)
        ]
    }

    // MARK: LinkKit API

    @objc(create:noLoadingState:)
    func create(token: String, noLoadingState: Bool) {

        let onSuccess: OnSuccessHandler = { [weak self] success in
            guard let self = self else { return }

            if let successCallback = self.successCallback {
                let successsMetadata = JSONHelper.dictionaryFromSuccess(success: success)
                successCallback([successsMetadata])
                self.successCallback = nil
            }
        }

        let onExit: OnExitHandler = { [weak self] exit in
            guard let self = self else { return }

            if let exitCallback = self.exitCallback {
                let exitMetadata = JSONHelper.dictionaryFromExit(exit: exit)
                if exit.error != nil {
                    exitCallback([exitMetadata["error"] ?? [:], exitMetadata])
                } else {
                    exitCallback([NSNull(), exitMetadata])
                }
            }
        }

        let onEvent: OnEventHandler = { [weak self] event in
            guard let self = self, self.hasOnEventObserver else { return }

            let eventDictionary = JSONHelper.dictionaryFromEvent(event)
            sendLinkEvent(eventDictionary: eventDictionary)
        }

        var configuration = LinkTokenConfiguration(token: token, onSuccess: onSuccess)
        configuration.onExit = onExit
        configuration.onEvent = onEvent

        let result = Plaid.create(configuration)
        switch result {
        case .success(let handler):
            self.handler = handler
        case .failure(let error):
            self.createError = error
        }
    }

    @objc(open:onSuccess:onExit:)
    func open(fullScreen: Bool, onSuccess: @escaping RCTResponseSenderBlock, onExit: @escaping RCTResponseSenderBlock) {
        DispatchQueue.main.async {
            guard let handler = self.handler else {
                let errorMessage = self.createError?.localizedDescription ?? "Create was not called."
                let errorCode = self.createError.map { String($0.code) } ?? "-1"

                let linkExit: [String: Any] = [
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

                onExit([linkExit])
                return
            }

            self.successCallback = onSuccess
            self.exitCallback = onExit
            self.presentingViewController = RCTPresentedViewController()

            // Track if presentation happened to avoid unnecessary dismissal invocation
            var didPresent = false

            // Capture weak reference to self to avoid retain cycles
            weak var weakSelf = self

            // Define the presentation handler
            let presentationHandler: (UIViewController) -> Void = { linkViewController in
                if fullScreen {
                    linkViewController.modalPresentationStyle = .overFullScreen
                    linkViewController.modalTransitionStyle = .coverVertical
                }

                weakSelf?.presentingViewController?.present(linkViewController, animated: true, completion: nil)
                didPresent = true
            }

            // Define the dismissal handler
            let dismissalHandler: (UIViewController) -> Void = { linkViewController in
                if didPresent {
                    didPresent = false

                    DispatchQueue.main.async {
                        weakSelf?.presentingViewController?.dismiss(animated: true, completion: nil)
                    }
                }
            }

            // Open with the defined handlers
            handler.open(presentUsing: .custom(presentationHandler, dismissalHandler))
        }
    }

    @objc(dismiss)
    func dismiss() {
        DispatchQueue.main.async {
            self.presentingViewController?.dismiss(animated: true)
        }
    }

    @objc(submit:)
    func submit(phoneNumber: String) {
        let submissionData = LayerSubmissionData(phoneNumber: phoneNumber)
        handler?.submit(data: submissionData)
    }

    @objc(syncFinanceKit:requestAuthorizationIfNeeded:onSuccess:onError:)
    @available(iOS 17.4, *)
    func syncFinanceKit(
        token: String,
        requestAuthorizationIfNeeded: Bool,
        onSuccess: @escaping RCTResponseSenderBlock,
        onError: @escaping RCTResponseSenderBlock
    ) {

        Plaid.syncFinanceKit(
            token: token,
            requestAuthorizationIfNeeded: requestAuthorizationIfNeeded,
            completion: { result in
                switch result {
                case .success:
                    onSuccess([])
                case .failure(let error):
                    let financeKitError: [String: Any] = [
                        "type": error.code,
                        "message": error.localizedDescription,
                    ]

                    onError([financeKitError])
                }
            }
        )
    }

    // MARK: Private

    private var successCallback: RCTResponseSenderBlock?
    private var exitCallback: RCTResponseSenderBlock?

    private var handler: LinkKit.Handler?
    private var createError: LinkKit.Plaid.CreateError?

    private var presentingViewController: UIViewController?

    private var hasOnEventObserver: Bool = false

    private func sendLinkEvent(eventDictionary: [String: Any]) {
        sendEvent(withName: linkKitOnEventNotification, body: eventDictionary)
    }
}
