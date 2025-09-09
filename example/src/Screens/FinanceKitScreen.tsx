import React, {useState} from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {styles} from '../Styles';
import {FinanceKitError, syncFinanceKit} from 'react-native-plaid-link-sdk';

export function FinanceKitScreen() {
  const [linkToken, setLinkToken] = useState('');
  const [majorVersion, minorVersion] = (() => {
    const parts = String(Platform.Version).split('.');
    return parts.length >= 2
      ? [parseInt(parts[0], 10), parseInt(parts[1], 10)]
      : [null, null];
  })();

  const handleFinanceKitSync = () => {
    if (!linkToken) {
      return;
    }

    if (majorVersion && minorVersion) {
      if (majorVersion > 17 || (majorVersion === 17 && minorVersion >= 4)) {
        const completionHandler = (error?: FinanceKitError) => {
          if (error) {
            console.error('FinanceKit Error:', error);
          } else {
            console.log('FinanceKit sync completed successfully');
          }
        };
        const requestAuthorizationIfNeeded = true;
        const simulateBehavior = true;

        syncFinanceKit(
          linkToken,
          requestAuthorizationIfNeeded,
          simulateBehavior,
          completionHandler,
        );
      } else {
        console.warn('FinanceKit not supported on this iOS version.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={screenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView contentContainerStyle={screenStyles.scrollContainer}>
        <View style={screenStyles.innerContainer}>
          <Text style={screenStyles.header}>FinanceKit Integration</Text>

          <Text style={screenStyles.instructions}>
            To use FinanceKit with Plaid, follow these steps:
          </Text>

          <Text style={screenStyles.bullet}>
            • Your device must be running{' '}
            <Text style={screenStyles.bold}>iOS 17.4 or later</Text>.
          </Text>
          <Text style={screenStyles.bullet}>
            • Ensure your app has the{' '}
            <Text style={screenStyles.bold}>FinanceKit entitlement</Text> granted
            by Apple. This is required for production and sandbox use.
          </Text>
          <Text style={screenStyles.bullet}>
            • Add{' '}
            <Text style={screenStyles.mono}>NSFinancialDataUsageDescription</Text>{' '}
            to your <Text style={screenStyles.mono}>Info.plist</Text>.
          </Text>
          <Text style={screenStyles.bullet}>
            • Link the user`s Apple Card through Plaid Link (institution_id:{' '}
            <Text style={screenStyles.mono}>ins_136439</Text>).
          </Text>
          <Text style={screenStyles.bullet}>
            • After linking, exchange the public token for an access token.
          </Text>
          <Text style={screenStyles.bullet}>
            • When creating a Link token for sync, include{' '}
            <Text style={screenStyles.mono}>"financekit_supported": true</Text>{' '}
            and provide the access token.
          </Text>
          <Text style={screenStyles.bullet}>
            • Call <Text style={screenStyles.mono}>syncFinanceKit()</Text> with
            the Link token.
          </Text>
          <Text style={screenStyles.bullet}>
            • If the user revokes permission, you'll receive a{' '}
            <Text style={screenStyles.mono}>
              FinanceKitError.permissionAccessError
            </Text>
            .
          </Text>

          <Text style={screenStyles.subheader}>
            About Sandbox and Simulated Behavior
          </Text>

          <Text style={screenStyles.bullet}>
            • If you're using a <Text style={screenStyles.mono}>sandbox</Text>{' '}
            Link token and pass{' '}
            <Text style={screenStyles.mono}>simulateBehavior: true</Text>, Plaid
            will return{' '}
            <Text style={screenStyles.bold}>
              mock Apple Card accounts and transactions
            </Text>
            .
          </Text>
          <Text style={screenStyles.bullet}>
            • This is useful for testing sync logic and data handling without
            needing real user credentials.
          </Text>
          <Text style={screenStyles.bullet}>
            • Simulated behavior is ignored when using{' '}
            <Text style={screenStyles.mono}>production</Text> tokens.
          </Text>

          <Text style={styles.label}>Link Token</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste your link token here"
            placeholderTextColor="#999"
            value={linkToken}
            onChangeText={setLinkToken}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={linkToken ? styles.button : styles.disabledButton}
            onPress={handleFinanceKitSync}
            disabled={!linkToken}>
            <Text style={styles.buttonText}>Sync FinanceKit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 24,
  },
  innerContainer: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#222',
  },
  instructions: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    lineHeight: 20,
  },
  mono: {
    fontFamily: Platform.select({ios: 'Courier', android: 'monospace'}),
  },
  bold: {
    fontWeight: 'bold',
  },
});
