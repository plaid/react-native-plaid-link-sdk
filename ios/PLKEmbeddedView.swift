import LinkKit
import UIKit

internal final class PLKEmbeddedView: UIView {

    // Properties exposed to React Native.

    @objc var presentationStyle: String = "" {
        didSet {
            createNativeEmbeddedView()
        }
    }

    @objc var token: String = "" {
        didSet {
            createNativeEmbeddedView()
        }
    }

    @objc var onSuccess: RCTDirectEventBlock?
    @objc var onEvent: RCTBubblingEventBlock?
    @objc var onExit: RCTDirectEventBlock?

    // MARK: Private

    private var linkHandler: Handler?

    private func createNativeEmbeddedView() {
        guard let rctViewController = RCTPresentedViewController() else { return }
        guard !token.isEmpty, !presentationStyle.isEmpty, linkHandler == nil else { return }

        var config = LinkTokenConfiguration(
            token: token,
            onSuccess: { [weak self] success in
                // TODO: pipe to onSuccess
                print(success)

//                let dict: [String : Any] = [
//                    "publicToken": success.publicToken,
//                    "metadata": [
//                        "linkSessionId": success.metadata.linkSessionID ?? "",
//                        "institution": success.metadata.institution.name,
//                        "acounts": success.metadata.accounts.flatMap({$0.name})
//                        "metadataJson": success.metadata.metadataJSON ?? ""
//                    ]
//                ]
        })

        config.onEvent = { [weak self] event in
            // TODO: pipe to onEvent
            print(event)

            let dict: [String: Any] = [
                "eventName": event.eventName.description
            ]

            self?.onEvent?(dict)

//            self?.onEvent?(["\(event.eventName.description)", dict])
        }

        config.onExit = { [weak self] exit in
            // TODO: pipe to onExit



//            let plkLinkExit = exit.toObjC
//            let metadata = RNLinksdk.dictionary(from: plkLinkExit)

//            onExit(m)
        }

        let handlerCreationResult = Plaid.create(config)
        switch handlerCreationResult {
        case .failure(let error):
            guard let onExit = onExit else { return }
            onExit(["error": error.localizedDescription])

        case .success(let handler):
            self.linkHandler = handler

            // TODO: Support custom presentation if `FULL_SCREEN`.
            let embeddedResult = handler.createEmbeddedView(presentUsing: .viewController(rctViewController))

            switch embeddedResult {
            case .failure(let error):
                // TODO: Send to on exit
                break
            case .success(let embeddedView):
                setup(embeddedView: embeddedView)
            }
        }
    }

    private func setup(embeddedView: UIView) {
        embeddedView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(embeddedView)

        NSLayoutConstraint.activate([
            embeddedView.topAnchor.constraint(equalTo: topAnchor),
            embeddedView.leadingAnchor.constraint(equalTo: leadingAnchor),
            embeddedView.trailingAnchor.constraint(equalTo: trailingAnchor),
            embeddedView.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
    }
}
