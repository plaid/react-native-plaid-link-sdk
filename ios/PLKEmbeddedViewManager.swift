import Foundation

@objc(PLKEmbeddedViewManager)
class PLKEmbeddedViewManager: RCTViewManager {

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        return PLKEmbeddedView()
    }

}
