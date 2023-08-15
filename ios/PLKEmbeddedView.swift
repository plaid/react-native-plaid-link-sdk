import LinkKit
import UIKit

internal final class PLKEmbeddedView: UIView {

    // Properties exposed to React Native.

    @objc var iOSPresentationStyle: String = "" {
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

    private func makeHandler() throws -> Handler {
        var config = LinkTokenConfiguration(
            token: token,
            onSuccess: { [weak self] success in
                let plkLinkSuccess = success.toObjC
                let dictionary = RNLinksdk.dictionary(from: plkLinkSuccess)
                self?.onSuccess?(dictionary)
        })

        config.onEvent = { [weak self] event in
            let plkLinkEvent = event.toObjC
            let dictionary = RNLinksdk.dictionary(from: plkLinkEvent)
            self?.onEvent?(dictionary)
        }

        config.onExit = { [weak self] exit in
            let plkLinkExit = exit.toObjC
            let dictionary = RNLinksdk.dictionary(from: plkLinkExit)
            self?.onExit?(dictionary)
        }

        let handlerCreationResult = Plaid.create(config)

        switch handlerCreationResult {
        case .failure(let error):
            throw(error)
        case .success(let handler):
            return handler
        }
    }

    private func makeEmbeddedView(rctViewController: UIViewController, handler: Handler) throws -> UIView {
        self.linkHandler = handler

        let presentationMethod: PresentationMethod

        if iOSPresentationStyle.uppercased() == "FULL_SCREEN" {
            presentationMethod = .custom({ viewController in
                viewController.modalPresentationStyle = .overFullScreen
                viewController.modalTransitionStyle = .coverVertical

                rctViewController.present(viewController, animated: true)
            })
        } else {
            presentationMethod = .viewController(rctViewController)
        }

        let embeddedResult = handler.createEmbeddedView(presentUsing: presentationMethod)

        switch embeddedResult {
        case .failure(let error):
            throw error

        case .success(let embeddedView):
            return embeddedView
        }
    }

    private func createNativeEmbeddedView() {
        guard let rctViewController = RCTPresentedViewController() else { return }
        guard !token.isEmpty, !iOSPresentationStyle.isEmpty, linkHandler == nil else { return }

        do {
            let handler = try makeHandler()
            let embeddedView = try makeEmbeddedView(rctViewController: rctViewController, handler: handler)
            setup(embeddedView: embeddedView)
        } catch {
            let metadata = PLKExitMetadata(
                status: nil,
                institution: nil,
                requestID: nil,
                linkSessionID: nil,
                metadataJSON: nil
            )

            let exit = PLKLinkExit(error: error, metadata: metadata)
            let dictionary = RNLinksdk.dictionary(from: exit)
            onExit?(dictionary)
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
