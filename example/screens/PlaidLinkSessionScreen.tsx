import { useRef, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import {
  createPlaidLinkSession,
  LinkExit,
  LinkEvent,
  LinkSuccess,
  PlaidLinkSession,
  LinkEventName,
} from "react-native-plaid-link-sdk";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import {
  ConnectButton,
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

export function PlaidLinkSessionScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [state, setState] = useState<SessionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkExit, setLinkExit] = useState<LinkExit | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<LinkSuccess | null>(null);
  const sessionRef = useRef<PlaidLinkSession | null>(null);
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
      sessionRef.current = await createPlaidLinkSession({
        token: token.trim(),
        onSuccess: (success) => {
          console.log(
            "[PlaidLink] onSuccess:",
            JSON.stringify(success, null, 2)
          );
          setLinkSuccess(success);
        },
        onExit: (exit) => {
          console.log("[PlaidLink] onExit:", JSON.stringify(exit, null, 2));
          setLinkExit(exit);
        },
        onEvent: (event) => {
          console.log("[PlaidLink] onEvent:", JSON.stringify(event, null, 2));
          events.current = [...events.current, event];

          if (event.eventName === LinkEventName.ERROR) {
            setState("error");
            setErrorMessage(
              event.metadata.errorMessage ?? "Failed to create session."
            );
          }
        },
      });
      setState("ready");
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to create session.");
    }
  };

  const handleOpen = async () => {
    console.log("[PlaidLink] handleOpen - session:", sessionRef.current);
    try {
      await sessionRef.current?.open(false);
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to open session.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Link Session Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <TokenInputView token={token} onTokenChange={setToken} />

          {state === "error" && errorMessage && (
            <ErrorView message={errorMessage} />
          )}

          <ConnectButton
            state={state}
            onRetry={createSession}
            onOpen={handleOpen}
            hasValidToken={isValidToken(token)}
          />
        </View>
      </ScrollView>

      {linkSuccess && (
        <LinkSuccessScreen
          linkSuccess={linkSuccess}
          events={events.current}
          onClose={() => {
            setLinkSuccess(null);
            createSession();
          }}
        />
      )}

      {linkExit && (
        <LinkExitScreen
          linkExit={linkExit}
          events={events.current}
          onClose={() => {
            setLinkExit(null);
            createSession();
          }}
        />
      )}
    </SafeAreaView>
  );
}
