import UIKit

class PLKEmbeddedView: UIView {

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
