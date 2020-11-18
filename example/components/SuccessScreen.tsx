import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { Linking, } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { TouchableOpacity, } from 'react-native-gesture-handler';
import { LinkSuccess, } from 'react-native-plaid-link-sdk';

var styles = require('./style');

const SuccessScreen = ({ route, navigation }: any) => {
  const linkSuccess : LinkSuccess  = route.params;
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.heading}>
        <Text style={styles.titleText}>Congratulations!</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.baseText}>
          You did it! See, that wasn't so hard :) {'\n'}
          {'\n'}
          {'\n'}The next step is adding the React Native SDK to your app. {'\n'}
          {'\n'}1) Send the public token shown above to your server to exchange
          it for an access token and get access to your data {'\n'}
          {'\n'}2) Visit{' '}
          <Text
            style={{ color: '#0A85EA' }}
            onPress={() =>
              Linking.openURL('https://github.com/plaid/react-native-plaid-link-sdk')
            }>
            https://github.com/plaid/react-native-plaid-link-sdk
          </Text>{' '}
          for more information on how to integrate {'\n'}
          {'\n'}3) Ready for the big leagues? Unlock production access by
          visiting{' '}
          <Text
            style={{ color: '#0A85EA' }}
            onPress={() => Linking.openURL('http://plaid.com/contact')}>
            http://plaid.com/contact
          </Text>
        </Text>
        <TouchableOpacity>
          <Text
            style={successStyles.publicKey}
            onLongPress={() => {
              Clipboard.setString(linkSuccess.publicToken);
              notifyMessage('Copied to Clipboard');
            }}>
            <Text style={styles.bold}>
              Public Token: {linkSuccess.publicToken}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const successStyles = StyleSheet.create({
  publicKey: {
    fontSize: 18,
    marginTop: 16,
    color: '#000000',
    textAlign: 'left',
  },
});

function notifyMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}

export default SuccessScreen;
