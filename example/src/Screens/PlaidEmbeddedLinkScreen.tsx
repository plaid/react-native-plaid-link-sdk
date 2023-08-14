import * as React from 'react';
import {TextInput, Text, View } from 'react-native';
import { styles } from '../Styles';

// Import Native UI Component from SDK.
import {PlaidEmbeddedView} from 'react-native-plaid-link-sdk';

// Simple conditional view to display Embedded Link once a token has been entered.
var EmbeddedLinkView = ({token}: {token: string}) => {
    let content

    if (token) {
        content = <View>
            <PlaidEmbeddedView
            presentationStyle={'MODAL'}
            token={token}
            onEvent={(data: any) => console.log('onEvent ', data.nativeEvent.eventName)}
            style={styles.embedded}
            />
        </View>
    } else {
        content = <Text style={{ fontSize: 24, color: '#2196F3', textAlign: 'center' }}>Enter Link Token</Text>
    }

    return <View style={{ padding: 24 }}>{content}</View>
}

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
          <EmbeddedLinkView token={text} />
        </>
    );
}
