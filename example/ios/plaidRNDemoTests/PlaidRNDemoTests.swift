import XCTest
import LinkKit

final class PlaidRNDemoTests: XCTestCase {

  func testVersion() {
    let version = LinkKitVersion

    XCTAssertEqual(version, "4.4.0")
  }

  func testPlaidCredentialsExist() {
    let clientID = PlaidCredentials.clientID

    XCTAssertNotEqual(clientID, "YOUR_CLIENT_ID")
    XCTAssertFalse(clientID.contains("*"))

    let secret = PlaidCredentials.clientSecret

    XCTAssertNotEqual(secret, "YOUR_CLIENT_SECRET")
    XCTAssertFalse(secret.contains("*"))
  }
}
