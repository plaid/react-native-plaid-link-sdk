import * as React from 'react';
import {TextInput, Text, View } from 'react-native';
import { styles } from '../Styles';

// Import Native UI Component from SDK.
import {MyNativeCustomView, LinkIOSPresentationStyle} from 'react-native-plaid-link-sdk';

// Simple conditional view to display Embedded Link once a token has been entered.
var EmbeddedView = ({token}: {token: string}) => {
    let content

    console.log('token ', token);

    if (token) {
        content = <View>
            <MyNativeCustomView
                token={token}
                onClick={(event: Object) => {
                    console.log("Click event: " + JSON.stringify(event))
                    console.log('event', event);
                }}
                style={{ width: '100%', height: 300, backgroundColor: '#2196F3' }}
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
          <EmbeddedView token={text} />
        </>
    );
}
