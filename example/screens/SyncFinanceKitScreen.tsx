import { SafeAreaView, Text, Button } from "react-native";
import { styles } from "../styles/common";

export function SyncFinanceKitScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="← Back" onPress={onBack} />
      <Text style={styles.title}>Sync FinanceKit</Text>
    </SafeAreaView>
  );
}
