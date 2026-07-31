import React, { useCallback, useEffect, useState } from 'react';
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
  NativeEventEmitter,
  Platform,
  TurboModuleRegistry,
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

import EmbeddedScreen from './EmbeddedScreen';

function isValidString(str: string): boolean {
  return str?.trim() !== '';
}

function createLinkTokenConfiguration(
  token: string,
  noLoadingState: boolean = false,
  appendLog: (message: string, payload?: unknown) => void,
): LinkTokenConfiguration {
  console.log(`token: ${token}`);
  appendLog('token', token);
  return {
    token,
    noLoadingState,
    onLoad: () => {
      console.log('Link onLoad: finished loading');
      appendLog('Link onLoad: finished loading');
    },
  };
}

function createLinkOpenProps(
  appendLog: (message: string, payload?: unknown) => void,
): LinkOpenProps {
  return {
    onSuccess: (success: LinkSuccess) => {
      Alert.alert('Success', `Link successful: ${JSON.stringify(success, null, 2)}`);
      console.log('Success: ', success);
      appendLog('Success', success);
      success.metadata.accounts.forEach(account => console.log('accounts', account));
    },
    onExit: (linkExit: LinkExit) => {
      Alert.alert('Exit', `Link exited: ${JSON.stringify(linkExit, null, 2)}`);
      console.log('Exit: ', linkExit);
      appendLog('Exit', linkExit);
    },
    iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
    logLevel: LinkLogLevel.ERROR,
  };
}

function App(): React.JSX.Element {
  const [linkToken, setLinkToken] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = useCallback((message: string, payload?: unknown) => {
    const timestamp = new Date().toLocaleTimeString();
    const serializedPayload =
      payload === undefined
        ? ''
        : ` ${typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2)}`;
    const line = `[${timestamp}] ${message}${serializedPayload}`;
    console.log(line);
    setLogs(previousLogs => [line, ...previousLogs].slice(0, 30));
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    const plaidModule = TurboModuleRegistry.get('RNLinksdk');
    if (!plaidModule) {
      appendLog('Plaid event listener: RNLinksdk native module unavailable');
      return;
    }

    appendLog('Plaid event listener: subscribed');
    const emitter = new NativeEventEmitter(plaidModule as any);
    const listener = emitter.addListener('onEvent', event => {
      console.log('Event: ', event);
      appendLog('Event', event);
    });

    return () => {
      appendLog('Plaid event listener: unsubscribed');
      listener.remove();
    };
  }, [appendLog]);

  const handleCreateLink = () => {
    try {
      if (isValidString(linkToken)) {
        const tokenConfiguration = createLinkTokenConfiguration(
          linkToken,
          false,
          appendLog,
        );
        create(tokenConfiguration);
        setDisabled(false);
        appendLog('create() called');
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
      const openProps = createLinkOpenProps(appendLog);
      appendLog('open() called');
      open(openProps);
      setDisabled(true);
    } catch (error) {
      Alert.alert('Error', `Failed to open Link: ${error}`);
    }
  };

  const showEmbeddedScreen = () => {
    setCurrentScreen('embedded');
  };

  const goBackToMain = () => {
    setCurrentScreen('main');
  };

  if (currentScreen === 'embedded') {
    return <EmbeddedScreen onGoBack={goBackToMain} linkToken={linkToken} />;
  }

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

            <TouchableOpacity 
              style={[styles.button, styles.embeddedButton]} 
              onPress={showEmbeddedScreen}
            >
              <Text style={styles.buttonText}>Test Embedded Link</Text>
              <Text style={styles.buttonSubtext}>
                Navigate to embedded Link component test screen
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logContainer}>
            <View style={styles.logHeader}>
              <Text style={styles.logTitle}>Debug log</Text>
              <TouchableOpacity onPress={() => setLogs([])}>
                <Text style={styles.clearLogText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {logs.length === 0 ? (
              <Text style={styles.emptyLogText}>No logs yet</Text>
            ) : (
              logs.map((line, index) => (
                <Text key={`${line}-${index}`} style={styles.logLine}>
                  {line}
                </Text>
              ))
            )}
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
  embeddedButton: {
    backgroundColor: '#28a745',
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
  logContainer: {
    borderColor: '#dddddd',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
  },
  logHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logTitle: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '600',
  },
  clearLogText: {
    color: '#0066cc',
    fontSize: 14,
  },
  emptyLogText: {
    color: '#777777',
    fontSize: 13,
  },
  logLine: {
    color: '#222222',
    fontFamily: Platform.select({ios: 'Courier', android: 'monospace'}),
    fontSize: 11,
    marginBottom: 6,
  },
});

export default App;
