import React from 'react';
import { Platform, TextInput, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Styles'; // Adjust import if needed for the actual path
import {
  LinkExit,
  LinkEvent,
  LinkLogLevel,
  LinkSuccess,
  dismissLink,
  LinkOpenProps,
  usePlaidEmitter,
  LinkIOSPresentationStyle,
  LinkTokenConfiguration,
  FinanceKitError,
  create,
  open,
  syncFinanceKit,
  submit,
  SubmissionData,
  EmbeddedLinkView, // Make sure this is imported
} from 'react-native-plaid-link-sdk';

// EmbeddedLinkView for displaying once a token is entered
const EmbeddedView = ({ token }: { token: string }) => {
  let content;

  if (token) {
    content = (
      <View>
        <EmbeddedLinkView
          token={token}
          iOSPresentationStyle={LinkIOSPresentationStyle.MODAL}
          onEvent={(event: LinkEvent) => {
            console.log('onEvent', event);
          }}
          onSuccess={(success: LinkSuccess) => {
            console.log('onSuccess', success);
          }}
          onExit={(exit: LinkExit) => {
            console.log('onExit', exit);
          }}
          style={styles.embedded}
        />
      </View>
    );
  } else {
    content = (
      <Text style={{ fontSize: 24, color: '#2196F3', textAlign: 'center' }}>
        Enter Link Token
      </Text>
    );
  }

  return <View style={{ padding: 24 }}>{content}</View>;
};

function isValidString(str: string): boolean {
  return str && str.trim() !== '';
}

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false
): LinkTokenConfiguration {
  console.log(`token: ${token}`);
  return {
    token: token,
    noLoadingState: noLoadingState,
  };
}

function createSubmissionData(phoneNumber: string): SubmissionData {
  return {
    phoneNumber: phoneNumber,
  };
}

function createLinkOpenProps(): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      console.log('Success: ', success);
      success.metadata.accounts.forEach(it => console.log('accounts', it));
    },
    onExit: (linkExit: LinkExit) => {
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

const PlaidLinkScreen = () => {
  // Use event emitter to get real-time events during a Link Session.
  usePlaidEmitter((event: LinkEvent) => {
    console.log(event);
  });

  const [text, onChangeText] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  const iOSVersionParts = String(Platform.Version).split('.');
  const [majorVersion, minorVersion] = iOSVersionParts.length >= 2 ? iOSVersionParts : [null, null];

  const financeKitText = () => {
    if (majorVersion && minorVersion) {
      const majorInt = parseInt(majorVersion, 10);
      const minorInt = parseInt(minorVersion, 10);

      if (majorInt > 17) {
        return <Text style={styles.button}>Sync FinanceKit</Text>;
      } else if (majorInt === 17 && minorInt >= 4) {
        return <Text style={styles.button}>Sync FinanceKit</Text>;
      } else {
        return (
          <Text style={styles.button}>
            FinanceKit not supported on this version of iOS
          </Text>
        );
      }
    } else {
      return <Text style={styles.button}>Invalid iOS version</Text>;
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        placeholderTextColor={'#D3D3D3'}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isValidString(text)) {
            const tokenConfiguration = createLinkTokenConfiguration(text);
            create(tokenConfiguration);
            setDisabled(false);
          }
        }}
      >
        <Text style={styles.button}>Create Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabledButton : styles.button}
        onPress={() => {
          const submissionData = createSubmissionData('415-555-0015');
          submit(submissionData);
        }}
      >
        <Text style={styles.button}>Submit Layer Phone Number</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabledButton : styles.button}
        onPress={() => {
          const openProps = createLinkOpenProps();
          open(openProps);
          setDisabled(true);
        }}
      >
        <Text style={styles.button}>Open Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const completionHandler = (error?: FinanceKitError) => {
            if (error) {
              console.error('Error:', error);
            } else {
              console.log('Sync completed successfully');
            }
          };
          const requestAuthorizationIfNeeded = true;
          syncFinanceKit(text, requestAuthorizationIfNeeded, completionHandler);
        }}
      >
        {financeKitText()}
      </TouchableOpacity>

      {/* Embedded Link View below the buttons */}
      <EmbeddedView token={text} />
    </View>
  );
};

export default PlaidLinkScreen;
