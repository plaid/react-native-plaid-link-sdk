import {
  Button,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
} from "react-native";
import { styles } from "../styles/common";
import { SessionState } from "../types/types";
import { getTokenValidationError } from "../utils/validation";

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

export function TokenInputView({
  token,
  onTokenChange,
}: {
  token: string;
  onTokenChange: (token: string) => void;
}) {
  const handlePaste = async () => {
    const clipboardText = await Clipboard.getString();
    onTokenChange(clipboardText.trim());
  };

  const handleClear = () => {
    onTokenChange("");
  };

  const validationError = getTokenValidationError(token);

  return (
    <View style={componentStyles.inputContainer}>
      <Text style={componentStyles.inputLabel}>Link token</Text>
      <View style={componentStyles.inputWrapper}>
        <TextInput
          style={[
            componentStyles.input,
            validationError ? componentStyles.inputError : null,
          ]}
          placeholder="link-sandbox-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          placeholderTextColor="#999"
          value={token}
          onChangeText={onTokenChange}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={false}
        />
        <View style={componentStyles.inputButtons}>
          {token.length === 0 ? (
            <TouchableOpacity
              onPress={handlePaste}
              style={componentStyles.iconButton}
            >
              <Text style={componentStyles.iconText}>📋</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleClear}
              style={componentStyles.iconButton}
            >
              <Text style={componentStyles.iconText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {validationError && (
        <Text style={componentStyles.errorText}>{validationError}</Text>
      )}
    </View>
  );
}

export function ConnectButton({
  state,
  onRetry,
  onOpen,
  hasValidToken,
}: {
  state: SessionState;
  onRetry: () => void;
  onOpen: () => void;
  hasValidToken: boolean;
}) {
  const isLoading = state === "loading";
  const isReady = state === "ready";
  const isIdle = state === "idle" || state === "error";
  const canCreateSession = isIdle && hasValidToken;
  const isEnabled = canCreateSession || isReady;

  let buttonTitle = "Connect Bank Account";
  if (isLoading) {
    buttonTitle = "Initializing...";
  } else if (isIdle) {
    buttonTitle = "Create Link Session";
  }

  return (
    <View
      style={[styles.button, !isEnabled && styles.buttonDisabled]}
      pointerEvents={isEnabled ? "auto" : "none"}
    >
      <Button
        title={buttonTitle}
        onPress={isReady ? onOpen : onRetry}
        disabled={!isEnabled}
        color="#fff"
      />
      {isLoading && <ActivityIndicator color="#fff" style={styles.spinner} />}
    </View>
  );
}

const componentStyles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    paddingRight: 45,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  inputButtons: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  iconButton: {
    padding: 4,
  },
  iconText: {
    fontSize: 18,
    color: "#666",
  },
  errorText: {
    fontSize: 12,
    color: "#ff3b30",
    marginTop: 4,
  },
});
