import XCTest

final class PlaidRNDemoUITests: XCTestCase {

  override func setUp() async throws {
    try await super.setUp()
    // Reset the app for each test.
    app = XCUIApplication()
    continueAfterFailure = false
  }

  override func tearDown() {
    super.tearDown()
    // Terminate the app after each test case.
    app.terminate()
  }

  override func setUpWithError() throws {
    XCUIDevice.shared.orientation = .portrait
  }

  /// `XCUIApplication` representing the app. May or may not be running.
  var app: XCUIApplication = XCUIApplication()

  /// `XCUIElement` representing the apps first webview match.
  var webview: XCUIElement { app.webViews.firstMatch }

  /// Default amount of time to wait for elements before throwing an error.
  let defaultTimeout: TimeInterval = 25.0

  private(set) var clientID: String = ""
  private(set) var apiSecret: String = ""

  func enterToken(token: String) throws {
    let tokenTextField = app.otherElements["link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"]
    let openElements = app.otherElements.matching(identifier: "OPEN LINK")
    let _ = tokenTextField.waitForExistence(timeout: defaultTimeout)

    guard tokenTextField.exists else {
      throw UITestError.elementDoesNotExist(message: "Token TextField does not exist.")
    }

    UIPasteboard.general.string = token
    tokenTextField.doubleTap()
    sleep(2)
    tokenTextField.doubleTap()

    // Typing in the link token caused issues where it would type "lnk-token-xxxx" which resulted
    // in the inability to fetch a token. I am not sure what caused this issue, but that's why I am
    // using copy paste.
    app.menuItems["Paste"].tap()

    openElements.allElementsBoundByIndex.forEach { $0.tap() }
  }

  /// Launches the app
  func launchApp() async throws {
    XCTAssertTrue(app.state == .notRunning)

    guard app.state == .notRunning else {
        throw UITestError.appAlreadyLaunched
    }

    await MainActor.run {
      app.launchEnvironment["isUITest"] = "true"
      app.launch()
    }
  }
}

// MARK: Tests

extension PlaidRNDemoUITests {

  /// Tests that credential entry FI works as expected on iOS.
  func testCredentialEntryHappyPath() async throws {
    try await launchApp()

    let clientID = PlaidCredentials.clientID
    let clientSecret = PlaidCredentials.clientSecret

    guard clientID.uppercased() != "YOUR_CLIENT_ID" && clientSecret.uppercased() != "YOUR_CLIENT_SECRET" else {
      XCTFail("Set clientID and clientSecret in PlaidCredentials.swift")
      return
    }

    let token = try await TestTokenLoader.loadToken(clientID: clientID, secret: clientSecret)

    try await MainActor.run {
        try enterToken(token: token)
        try validateConsentPane()
        try continueThroughConsentPane()
        try select(institution: "TD Bank")
        try validateCredentialEntryPane()
        try enterCredentials(username: "user_good", password: "pass_good")
        try continueThroughAccountSelection(selectingAccounts: ["Plaid checking"])
        try continueThroughConsentPane()

        // Verify the webview was dismissed.
        try assert(element: webview, exists: false, timeout: defaultTimeout)
    }
  }
}

// MARK: Pane Actions

extension PlaidRNDemoUITests {

    /// Presses the button with the provided title if it exists.
    func pressButton(title: String) throws {
        let element = findElement(with: .matching(title), queryKeyPath: \.buttons)
        try assert(element: element, exists: true, timeout: defaultTimeout)
        element.tap()
    }

    /// Pressed the institution button with the provided name if it exists.
    func select(institution: String) throws {
        let element = findElement(with: .containing(institution), queryKeyPath: \.buttons)
        try assert(element: element, exists: true, timeout: defaultTimeout)
        element.tap()
    }

    /// Enters the provided credentials if the username & password TextFields exist.
    func enterCredentials(username: String, password: String) throws {
        let usernameField = webview.descendants(matching: .textField).element
        let passwordField = webview.descendants(matching: .secureTextField).element
        let _ = usernameField.waitForExistence(timeout: defaultTimeout)

        guard usernameField.exists else {
            throw UITestError.elementDoesNotExist(message: "Username TextField does not exist.")
        }

        guard passwordField.exists else {
            throw UITestError.elementDoesNotExist(message: "Password TextField does not exist.")
        }

        usernameField.tap()
        usernameField.typeText(username)

        passwordField.tap()
        passwordField.typeText(password)

        // Explicitly dismiss keyboard in case the WebView did not scroll the password field
        // to the center of the visible area when tapped revealing the Submit button on small(er) screens.
        app.toolbars["Toolbar"].buttons["Done"].tap()

        try pressButton(title: "Submit")
    }

    /// Selects the provided account.
    func select(account: String) throws {
        let predicate: ElementPredicate = .containing(account)
        let element = findElement(with: predicate, queryKeyPath: \.staticTexts)
        try assert(element: element, exists: true, timeout: defaultTimeout)
        element.tap()
    }

    /// Presses the `Continue` button on the consent pane.
    func continueThroughConsentPane() throws {
        try pressButton(title: "Continue")
    }

    /// Selects the provideded accounts and then presses the continue button
    /// to advance to the next pane.
    func continueThroughAccountSelection(selectingAccounts accounts: [String]) throws {
        for account in accounts {
            try select(account: account)
        }

        let predicate: ElementPredicate = .matching("Continue")
        let element = findElement(with: predicate, queryKeyPath: \.buttons)
        try assert(element: element, exists: true, timeout: defaultTimeout)

        element.tap()
    }

    /// Presses the success button (if it exists) on the current pane.
    func continueThroughSuccessPane() throws {
        let predicate: ElementPredicate = .matching("Success")
        let element = findElement(with: predicate, queryKeyPath: \.buttons)
        try assert(element: element, exists: true, timeout: defaultTimeout)

        element.tap()
    }
}

// MARK: Pane Validation

extension PlaidRNDemoUITests {

    /// Verifies the existance of the text we expect to see on the `Consent` pane.
    /// - Note: Throws error if the text does not exist.
    func validateConsentPane() throws {
        let predicate: ElementPredicate = .oneOf([
            .containing("Connect effortlessly"),
            .containing("Your data belongs to you"),
            .containing("Data you'll share"),
            .containing("By clicking “Continue” you agree to Plaid"),
            .containing("By selecting “Continue” you agree"),
        ])

        let element = findElement(with: predicate, queryKeyPath: \.staticTexts)
        try assert(element: element, exists: true, timeout: defaultTimeout)
    }

    /// Verifies the existance of the text we expect to see on the `InstitionSelect` pane.
    /// - Note: Throws error if the text does not exist.
    func validateInstitionSelectPane() throws {
        let predicate: ElementPredicate = .oneOf([
            .containing("Slect your institution"),
            .containing("Search Institutions"),
        ])

        let element = findElement(with: predicate, queryKeyPath: \.staticTexts)
        try assert(element: element, exists: true, timeout: defaultTimeout)
    }

    /// Verifies the existance of the text we expect to see on the `CredentialEntry` pane.
    /// - Note: Throws error if the text does not exist.
    func validateCredentialEntryPane() throws {
        let predicate: ElementPredicate = .matching("Enter your credentials")
        let element = findElement(with: predicate, queryKeyPath: \.staticTexts)
        try assert(element: element, exists: true, timeout: defaultTimeout)
    }
}

// MARK: XCUITest Helpers

extension PlaidRNDemoUITests {

    func existsPredicate(exists: Bool) -> NSPredicate {
        let qualifier = exists ? "TRUE" : "FALSE"
        return NSPredicate(format: "exists == \(qualifier)")
    }

    func waitForExistence(of element: XCUIElement, exists: Bool, timeout: TimeInterval) -> Bool {
        let predicate = existsPredicate(exists: exists)
        let expectation = XCTNSPredicateExpectation(predicate: predicate, object: element)
        let waiterResult = XCTWaiter().wait(for: [expectation], timeout: timeout)
        return waiterResult == .completed
    }

    func assert(element: XCUIElement, exists: Bool, timeout: TimeInterval) throws {
        let success = waitForExistence(of: element, exists: exists, timeout: timeout)

        guard success else {
            let msg = """
                Element with label=\(element.label) identifier=\(element.identifier) does\(exists ? "n't" : "") exist
                """
            throw UITestError.elementDoesNotExist(message: msg)
        }
    }

    func findElement(
        with predicate: ElementPredicate,
        queryKeyPath: KeyPath<XCUIElementTypeQueryProvider, XCUIElementQuery>
    ) -> XCUIElement {

        return webview[keyPath: queryKeyPath]
            .element(matching: predicate.toNSPredicate())
            .firstMatch
    }
}
