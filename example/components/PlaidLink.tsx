import React from 'react';
import {
  Text,
  NativeEventEmitter,
  NativeModules,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {PlaidLink, usePlaidEmitter} from 'react-native-plaid-link-sdk/PlaidLink';
import {useNavigation} from '@react-navigation/native';
import {LinkExit, LinkTokenConfiguration} from "react-native-plaid-link-sdk/types/Types";
import {LinkSuccess} from "react-native-plaid-link-sdk/types/Types";

const AppButton = ({onPress, title}: any) => {
    return <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
};

const PlaidComponent = ({token}: any) => {
    const navigation = useNavigation();
    usePlaidEmitter((event: any) => {
        console.log(event);
    });
    return (
        <PlaidLink
            config={{
                onSuccess: (success: LinkSuccess) => {
                    navigation.navigate('Success', {onsuccess: success})
                    console.log(success)
                },
                onExit: (data: LinkExit) => {
                    navigation.navigate('Error', {onerror: data})
                    console.log(data)
                }
                , token: "mytoken"
            }}
            children={<AppButton title="Open Link"/>}/>
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
