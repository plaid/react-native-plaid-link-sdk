import Foundation

// Run git update-index --skip-worktree example/ios/plaidRNDemoTests/PlaidCredentials.swift
// to ensure this files changes are not picked up by git.
//
// Enter your client id and secret into this file.
// Then you can run the unit tests for the iOS project.
//
// After making changes you'll need to run
// git update-index --no-skip-worktree example/ios/plaidRNDemoTests/PlaidCredentials.swift
// git git stash -- example/ios/plaidRNDemoTests/PlaidCredentials.swift
//
// Before you can switch branches.

struct PlaidCredentials {
    static let clientID = "YOUR_CLIENT_ID"
    static let clientSecret = "YOUR_CLIENT_SECRET"
}
