import React from 'react';
import {
  Text,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PlaidLink, { usePlaidEmitter } from 'react-native-plaid-link-sdk';
import {useNavigation} from '@react-navigation/native';

const AppButton = ({onPress, title}) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const PlaidComponent = ({token}) => {
  const navigation = useNavigation();
  usePlaidEmitter((event) => {
    console.log(event);
  });
  return (
    <PlaidLink
      token={token}
      onSuccess={(data) => {
        navigation.navigate('Success', {onsuccess: data})
        console.log(data)
      }}
      onExit={(data) => {
        navigation.navigate('Error', {onerror: data})
        console.log(data)
      }}
      component={AppButton}
      componentProps={{title: 'Open Link'}}></PlaidLink>
  );
};

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 4,
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

export default PlaidComponent;
