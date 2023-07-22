import React from 'react';
import {TextInput, Text, TouchableOpacity, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './Styles';
import {
  LinkExit,
  LinkEvent,
  LinkLogLevel,
  LinkSuccess,
  openLink,
  dismissLink,
  PlaidLinkProps,
  usePlaidEmitter,
} from 'react-native-plaid-link-sdk';

// Create PlaidLinkProps from the provided token string.
function makeLinkTokenProps(token: string): PlaidLinkProps {
  return {
    tokenConfig: {
      token: token,
      logLevel: LinkLogLevel.ERROR,
      noLoadingState: false, // Hides native activity indicator if true.
    },
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
  };
}

export const PlaidEventContainer = () => {
  // Render using the link_token integration. Refer to the docs
  // https://plaid.com/docs/#create-link-token on how to create
  // a new link_token.

  usePlaidEmitter((event: LinkEvent) => {
    // Log Link Session events to console.
    console.log(event);
  });

  const [text, onChangeText] = React.useState('');
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <TextInput
        style={isDarkMode ? styles.inputDark : styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        placeholderTextColor={isDarkMode ? Colors.white : '#D3D3D3'}
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
};
