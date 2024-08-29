import React, { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Text, View, Button, StyleSheet, EmitterSubscription } from 'react-native';

// Extend NativeModule to include required event emitter methods
interface RNLinkWindowsSdkType {
  create: (token: string, noLoadingState: boolean) => void;
  open: (
    fullScreen: boolean,
    onSuccess: (result: { [key: string]: any }) => void,
    onExit: (error: { [key: string]: any }, result: { [key: string]: any }) => void
  ) => void;
  dismiss: () => void;
  submit: (phoneNumber: string) => void;
  addListener: (eventType: string) => void; // Required for NativeEventEmitter
  removeListeners: (count: number) => void; // Required for NativeEventEmitter
}

// Define props type for the component
interface PlaidIntegrationComponentProps {
  token: string;
}

// Get the native module and cast it with the correct type
const { RNLinkSdkWindows } = NativeModules as {
  RNLinkSdkWindows: RNLinkWindowsSdkType;
};

// Create an event emitter for the native module
const plaidEventEmitter = new NativeEventEmitter(RNLinkSdkWindows);

// Passing in the token from App
const PlaidIntegrationComponent: React.FC<PlaidIntegrationComponentProps> = ({ token }) => {
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    // Handler function for events from the native module
    const handlePlaidEvent = (event: { status: string; message: string }) => {
      console.log('Received Plaid event:', event);
      setStatusMessage(`${event.status}: ${event.message}`);
    };
    // Subscribe to the Plaid event
    const subscription: EmitterSubscription = plaidEventEmitter.addListener('PlaidLinkEvent', handlePlaidEvent);
    // Clean up the listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);
 // Send the message to C# File
  const sendMessageToNative = (action: string, data: { [key: string]: any }) => {
    switch (action) {
      case 'create':
        RNLinkSdkWindows.create(data.token, data.noLoadingState);
        break;
      case 'open':
        RNLinkSdkWindows.open(
          data.fullScreen,
          (result) => console.log('Success:', result),
          (error, exit) => console.log('Exit:', error, exit)
        );
        break;
      case 'dismiss':
        RNLinkSdkWindows.dismiss();
        break;
      case 'submit':
        RNLinkSdkWindows.submit(data.phoneNumber);
        break;
      default:
        console.warn('Unknown action:', action);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status Message: {statusMessage}</Text>
      <Button
        title="Create Plaid Link"
        onPress={() => sendMessageToNative('create', { token: token, noLoadingState: false })}
      />
      <Button
        title="Open Plaid Link"
        onPress={() => sendMessageToNative('open', { fullScreen: true })}
      />
      <Button
        title="Dismiss Plaid Link"
        onPress={() => sendMessageToNative('dismiss', {})}
      />
      <Button
        title="Submit Phone Number"
        onPress={() => sendMessageToNative('submit', { phoneNumber: '123-456-7890' })}
      />
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    backgroundColor:'purple',
    color: 'white',
    marginBottom: 20,
  },
});

export default PlaidIntegrationComponent;
