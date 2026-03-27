import ExpoModulesCore
import UIKit
internal import LinkKit

class PlaidEmbeddedSearchView: ExpoView {
    private var embeddedView: EmbeddedSearchUIView?
    
    let onSuccess = EventDispatcher()
    let onExit = EventDispatcher()
    let onEvent = EventDispatcher()
    let onLoad = EventDispatcher()
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        clipsToBounds = true
    }
    
    func setToken(_ token: String) {
        embeddedView?.removeFromSuperview()
        embeddedView = nil
        
        let configuration = EmbeddedLinkTokenConfiguration(
            token: token,
            onSuccess: { [weak self] linkSuccess in
                self?.onSuccess(linkSuccess.asDictionary)
            },
            onExit: { [weak self] linkExit in
                self?.onExit(linkExit.asDictionary)
            },
            onEvent: { [weak self] linkEvent in
                self?.onEvent(linkEvent.asDictionary)
            }
        )
        
        guard let viewController = appContext?.utilities?.currentViewController() else {
            let errorExit: [String: Any] = [
                "error": [
                    "errorCode": "NO_VIEW_CONTROLLER",
                    "errorType": "INTERNAL_ERROR",
                    "errorMessage": "Could not find current view controller",
                    "displayMessage": "Could not find current view controller",
                    "errorJson": NSNull(),
                ],
                "metadata": [
                    "linkSessionId": NSNull(),
                    "institution": NSNull(),
                    "status": NSNull(),
                    "requestId": NSNull(),
                    "metadataJson": NSNull(),
                ]
            ]
            self.onExit(errorExit)
            return
        }
        
        do {
            let plaidEmbeddedView = try Plaid.createEmbeddedLinkUIView(
                configuration: configuration,
                presentationMethod: .viewController(viewController)
            )
            
            self.embeddedView = plaidEmbeddedView
            
            plaidEmbeddedView.translatesAutoresizingMaskIntoConstraints = false
            addSubview(plaidEmbeddedView)
            
            NSLayoutConstraint.activate([
                plaidEmbeddedView.topAnchor.constraint(equalTo: topAnchor),
                plaidEmbeddedView.leadingAnchor.constraint(equalTo: leadingAnchor),
                plaidEmbeddedView.trailingAnchor.constraint(equalTo: trailingAnchor),
                plaidEmbeddedView.bottomAnchor.constraint(equalTo: bottomAnchor),
            ])
            
            self.onLoad([:])
            
        } catch {
            let errorExit: [String: Any] = [
                "error": [
                    "errorCode": "CREATE_VIEW_ERROR",
                    "errorType": "INTERNAL_ERROR",
                    "errorMessage": error.localizedDescription,
                    "displayMessage": error.localizedDescription,
                    "errorJson": NSNull(),
                ],
                "metadata": [
                    "linkSessionId": NSNull(),
                    "institution": NSNull(),
                    "status": NSNull(),
                    "requestId": NSNull(),
                    "metadataJson": NSNull(),
                ]
            ]
            self.onExit(errorExit)
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        embeddedView?.frame = bounds
    }
}
