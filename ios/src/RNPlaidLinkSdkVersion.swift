import Foundation

/// Objective-C-compatible shim class that exposes the React Native SDK version.
///
/// This class serves two purposes:
/// 1. Provides a version constant for the Expo module to expose to JavaScript
/// 2. Enables runtime detection from native iOS code (backward compatibility)
///
/// The version should be manually updated to match the version in package.json
/// when releasing new versions of the React Native SDK.
@objc(RNPlaidLinkSdkVersion)
public class RNPlaidLinkSdkVersion: NSObject {
    
    /// The React Native Plaid Link SDK version.
    ///
    /// This should match the version specified in package.json.
    /// Update this value when bumping the SDK version.
    @objc public static let sdkVersion: String = "13.0.3"
}
