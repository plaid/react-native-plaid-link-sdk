import { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Switch,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import {
  syncFinanceKit,
  FinanceKitSyncBehavior,
} from "react-native-plaid-link-sdk";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import {
  ErrorView,
  SdkVersionView,
  TokenInputView,
} from "../components/components";
import { styles } from "../styles/common";
import { isValidToken } from "../utils/validation";

type Props = { onBack: () => void };

export function SyncFinanceKitScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [requestAuthorizationIfNeeded, setRequestAuthorizationIfNeeded] =
    useState(true);
  const [syncBehavior] = useState<FinanceKitSyncBehavior>(
    FinanceKitSyncBehavior.SIMULATED
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(false);

  const handleSync = async () => {
    if (!token.trim()) {
      setErrorMessage("Please enter a link token");
      return;
    }

    if (!isValidToken(token)) {
      setErrorMessage("Invalid token format");
      return;
    }

    if (Platform.OS !== "ios") {
      setErrorMessage("FinanceKit is only available on iOS");
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await syncFinanceKit({
        token: token.trim(),
        requestAuthorizationIfNeeded,
        syncBehavior,
      });
      setStatusMessage("Sync completed successfully");
      setStatusIsError(false);
      setIsSyncing(false);
    } catch (e: any) {
      const message = e.message ?? "Sync failed";
      setStatusMessage(message);
      setStatusIsError(true);
      setIsSyncing(false);
    }
  };

  const canSync = isValidToken(token) && !isSyncing && Platform.OS === "ios";

  if (Platform.OS === "android") {
    return (
      <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <ErrorView message="FinanceKit is only available on iOS" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Sync FinanceKit Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <TokenInputView token={token} onTokenChange={setToken} />

          <View style={componentStyles.warningBox}>
            <Text style={componentStyles.warningTitle}>⚠️ IMPORTANT</Text>
            <Text style={componentStyles.warningText}>Requirements:</Text>
            <Text style={componentStyles.requirementText}>
              1. You MUST have a FinanceKit entitlement from Apple (or the app
              will crash)
            </Text>
            <Text style={componentStyles.requirementText}>
              2. The link token must be associated with an access token from a
              previous session where the user linked their Apple Card
            </Text>
            <Text style={componentStyles.requirementText}>
              3. iOS 17.4 or later is required
            </Text>
          </View>

          <View style={componentStyles.toggleContainer}>
            <View style={componentStyles.toggleRow}>
              <Text style={componentStyles.toggleLabel}>
                Request Authorization If Needed
              </Text>
              <Switch
                value={requestAuthorizationIfNeeded}
                onValueChange={setRequestAuthorizationIfNeeded}
                disabled={isSyncing}
              />
            </View>

            <View style={componentStyles.toggleRow}>
              <Text style={componentStyles.toggleLabel}>
                Sync Behavior: Simulated
              </Text>
              <Switch value={true} disabled={true} />
            </View>
          </View>

          {errorMessage && <ErrorView message={errorMessage} />}

          {statusMessage && (
            <View
              style={[
                componentStyles.statusBox,
                statusIsError
                  ? componentStyles.statusError
                  : componentStyles.statusSuccess,
              ]}
            >
              <Text
                style={[
                  componentStyles.statusText,
                  statusIsError
                    ? componentStyles.statusTextError
                    : componentStyles.statusTextSuccess,
                ]}
              >
                {statusMessage}
              </Text>
            </View>
          )}

          <View
            style={[styles.button, !canSync && styles.buttonDisabled]}
            pointerEvents={canSync ? "auto" : "none"}
          >
            <Button
              title={isSyncing ? "Syncing..." : "Sync FinanceKit"}
              onPress={handleSync}
              disabled={!canSync}
              color="#fff"
            />
            {isSyncing && (
              <ActivityIndicator color="#fff" style={styles.spinner} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const componentStyles = StyleSheet.create({
  warningBox: {
    width: "100%",
    maxWidth: 400,
    padding: 12,
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFE69C",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF9500",
    marginBottom: 8,
    textAlign: "center",
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
    lineHeight: 18,
  },
  toggleContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    gap: 16,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  statusBox: {
    width: "100%",
    maxWidth: 400,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: "#D1F2EB",
    borderColor: "#A9DFBF",
  },
  statusError: {
    backgroundColor: "#FADBD8",
    borderColor: "#F5B7B1",
  },
  statusText: {
    fontSize: 14,
    textAlign: "center",
  },
  statusTextSuccess: {
    color: "#27AE60",
  },
  statusTextError: {
    color: "#E74C3C",
  },
});
