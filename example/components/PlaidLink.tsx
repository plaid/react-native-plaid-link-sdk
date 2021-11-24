import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {PlaidLink, usePlaidEmitter, LinkEvent, LinkExit, LinkSuccess, LinkEventName, PlaidLinkComponentProps} from 'react-native-plaid-link-sdk';
import {useNavigation} from '@react-navigation/native';

type PlaidComponentProps = {
  tokenConfig: LinkTokenConfiguration;
  onPress(): any;
  onOpenEvent(): any;
};

const PlaidComponent = (props: PlaidComponentProps) => {
  const navigation = useNavigation();
  usePlaidEmitter((event: LinkEvent) => {
    if (event.eventName === LinkEventName.OPEN) {
      props.onOpenEvent();
    }

    console.log(event);
  });
  return (
    <PlaidLink
      tokenConfig={props.tokenConfig}
      onSuccess={(success: LinkSuccess) => {
        navigation.navigate('Success', success);
        console.log(success);
      }}
      onExit={(exit: LinkExit) => {
        navigation.navigate('Exit', exit);
        console.log(exit);
      }}
      onPress={props.onPress}>
      <View style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Open Link</Text>
      </View>
    </PlaidLink>
  );
};

const styles = StyleSheet.create({
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
