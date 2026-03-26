import { useEvent } from "expo";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";
import {
  ConnectButton,
  ErrorView,
  SdkVersionView,
} from "../components/components";
import { styles } from "../styles/common";
import { SessionState } from "../types/types";

type Props = { onBack: () => void };

export function PlaidLinkSessionScreen({ onBack }: Props) {
  const [state, setState] = useState<SessionState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSuccess = useEvent(ReactNativePlaidLinkSdk, "onSuccess");
  const onExit = useEvent(ReactNativePlaidLinkSdk, "onExit");
  const onEvent = useEvent(ReactNativePlaidLinkSdk, "onEvent");

  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    setState("loading");
    setErrorMessage(null);
    try {
      await ReactNativePlaidLinkSdk.createPlaidLinkSession(
        "link-sandbox-522ffba3-fce4-421c-99d0-db4586eaf876"
      );
      setState("ready");
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to create session.");
    }
  };

  const handleOpen = async () => {
    try {
      await ReactNativePlaidLinkSdk.openLinkSession(false);
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to open session.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Link Session Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          {state === "error" && errorMessage && (
            <ErrorView message={errorMessage} />
          )}

          <ConnectButton
            state={state}
            onRetry={createSession}
            onOpen={handleOpen}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
