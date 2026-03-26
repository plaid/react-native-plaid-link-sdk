import { Button, View, Text, ActivityIndicator } from "react-native";
import { styles } from "../styles/common";
import { SessionState } from "../types/types";

export function SdkVersionView({ version }: { version: string }) {
  return <Text style={styles.sdkVersion}>LinkKit {version}</Text>;
}

export function ErrorView({ message }: { message: string }) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
}

export function ConnectButton({
  state,
  onRetry,
  onOpen,
}: {
  state: SessionState;
  onRetry: () => void;
  onOpen: () => void;
}) {
  const isLoading = state === "loading";
  const isReady = state === "ready";

  return (
    <View
      style={[styles.button, !isReady && styles.buttonDisabled]}
      pointerEvents={isReady ? "auto" : "none"}
    >
      <Button
        title={isLoading ? "Initializing..." : "Connect Bank Account"}
        onPress={isReady ? onOpen : onRetry}
        disabled={isLoading}
        color="#fff"
      />
      {isLoading && <ActivityIndicator color="#fff" style={styles.spinner} />}
    </View>
  );
}
