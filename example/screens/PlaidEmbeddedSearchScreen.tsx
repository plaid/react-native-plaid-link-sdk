import { useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import {
  PlaidEmbeddedSearchView,
  LinkExit,
  LinkEvent,
  LinkSuccess,
} from "react-native-plaid-link-sdk";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import {
  ErrorView,
  SdkVersionView,
  TokenInputView,
} from "../components/components";
import { styles } from "../styles/common";
import { isValidToken } from "../utils/validation";
import { LinkExitScreen } from "./LinkExitScreen";
import { LinkSuccessScreen } from "./LinkSuccessScreen";

type Props = { onBack: () => void };

export function PlaidEmbeddedSearchScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [isViewReady, setIsViewReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkExit, setLinkExit] = useState<LinkExit | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<LinkSuccess | null>(null);
  const events = useRef<LinkEvent[]>([]);

  const hasValidToken = isValidToken(token.trim());
  const canShowView = hasValidToken && Platform.OS === "ios";

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
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Embedded Search Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <TokenInputView token={token} onTokenChange={setToken} />

          {Platform.OS !== "ios" && (
            <ErrorView message="Embedded Search is only available on iOS" />
          )}

          {errorMessage && <ErrorView message={errorMessage} />}

          {canShowView && (
            <View style={componentStyles.embeddedContainer}>
              <PlaidEmbeddedSearchView
                token={token.trim()}
                style={componentStyles.embeddedView}
                onSuccess={handleSuccess}
                onExit={handleExit}
                onEvent={handleEvent}
                onLoad={handleLoad}
              />
            </View>
          )}

          {!hasValidToken && (
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

const componentStyles = StyleSheet.create({
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
