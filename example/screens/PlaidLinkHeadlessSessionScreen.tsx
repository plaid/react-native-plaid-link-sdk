// app/PlaidLinkHeadlessSessionScreen.tsx
import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';
import { styles } from '../styles/common';

export function PlaidLinkHeadlessSessionScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="← Back" onPress={onBack} />
      <Text style={styles.title}>PlaidLinkHeadlessSession</Text>
    </SafeAreaView>
  );
}