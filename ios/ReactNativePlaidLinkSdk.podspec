require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ReactNativePlaidLinkSdk'
  s.module_name    = 'ReactNativePlaidLinkSdk'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = "https://github.com/plaid/react-native-plaid-link-sdk"
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/plaid/react-native-plaid-link-sdk' }
  s.source_files   = "**/*.{h,m,mm,swift}"
  s.dependency 'ExpoModulesCore'
  s.vendored_frameworks = 'Frameworks/LinkKit.xcframework'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'FRAMEWORK_SEARCH_PATHS' => '$(inherited) "${PODS_TARGET_SRCROOT}/Frameworks"',
    'OTHER_LDFLAGS' => '$(inherited) -framework "LinkKit"'
  }

  # Add this to ensure the folder isn't stripped during the build
  s.preserve_paths = 'Frameworks/LinkKit.xcframework'

  install_modules_dependencies(s)
end
