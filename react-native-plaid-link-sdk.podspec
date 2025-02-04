require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = "https://plaid.com/docs/link/ios/"
  s.platform     = :ios, "14.0"

  s.source       = { :git => "https://github.com/plaid/react-native-plaid-link-sdk.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  # we need this since Swift generates import for `react_native_plaid_link_sdk/react_native_plaid_link_sdk.h` and we have to fake it
  s.header_dir = "react_native_plaid_link_sdk"
  # we don't want this to be seen by Swift
  s.private_header_files = 'ios/PLKFabricHelpers.h'

  if ENV['USE_FRAMEWORKS'] == '1'
    s.pod_target_xcconfig = {
      "OTHER_CFLAGS" => "$(inherited) -DUSE_FRAMEWORKS",
      "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -DUSE_FRAMEWORKS",
    }
  end

  if fabric_enabled
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end

  s.dependency 'React-Core'
  s.dependency 'Plaid', '~> 6.0.4'
end
