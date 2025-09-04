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
} from 'react-native';

import { create, open, dismiss } from 'react-native-plaid-link-sdk';

function App(): React.JSX.Element {
  const [linkToken, setLinkToken] = useState('link-sandbox-2fb372da-4d0a-402c-8441-4bba26e1bb00');

  const testCreatePlaidLink = () => {
    try {
      // Test our fixed createPlaidLink method
      create({
        token: linkToken,
        noLoadingState: false,
      });
      Alert.alert('Success', 'createPlaidLink method called successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to call createPlaidLink: ${error}`);
    }
  };

  const testOpenPlaidLink = () => {
    try {
      open({
        onSuccess: (success) => {
          Alert.alert('Success', `Link successful: ${JSON.stringify(success)}`);
        },
        onExit: (exit) => {
          Alert.alert('Exit', `Link exited: ${JSON.stringify(exit)}`);
        },
      });
    } catch (error) {
      Alert.alert('Error', `Failed to open Link: ${error}`);
    }
  };

  const testDismissPlaidLink = () => {
    try {
      dismiss();
      Alert.alert('Success', 'dismiss method called successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to dismiss: ${error}`);
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={testCreatePlaidLink}>
              <Text style={styles.buttonText}>create()</Text>
              <Text style={styles.buttonSubtext}>
                Creates a Plaid Link handler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testOpenPlaidLink}>
              <Text style={styles.buttonText}>open()</Text>
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
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
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