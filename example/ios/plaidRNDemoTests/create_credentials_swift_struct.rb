#!/usr/bin/ruby

CLIENT_ID = ARGV[0]
SECRET = ARGV[1]

if(CLIENT_ID != nil and SECRET != nil)
  file_content = <<-CREDS_FILE_STRING
  import Foundation

  // Run git update-index --skip-worktree example/ios/plaidRNDemoTests/PlaidCredentials.swift
  // to ensure this files changes are not picked up by git.
  //
  // Enter your client id and secret into this file.
  // Then you can run the unit tests for the iOS project.

  struct PlaidCredentials {
      static let clientID = "#{CLIENT_ID}"
      static let clientSecret = "#{SECRET}"
  }
  CREDS_FILE_STRING

  file = File.new("example/ios/plaidRNDemoTests/PlaidCredentials.swift", "w")
  file.puts(file_content)
  file.close
else
  abort("Failed to pass client id and secret.")
end
