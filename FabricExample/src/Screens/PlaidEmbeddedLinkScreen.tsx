import * as React from 'react';
import {TextInput, Text, View} from 'react-native';
import {styles} from '../Styles';
import {
  EmbeddedLinkView,
  LinkIOSPresentationStyle,
  LinkEvent,
  LinkExit,
  LinkSuccess,
} from 'react-native-plaid-link-sdk';

// Simple conditional view to display Embedded Link once a token has been entered.
const EmbeddedView = ({token}: {token: string}) => {
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
      <Text style={{fontSize: 24, color: '#2196F3', textAlign: 'center'}}>
        Enter Link Token
      </Text>
    );
  }

  return <View style={{padding: 24}}>{content}</View>;
};

export function PlaidEmbeddedLinkScreen(): React.JSX.Element {
  const [text, setText] = React.useState('');

  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={newText => setText(newText)}
        value={text}
        placeholder="link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        placeholderTextColor={'#D3D3D3'}
      />
      <EmbeddedView token={text} />
    </>
  );
}
