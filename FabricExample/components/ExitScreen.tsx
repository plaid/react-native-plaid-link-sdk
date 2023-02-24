import React from 'react';
import { Text, View, } from 'react-native';
import { LinkExit, } from 'react-native-plaid-link-sdk';

var styles = require('./style');

const ExitScreen = ({ route, navigation }: any) => {
  const linkExit : LinkExit = route.params;
  console.log(linkExit);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.heading}>
        <Text style={styles.titleText}>
          Uh-oh! It seems something went wrong.
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.baseText}>
          {' '}
          Below is the error returned.
          {'\n'}
          {'\n'}
          <Text style={(styles.bold, { color: '#000000' })}>
            {JSON.stringify(linkExit)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default ExitScreen;
