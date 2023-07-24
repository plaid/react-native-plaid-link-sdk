import XCTest
import LinkKit

final class PlaidRNDemoTests: XCTestCase {

  func testVersion() {

    let version = LinkKitVersion

    XCTAssertEqual(version, "4.4.0")
  }
}
