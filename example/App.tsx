import { useEvent } from 'expo';
import { EventEmitter } from 'expo';
import { useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, ScrollView, Text, View } from 'react-native';
import ReactNativePlaidLinkSdk from 'react-native-plaid-link-sdk';

type SessionState = 'idle' | 'loading' | 'ready' | 'error';

const emitter = new EventEmitter(ReactNativePlaidLinkSdk);

export default function App() {
  const [state, setState] = useState<SessionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = useEvent(ReactNativePlaidLinkSdk, 'onSuccess');
  const onExit = useEvent(ReactNativePlaidLinkSdk, 'onExit');
  const onEvent = useEvent(ReactNativePlaidLinkSdk, 'onEvent');

  const handleCreateSession = async () => {
    setState('loading');
    setErrorMessage(null);
    try {
      // createPlaidLinkSession resolves when onLoad fires (Link is ready)
      await ReactNativePlaidLinkSdk.createPlaidLinkSession('link-sandbox-efaf40b9-1ff0-4915-869a-d399a5691472');
      setState('ready');
    } catch (e: any) {
      setState('error');
      setErrorMessage(e.message ?? 'Failed to create session.');
    }
  };

  const handleOpen = async () => {
    try {
      await ReactNativePlaidLinkSdk.open(false);
    } catch (e: any) {
      setState('error');
      setErrorMessage(e.message ?? 'Failed to open session.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Plaid Link</Text>

        <Group name="SDK Version">
          <Text>{ReactNativePlaidLinkSdk.sdkVersion}</Text>
        </Group>

        <Group name="Session">
          <LinkButton state={state} onCreate={handleCreateSession} onOpen={handleOpen} />
          {state === 'error' && errorMessage && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}
        </Group>

        <Group name="Last Event">
          <Text>{onEvent ? JSON.stringify(onEvent, null, 2) : '—'}</Text>
        </Group>

        <Group name="Last Success">
          <Text>{onSuccess ? JSON.stringify(onSuccess, null, 2) : '—'}</Text>
        </Group>

        <Group name="Last Exit">
          <Text>{onExit ? JSON.stringify(onExit, null, 2) : '—'}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

// Single button that changes label/state to mirror the UIKit example
function LinkButton({
  state,
  onCreate,
  onOpen,
}: {
  state: SessionState;
  onCreate: () => void;
  onOpen: () => void;
}) {
  switch (state) {
    case 'idle':
      return <Button title="Create Session" onPress={onCreate} />;
    case 'loading':
      return (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Initializing Link...</Text>
        </View>
      );
    case 'ready':
      return <Button title="Connect Bank Account" onPress={onOpen} />;
    case 'error':
      return <Button title="Retry" onPress={onCreate} />;
  }
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  loadingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  loadingText: {
    color: '#888',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
};