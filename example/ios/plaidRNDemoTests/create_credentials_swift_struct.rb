#!/usr/bin/ruby

puts Dir.pwd

File.readlines("plaidRNDemoTests/env-vars.txt").each do |line|
  values = line.split("=")
  ENV[values[0]] = values[1].strip
end

file_content = <<-CREDS_FILE_STRING
struct PlaidCredentials {
    static let clientID = "#{ENV['PLAID_CLIENT_ID']}"
    static let clientSecret = "#{ENV['PLAID_SECRET']}"
}
CREDS_FILE_STRING

file = File.new("plaidRNDemoTests/PlaidCredentials.swift", "w")
file.puts(file_content)
file.close
