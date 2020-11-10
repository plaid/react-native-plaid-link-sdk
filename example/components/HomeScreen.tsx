import React from 'react';
import { Text, View } from 'react-native';
import PlaidComponent from './PlaidLink';

var styles = require('./style');

const HomeScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.heading}>
        <Text style={styles.titleText}>Plaid Link React Native Demo</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.baseText}>
          &#8226; It’s easy to integrate, with fewer lines than webviews
        </Text>
        <Text style={styles.baseText}>
          &#8226; It supports all Link flows, including oAuth
        </Text>
        <Text style={styles.baseText}>
          &#8226; You can get support directly from the Plaid team
        </Text>
      </View>
      <View style={styles.bottom}>
        <PlaidComponent token="link-sandbox-d6f96b38-742f-4a9a-90a5-f121f3445db4" />
      </View>
    </View>
  );
};

export default HomeScreen;
