#!/usr/bin/ruby

puts Dir.pwd

File.readlines("plaidRNDemoTests/env-vars.txt").each do |line|
  values = line.split("=")
  ENV[values[0]] = values[1]
end

file_content = <<-CREDS_FILE_STRING
import Foundation

// Run git update-index --skip-worktree example/ios/plaidRNDemoTests/PlaidCredentials.swift
// to ensure this files changes are not picked up by git.
//
// Enter your secrets into env-vars.text like this
// PLAID_CLIENT_ID=xxxxxxxxxxxxxx
// PLAID_SECRET=xxxxxxxxxxxxxx
// Then run git update-index --skip-worktree example/ios/plaidRNDemoTests/env-vars.txt
// to avoid adding any of these changes to git.
//
// The build script will copy those vars for unit tests.

struct PlaidCredentials {
    static let clientID = "#{ENV['PLAID_CLIENT_ID']}"
    static let clientSecret = "#{ENV['PLAID_SECRET']}"
}
CREDS_FILE_STRING

file = File.new("plaidRNDemoTests/PlaidCredentials.swift", "w")
file.puts(file_content)
file.close
