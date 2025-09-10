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
  Dimensions,
} from 'react-native';

import { 
  EmbeddedLinkView,
  LinkExit,
  LinkSuccess,
  LinkEvent,
  LinkIOSPresentationStyle,
} from 'react-native-plaid-link-sdk';

type EmbeddedScreenProps = {
  onGoBack: () => void;
  linkToken: string;
};

function isValidString(str: string): boolean {
  return str?.trim() !== '';
}

const { width } = Dimensions.get('window');

const EmbeddedScreen: React.FC<EmbeddedScreenProps> = ({ onGoBack, linkToken: initialToken }) => {
  const [linkToken, setLinkToken] = useState(initialToken);
  const [showEmbeddedLink, setShowEmbeddedLink] = useState(false);

  const onSuccess = (success: LinkSuccess) => {
    Alert.alert('Success', `Link successful: ${JSON.stringify(success, null, 2)}`);
    console.log('Success: ', success);
    success.metadata.accounts.forEach(account => console.log('accounts', account));
    setShowEmbeddedLink(false); // Hide the embedded link after success
  };

  const onExit = (linkExit: LinkExit) => {
    Alert.alert('Exit', `Link exited: ${JSON.stringify(linkExit, null, 2)}`);
    console.log('Exit: ', linkExit);
    setShowEmbeddedLink(false); // Hide the embedded link after exit
  };

  const onEvent = (linkEvent: LinkEvent) => {
    console.log('Event: ', linkEvent);
  };

  const handleShowEmbeddedLink = () => {
    if (isValidString(linkToken)) {
      setShowEmbeddedLink(true);
    } else {
      Alert.alert('Error', 'Please enter a valid link token');
    }
  };

  const handleHideEmbeddedLink = () => {
    setShowEmbeddedLink(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
        <View style={styles.body}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>← Back to Main</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Embedded Link Test - React Native 0.81.1 + New Architecture (Fabric)
          </Text>
          
          <Text style={styles.sectionDescription}>
            This screen demonstrates the EmbeddedLinkView component working with React Native's New Architecture (Fabric).
            Paste a valid Link token and press "Show Embedded Link" to display the embedded flow.
          </Text>

          {!showEmbeddedLink && (
            <>
              <TextInput
                style={styles.input}
                onChangeText={(newText) => {
                  setLinkToken(newText);
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
                  onPress={handleShowEmbeddedLink}
                  disabled={!isValidString(linkToken)}
                >
                  <Text style={styles.buttonText}>Show Embedded Link</Text>
                  <Text style={styles.buttonSubtext}>
                    Displays the embedded Plaid Link component using Fabric
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {showEmbeddedLink && (
            <>
              <View style={styles.embeddedLinkHeader}>
                <Text style={styles.embeddedLinkTitle}>Embedded Plaid Link</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={handleHideEmbeddedLink}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.embeddedLinkContainer}>
                <EmbeddedLinkView
                  token={linkToken}
                  iOSPresentationStyle={LinkIOSPresentationStyle.MODAL}
                  onSuccess={onSuccess}
                  onExit={onExit}
                  onEvent={onEvent}
                  style={styles.embeddedLink}
                />
              </View>

              <Text style={styles.footer}>
                ✅ EmbeddedLinkView is now running with Fabric (New Architecture)!
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  body: {
    backgroundColor: '#ffffff',
    padding: 20,
    flex: 1,
  },
  backButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  backButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
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
  embeddedLinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  embeddedLinkTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  embeddedLinkContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  embeddedLink: {
    height: 500,
    width: '100%',
  },
  footer: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#008800',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    marginHorizontal: 20,
  },
});

export default EmbeddedScreen;
