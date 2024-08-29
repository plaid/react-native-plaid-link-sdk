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
  exchangePublicToken: (publicToken: string) => Promise<string>; // Added for token exchange
}

// Define props type for the component
interface PlaidIntegrationComponentProps {
  token: string;
}
const { PlaidClassModule } = NativeModules;
// Get the native module and cast it with the correct type
const { RNLinkSdkWindows } = NativeModules as {
  RNLinkSdkWindows: RNLinkWindowsSdkType;
};

// Create an event emitter for the native module
const plaidEventEmitter = new NativeEventEmitter(RNLinkSdkWindows);

const PlaidIntegrationComponent: React.FC<PlaidIntegrationComponentProps> = ({ token }) => {
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [publicToken, setPublicToken] = useState<string>(''); // Store the public token
  const [accessToken, setAccessToken] = useState<string>(''); // Store the access token

  useEffect(() => {
    // Handler function for events from the native module
    const handlePlaidEvent = (event: { status: string; message: string }) => {
      console.log('Received Plaid event:', event);
      setStatusMessage(`${event.status}: ${event.message}`);
    };

    // Subscribe to the Plaid event using the event emitter
    const subscription: EmitterSubscription = plaidEventEmitter.addListener('PlaidLinkEvent', handlePlaidEvent);

    // Clean up the listener on component unmount to prevent memory leaks
    return () => {
      subscription.remove();
    };
  }, []);

  // Function to exchange public token for access token
  const exchangePublicToken = async (publicToken: string) => {
    try {
      const accessToken = await PlaidClassModule.exchangePublicToken(publicToken); // Call the native method
      console.log('Received access token:', accessToken);
      setAccessToken(accessToken); // Set the access token in state
      console.log(PlaidClassModule)
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };

  // Function to send messages to the native C# module
  const sendMessageToNative = async (action: string, data: { [key: string]: any }) => {
    try {
      switch (action) {
        case 'create':
          RNLinkSdkWindows.create(data.token, data.noLoadingState);
          console.log('TOKEN IS CREATED.', data.token);
          // Set the public token for exchange after creation
          setPublicToken(data.token);
          break;
         case 'exchange':
           await exchangePublicToken(publicToken); 
       
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
    } catch (error) {
      console.error('Error sending message to native module:', error);
    }
  };

  console.log(PlaidClassModule)
  // Function to handle creation and exchange flow
  const handleCreateAndExchange = async () => {
    // Call the create method first
    await sendMessageToNative('create', { token: token, noLoadingState: false });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status Message: {statusMessage}</Text>
      <Button
        title="Create and Exchange Token"
        onPress={handleCreateAndExchange}
      />
        <Button
        title="Exchange Token"
        onPress={()=> sendMessageToNative('exchange', { publicToken })}
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
      <Text style={styles.text}>Access Token: {accessToken}</Text>
   
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
    backgroundColor: 'purple',
    color: 'white',
    marginBottom: 20,
  },
});

export default PlaidIntegrationComponent;
