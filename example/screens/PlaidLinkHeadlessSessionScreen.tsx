import { useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  createPlaidHeadlessSession,
  LinkExit,
  LinkEvent,
  LinkSuccess,
  PlaidHeadlessSession,
  LinkEventName,
} from "react-native-plaid-link-sdk";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import {
  ErrorView,
  SdkVersionView,
  TokenInputView,
} from "../components/components";
import { styles } from "../styles/common";
import { SessionState } from "../types/types";
import { isValidToken } from "../utils/validation";
import { LinkExitScreen } from "./LinkExitScreen";
import { LinkSuccessScreen } from "./LinkSuccessScreen";

type Props = { onBack: () => void };

export function PlaidLinkHeadlessSessionScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [state, setState] = useState<SessionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkExit, setLinkExit] = useState<LinkExit | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<LinkSuccess | null>(null);
  const sessionRef = useRef<PlaidHeadlessSession | null>(null);
  const events = useRef<LinkEvent[]>([]);

  const createSession = async () => {
    if (!token.trim()) {
      setErrorMessage("Please enter a link token");
      return;
    }

    if (!isValidToken(token)) {
      setErrorMessage("Invalid token format");
      return;
    }

    setState("loading");
    setErrorMessage(null);
    events.current = [];
    try {
      sessionRef.current = await createPlaidHeadlessSession({
        token: token.trim(),
        onSuccess: (success) => {
          console.log(
            "[PlaidHeadless] onSuccess:",
            JSON.stringify(success, null, 2)
          );
          setLinkSuccess(success);
        },
        onExit: (exit) => {
          console.log("[PlaidHeadless] onExit:", JSON.stringify(exit, null, 2));
          setLinkExit(exit);
        },
        onEvent: (event) => {
          console.log(
            "[PlaidHeadless] onEvent:",
            JSON.stringify(event, null, 2)
          );
          events.current = [...events.current, event];

          if (event.eventName === LinkEventName.ERROR) {
            setState("error");
            setErrorMessage(
              event.metadata.errorMessage ?? "Failed to create session."
            );
          }
        },
        onLoad: () => {
          console.log("[PlaidHeadless] onLoad - session ready");
          setState("ready");
        },
      });
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to create session.");
    }
  };

  const handleStart = async () => {
    console.log("[PlaidHeadless] handleStart - session:", sessionRef.current);
    try {
      await sessionRef.current?.start();
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to start session.");
    }
  };

  const isLoading = state === "loading";
  const isReady = state === "ready";
  const isIdle = state === "idle" || state === "error";
  const canCreateSession = isIdle && isValidToken(token);
  const isEnabled = canCreateSession || isReady;

  let buttonTitle = "Launch Payment Flow";
  if (isLoading) {
    buttonTitle = "Initializing...";
  } else if (isIdle) {
    buttonTitle = "Create Headless Session";
  }

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Link Headless Session Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <View style={headlessStyles.warningBox}>
            <Text style={headlessStyles.warningIcon}>⚠️</Text>
            <Text style={headlessStyles.warningText}>
              Important: The link token must be a payment token that triggers a
              "headless" flow, otherwise the flow will consistently error out.
            </Text>
          </View>

          <TokenInputView token={token} onTokenChange={setToken} />

          {state === "error" && errorMessage && (
            <ErrorView message={errorMessage} />
          )}

          <View
            style={[styles.button, !isEnabled && styles.buttonDisabled]}
            pointerEvents={isEnabled ? "auto" : "none"}
          >
            <Button
              title={buttonTitle}
              onPress={isReady ? handleStart : createSession}
              disabled={!isEnabled}
              color="#fff"
            />
            {isLoading && (
              <ActivityIndicator color="#fff" style={styles.spinner} />
            )}
          </View>
        </View>
      </ScrollView>

      {linkSuccess && (
        <LinkSuccessScreen
          linkSuccess={linkSuccess}
          events={events.current}
          onClose={() => {
            setLinkSuccess(null);
            setToken("");
            setState("idle");
            setErrorMessage(null);
            sessionRef.current = null;
            events.current = [];
          }}
        />
      )}

      {linkExit && (
        <LinkExitScreen
          linkExit={linkExit}
          events={events.current}
          onClose={() => {
            setLinkExit(null);
            setToken("");
            setState("idle");
            setErrorMessage(null);
            sessionRef.current = null;
            events.current = [];
          }}
        />
      )}
    </SafeAreaView>
  );
}

const headlessStyles = StyleSheet.create({
  warningBox: {
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    width: "100%",
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 28,
  },
  warningText: {
    fontSize: 14,
    color: "#ea580c",
    textAlign: "center",
    fontWeight: "500",
  },
});
