import { useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  createPlaidLayerSession,
  LinkExit,
  LinkEvent,
  LinkSuccess,
  PlaidLayerSession,
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

export function PlaidLayerSessionScreen({ onBack }: Props) {
  const [token, setToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+1 415-555-0015");
  const [dateOfBirth, setDateOfBirth] = useState("1975-01-18");
  const [state, setState] = useState<SessionState>("idle");
  const [sessionCreated, setSessionCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkExit, setLinkExit] = useState<LinkExit | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<LinkSuccess | null>(null);
  const sessionRef = useRef<PlaidLayerSession | null>(null);
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
    setSessionCreated(false);
    events.current = [];
    try {
      sessionRef.current = await createPlaidLayerSession({
        token: token.trim(),
        onSuccess: (success) => {
          console.log(
            "[PlaidLayer] onSuccess:",
            JSON.stringify(success, null, 2)
          );
          setLinkSuccess(success);
        },
        onExit: (exit) => {
          console.log("[PlaidLayer] onExit:", JSON.stringify(exit, null, 2));
          setLinkExit(exit);
        },
        onEvent: (event) => {
          console.log("[PlaidLayer] onEvent:", JSON.stringify(event, null, 2));
          events.current = [...events.current, event];

          if (event.eventName === LinkEventName.LAYER_READY) {
            setState("ready");
          } else if (event.eventName === LinkEventName.LAYER_NOT_AVAILABLE) {
            setState("error");
            setErrorMessage("Layer not available");
          } else if (event.eventName === LinkEventName.ERROR) {
            setState("error");
            setErrorMessage(
              event.metadata.errorMessage ?? "Failed to create session."
            );
          }
        },
      });
      setSessionCreated(true);
      setState("loading");
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to create session.");
    }
  };

  const handleSubmit = async () => {
    if (!sessionRef.current) {
      setErrorMessage("Session not available");
      return;
    }

    try {
      await sessionRef.current.submit({
        phoneNumber: phoneNumber.trim() || undefined,
        dateOfBirth: dateOfBirth.trim() || undefined,
      });
      console.log("[PlaidLayer] User data submitted");
    } catch (e: any) {
      setErrorMessage(e.message ?? "Failed to submit data.");
    }
  };

  const handleOpen = async () => {
    console.log("[PlaidLayer] handleOpen - session:", sessionRef.current);
    try {
      await sessionRef.current?.open();
    } catch (e: any) {
      setState("error");
      setErrorMessage(e.message ?? "Failed to open session.");
    }
  };

  const isLoading = state === "loading";
  const isReady = state === "ready";
  const isIdle = state === "idle" || state === "error";
  const canCreateSession = isIdle && isValidToken(token);

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <View style={styles.backButton}>
          <Button title="← Back" onPress={onBack} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Plaid Layer Session Example</Text>
          <SdkVersionView version={ReactNativePlaidLinkSdk.sdkVersion} />

          <TokenInputView token={token} onTokenChange={setToken} />

          {state === "error" && errorMessage && (
            <ErrorView message={errorMessage} />
          )}

          <View
            style={[styles.button, !canCreateSession && styles.buttonDisabled]}
            pointerEvents={canCreateSession ? "auto" : "none"}
          >
            <Button
              title={isLoading ? "Initializing..." : "Create Layer Session"}
              onPress={createSession}
              disabled={!canCreateSession || isLoading}
              color="#fff"
            />
          </View>

          {sessionCreated && (
            <View style={styles.userDataSection}>
              <Text style={styles.sectionTitle}>User Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>User Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 415-555-0011"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>User Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View
                style={[
                  styles.button,
                  !sessionRef.current && styles.buttonDisabled,
                ]}
                pointerEvents={sessionRef.current ? "auto" : "none"}
              >
                <Button
                  title="Submit User Data"
                  onPress={handleSubmit}
                  disabled={!sessionRef.current}
                  color="#fff"
                />
              </View>
            </View>
          )}

          {isReady && (
            <View style={styles.button}>
              <Button title="Launch Layer" onPress={handleOpen} color="#fff" />
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
