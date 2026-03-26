import { SafeAreaView, Text, Button } from "react-native";
import { styles } from "../styles/common";

export function PlaidLayerSessionScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="← Back" onPress={onBack} />
      <Text style={styles.title}>PlaidLayerSession</Text>
    </SafeAreaView>
  );
}
