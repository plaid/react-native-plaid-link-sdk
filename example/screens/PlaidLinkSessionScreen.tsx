import { useEvent } from 'expo';
import { useState } from 'react';
import { ActivityIndicator, Button, SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { styles } from '../styles/common';
import ReactNativePlaidLinkSdk from 'react-native-plaid-link-sdk';

type SessionState = 'idle' | 'loading' | 'ready' | 'error';

type Props = { onBack: () => void };

export function PlaidLinkSessionScreen({ onBack }: Props) {
  const [state, setState] = useState<SessionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = useEvent(ReactNativePlaidLinkSdk, 'onSuccess');
  const onExit = useEvent(ReactNativePlaidLinkSdk, 'onExit');
  const onEvent = useEvent(ReactNativePlaidLinkSdk, 'onEvent');

  const handleCreateSession = async () => {
    setState('loading');
    setErrorMessage(null);
    try {
      await ReactNativePlaidLinkSdk.createPlaidLinkSession('link-sandbox-efaf40b9-1ff0-4915-869a-d399a5691472');
      setState('ready');
    } catch (e: any) {
      setState('error');
      setErrorMessage(e.message ?? 'Failed to create session.');
    }
  };

  const handleOpen = async () => {
    try {
      await ReactNativePlaidLinkSdk.openLinkSession(false);
    } catch (e: any) {
      setState('error');
      setErrorMessage(e.message ?? 'Failed to open session.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Button title="← Back" onPress={onBack} />
        <Text style={styles.header}>PlaidLinkSession</Text>

        <Group name="Session">
          <LinkButton state={state} onCreate={handleCreateSession} onOpen={handleOpen} />
          {state === 'error' && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
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