import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
} from 'react-native';

import { 
  create, 
  open,
  LinkExit,
  LinkSuccess,
  LinkTokenConfiguration,
  LinkOpenProps,
  LinkIOSPresentationStyle,
  LinkLogLevel,
} from 'react-native-plaid-link-sdk';

function isValidString(str: string): boolean {
  return str?.trim() !== '';
}

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
): LinkTokenConfiguration {
  console.log(`token: ${token}`);
  return {
    token,
    noLoadingState,
  };
}

function createLinkOpenProps(): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      Alert.alert('Success', `Link successful: ${JSON.stringify(success, null, 2)}`);
      console.log('Success: ', success);
      success.metadata.accounts.forEach(account => console.log('accounts', account));
    },
    onExit: (linkExit: LinkExit) => {
      Alert.alert('Exit', `Link exited: ${JSON.stringify(linkExit, null, 2)}`);
      console.log('Exit: ', linkExit);
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

function App(): React.JSX.Element {
  const [linkToken, setLinkToken] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleCreateLink = () => {
    try {
      if (isValidString(linkToken)) {
        const tokenConfiguration = createLinkTokenConfiguration(linkToken);
        create(tokenConfiguration);
        setDisabled(false);
        Alert.alert('Success', 'Link created successfully!');
      } else {
        Alert.alert('Error', 'Please enter a valid link token');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to create Link: ${error}`);
    }
  };

  const handleOpenLink = () => {
    try {
      const openProps = createLinkOpenProps();
      open(openProps);
      setDisabled(true);
    } catch (error) {
      Alert.alert('Error', `Failed to open Link: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>
            Plaid Link SDK Test - React Native 0.81.1 + New Architecture
          </Text>
          
          <Text style={styles.sectionDescription}>
            Paste a valid Link token and press "Create Link" to initialize Link.
            Once created, press "Open Link" to launch the flow.
          </Text>

          <TextInput
            style={styles.input}
            onChangeText={(newText) => {
              setLinkToken(newText);
              setDisabled(true); // Reset disabled state when token changes
            }}
            value={linkToken}
            placeholder="link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            placeholderTextColor={'#999999'}
            multiline={false}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, !isValidString(linkToken) && styles.disabledButton]} 
              onPress={handleCreateLink}
              disabled={!isValidString(linkToken)}
            >
              <Text style={styles.buttonText}>Create Link</Text>
              <Text style={styles.buttonSubtext}>
                Creates a Plaid Link handler - must be called before open
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, disabled && styles.disabledButton]} 
              onPress={handleOpenLink}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>Open Link</Text>
              <Text style={styles.buttonSubtext}>
                Opens Plaid Link flow
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 20,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#ccddff',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: '500',
    color: '#008800',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
  },
});

export default App;