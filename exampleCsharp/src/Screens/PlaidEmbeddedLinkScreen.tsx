import * as React from 'react';
import { TextInput, Text, View, Modal, Platform } from 'react-native';
import { styles } from '../Styles';
import {
  EmbeddedLinkView,
  LinkIOSPresentationStyle,
  LinkEvent,
  LinkExit,
  LinkSuccess,
} from 'react-native-plaid-link-sdk';

// Component to display Embedded Link or Windows-compatible modal view
const EmbeddedView = ({ token }: { token: string }) => {
  let content;

  // For Windows, use a different modal implementation
  if (token) {
    if (Platform.OS === 'windows') {
      // Use a modal or a suitable Windows-specific component
      content = (
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!token}
          onRequestClose={() => {
            console.log('Windows modal closed');
          }}>
          <View style={{ padding: 24 }}>
            <Text style={{ fontSize: 20, color: '#2196F3', textAlign: 'center' }}>
              Plaid Link for Windows
            </Text>
            {/* Add your Windows-specific integration or logic here */}
          </View>
        </Modal>
      );
    } else {
      // For other platforms (iOS, Android)
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
    }
  } else {
    content = (
      <Text style={{ fontSize: 24, color: '#2196F3', textAlign: 'center' }}>
        Enter Link Token
      </Text>
    );
  }

  return <View style={{ padding: 24 }}>{content}</View>;
};

export function PlaidEmbeddedLinkScreen() {
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
