import { useEffect, useRef, useState } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  LinkExit,
  LinkEvent,
  LinkSuccess,
  PlaidEmbeddedSearchView,
} from "react-native-plaid-link-sdk";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import { SdkVersionView, TokenInputView } from "../components/components";
import { styles } from "../styles/common";
import { isValidToken } from "../utils/validation";
import { LinkExitScreen } from "./LinkExitScreen";
import { LinkSuccessScreen } from "./LinkSuccessScreen";

type Props = { onBack: () => void };

export function PlaidEmbeddedSearchScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [isViewReady, setIsViewReady] = useState(false);
  const [linkExit, setLinkExit] = useState<LinkExit | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<LinkSuccess | null>(null);
  const events = useRef<LinkEvent[]>([]);

  const trimmedToken = token.trim();
  const hasValidToken = isValidToken(trimmedToken);
  const canShowView = hasValidToken;

  useEffect(() => {
    setIsViewReady(false);
    events.current = [];
  }, [trimmedToken]);

  const handleSuccess = (success: LinkSuccess) => {
    console.log(
      "[PlaidEmbeddedSearch] onSuccess:",
      JSON.stringify(success, null, 2)
    );
    setLinkSuccess(success);
  };

  const handleExit = (exit: LinkExit) => {
    console.log("[PlaidEmbeddedSearch] onExit:", JSON.stringify(exit, null, 2));
    setLinkExit(exit);
  };

  const handleEvent = (event: LinkEvent) => {
    console.log(
      "[PlaidEmbeddedSearch] onEvent:",
      JSON.stringify(event, null, 2)
    );
    events.current = [...events.current, event];
  };

  const handleLoad = () => {
    console.log("[PlaidEmbeddedSearch] onLoad - view is ready");
    setIsViewReady(true);
  };

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Embedded Search Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <TokenInputView token={token} onTokenChange={setToken} />

          <View style={componentStyles.statusCard}>
            <StatusRow label="Platform" value={Platform.OS} />
            <StatusRow
              label="View"
              value={isViewReady ? "Loaded" : canShowView ? "Loading" : "Idle"}
            />
            <StatusRow label="Events" value={String(events.current.length)} />
          </View>

          {canShowView ? (
            <View style={componentStyles.embeddedContainer}>
              <PlaidEmbeddedSearchView
                token={trimmedToken}
                style={componentStyles.embeddedView}
                onSuccess={handleSuccess}
                onExit={handleExit}
                onEvent={handleEvent}
                onLoad={handleLoad}
              />
            </View>
          ) : (
            <View style={componentStyles.placeholderContainer}>
              <Text style={componentStyles.placeholderText}>
                Enter a valid link token to see the embedded search view
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {linkSuccess && (
        <LinkSuccessScreen
          linkSuccess={linkSuccess}
          events={events.current}
          onClose={() => {
            setLinkSuccess(null);
            events.current = [];
            setIsViewReady(false);
          }}
        />
      )}

      {linkExit && (
        <LinkExitScreen
          linkExit={linkExit}
          events={events.current}
          onClose={() => {
            setLinkExit(null);
            events.current = [];
            setIsViewReady(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={componentStyles.statusRow}>
      <Text style={componentStyles.statusLabel}>{label}</Text>
      <Text style={componentStyles.statusValue}>{value}</Text>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  statusCard: {
    width: "100%",
    maxWidth: 330,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 13,
    color: "#555",
  },
  statusValue: {
    fontSize: 13,
    color: "#111",
    fontWeight: "600",
  },
  embeddedContainer: {
    width: "100%",
    maxWidth: 330,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },
  embeddedView: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    maxWidth: 330,
    height: 400,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
