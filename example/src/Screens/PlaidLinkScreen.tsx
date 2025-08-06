import React from 'react';
import {
  Platform,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {styles} from '../Styles';

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
  create,
  open,
} from 'react-native-plaid-link-sdk';

function isValidString(str: string): boolean {
  return str?.trim() !== '';
}

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
): LinkTokenConfiguration {
  console.log(`token: ${token}`);
  return {
    token,
    noLoadingState,
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

export function PlaidLinkScreen() {
  usePlaidEmitter((event: LinkEvent) => {
    console.log(event);
  });

  const [text, onChangeText] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.directions}>
        Paste a valid Link token and press "Create Link" to initialize Link.
        Once created, press "Open Link" to launch the flow.
      </Text>

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
        }}>
        <Text style={styles.buttonText}>Create Link</Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabledButton : styles.button}
        onPress={() => {
          const openProps = createLinkOpenProps();
          open(openProps);
          setDisabled(true);
        }}>
        <Text style={styles.buttonText}>Open Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-start',
  },
  directions: {
    fontSize: 14,
    marginBottom: 12,
    color: '#222',
    fontWeight: '500',
  },
});
