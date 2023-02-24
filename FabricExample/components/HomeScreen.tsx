import React, {useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import PlaidComponent from './PlaidLink';

var styles = require('./style');

const LinkExampleConfiguration = {
  noLoadingState: false,
  linkToken: '<INSERT LINK TOKEN>',
};

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1}}>
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
      {loading && (
        <View style={styles.heading}>
          <ActivityIndicator animating={true} color="black" />
          <Text style={styles.baseText}>Loading Plaid Link...</Text>
        </View>
      )}
      <View style={styles.bottom}>
        <PlaidComponent
          tokenConfig={{
            token: LinkExampleConfiguration.linkToken,
            noLoadingState: LinkExampleConfiguration.noLoadingState,
          }}
          onPress={() => {
            setLoading(LinkExampleConfiguration.noLoadingState);
          }}
          onOpenEvent={() => {
            setLoading(false);
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
