import React from 'react';
import {Text, View, Linking, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

var styles = require('./style');

const ErrorScreen = ({route, navigation}) => {
  const {onerror} = route.params;
  console.log(onerror);
  return (
    <View style={{flex: 1}}>
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
          <Text style={(styles.bold, {color: '#000000'})}>
            {JSON.stringify(onerror)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default ErrorScreen;
