require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = "https://plaid.com/docs/link/ios/"
  s.platform     = :ios, "11.0"

  s.source       = { :git => "https://github.com/plaid/react-native-plaid-link-sdk.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/*.{h,m}"

  s.dependency 'React-Core'
  s.dependency 'Plaid', '~> 4.1.0'
end
