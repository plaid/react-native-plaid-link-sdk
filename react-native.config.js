const path = require('path');

module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: path.join(
          __dirname,
          'react-native-plaid-link-sdk.podspec',
        ),
      },
      android: {
        packageImportPath: 'import com.plaid.PlaidPackage;',
        packageInstance: 'new PlaidPackage()',
      },
    },
  },
};
