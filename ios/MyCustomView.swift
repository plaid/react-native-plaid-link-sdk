import UIKit

class MyCustomView: UIView {

    @objc var status = false {
        didSet {
            self.setupView()
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setupView()
    }

    private func setupView() {
      self.backgroundColor = self.status ? .green : .red
      self.isUserInteractionEnabled = true
    }
}

@objc(RCTMyCustomViewManager)
class RCTMyCustomViewManager: RCTViewManager {

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        return MyCustomView()
    }

}
