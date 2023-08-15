import * as React from 'react';
import {TextInput, Text, View } from 'react-native';
import { styles } from '../Styles';

// Import Native UI Component from SDK.
import {MyNativeCustomView, LinkIOSPresentationStyle, LinkEvent} from 'react-native-plaid-link-sdk';

// Simple conditional view to display Embedded Link once a token has been entered.
var EmbeddedView = ({token}: {token: string}) => {
    let content

    console.log('token ', token);

    if (token) {
        content = <View>
            <MyNativeCustomView
                token={token}
                iOSPresentationStyle={LinkIOSPresentationStyle.FULL_SCREEN}
                onEvent={(event: LinkEvent) => {
                    // console.log('onEvent', event);
                    console.log('event name', event.eventName);
                    console.log('metadata', event.metadata);
                }}
                onSuccess={(success: Object) => {
                    console.log('onSuccess', success);
                }}
                onExit={(exit: Object) => {
                    console.log('onExit', exit);
                }}
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
          <EmbeddedView token={text} />
        </>
    );
}
