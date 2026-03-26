import { Button, View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/common';
import { SessionState } from '../types/types';

export function LinkButton({ state, onCreate, onOpen }: { state: SessionState; onCreate: () => void; onOpen: () => void }) {
    switch (state) {
      case 'idle': return <Button title="Create Session" onPress={onCreate} />;
      case 'loading': return (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Initializing Link...</Text>
        </View>
      );
      case 'ready': return <Button title="Connect Bank Account" onPress={onOpen} />;
      case 'error': return <Button title="Retry" onPress={onCreate} />;
    }
  }
  
export function Group({ name, children }: { name: string; children: React.ReactNode }) {
    return (
      <View style={styles.group}>
        <Text style={styles.groupHeader}>{name}</Text>
        {children}
      </View>
    );
  }