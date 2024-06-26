import React from 'react';
import {TextInput, Text, TouchableOpacity} from 'react-native';
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
} from 'react-native-plaid-link-sdk';

import {create, open} from 'react-native-plaid-link-sdk';

function isValidString(str: string): boolean {
  if (str && str.trim() !== '') {
    return true;
  }
  return false;
}

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
): LinkTokenConfiguration {
  console.log(`token: ${token}`);
  return {
    token: token,
    // Hides native activity indicator if true.
    noLoadingState: noLoadingState,
  };
}

function createLinkOpenProps(): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      // User was able to successfully link their account.
      console.log('Success: ', success);
      success.metadata.accounts.forEach(it => console.log('accounts', it));
    },
    onExit: (linkExit: LinkExit) => {
      // User exited Link session. There may or may not be an error depending on what occured.
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    // MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

export function PlaidLinkScreen() {
  // Render using the link_token integration. Refer to the docs
  // https://plaid.com/docs/#create-link-token on how to create
  // a new link_token.

  // Use event emitter to get real time events during a Link Session.
  usePlaidEmitter((event: LinkEvent) => {
    // Log Link Session events to console.
    console.log(event);
  });

  const [text, onChangeText] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  return (
    <>
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
        <Text style={styles.button}>Create Link</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={disabled ? styles.disabledButton : styles.button}
        onPress={() => {
          const openProps = createLinkOpenProps();
          open(openProps);
          setDisabled(true);
        }}>
        <Text style={styles.button}>Open Link</Text>
      </TouchableOpacity>
    </>
  );
}
