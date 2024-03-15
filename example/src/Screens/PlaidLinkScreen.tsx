import React from 'react';
import {TextInput, Text, TouchableOpacity} from 'react-native';
import {styles} from '../Styles';

import {
  LinkExit,
  LinkEvent,
  LinkLogLevel,
  LinkSuccess,
  openLink,
  dismissLink,
  PlaidLinkProps,
  usePlaidEmitter,
  LinkIOSPresentationStyle,
} from 'react-native-plaid-link-sdk';

// Create PlaidLinkProps from the provided token string.
function makeLinkTokenProps(token: string): PlaidLinkProps {
  return {
    tokenConfig: {
      token: token,
      logLevel: LinkLogLevel.ERROR,
      // Hides native activity indicator if true.
      noLoadingState: false,
    },
    onSuccess: (success: LinkSuccess) => {
      // User was able to successfully link their account.
      console.log('Success: ', success);
    },
    onExit: (linkExit: LinkExit) => {
      // User exited Link session. There may or may not be an error depending on what occured.
      console.log('Exit: ', linkExit);
      dismissLink();
    },
    // MODAL or FULL_SCREEEN presentation on iOS. Defaults to MODAL.
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
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
          const linkTokenProps = makeLinkTokenProps(text);
          openLink(linkTokenProps);
        }}>
        <Text style={styles.button}>Open Link</Text>
      </TouchableOpacity>
    </>
  );
}
