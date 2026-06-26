// app/index.tsx
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import ReactNativePlaidLinkSdk from "react-native-plaid-link-sdk";

import { styles } from "./styles/common";
import { Screen, SCREENS } from "./types/types";
import { PlaidLinkSessionScreen } from "./screens/PlaidLinkSessionScreen";
import { PlaidLinkHeadlessSessionScreen } from "./screens/PlaidLinkHeadlessSessionScreen";
import { PlaidLayerSessionScreen } from "./screens/PlaidLayerSessionScreen";
import { PlaidEmbeddedSearchScreen } from "./screens/PlaidEmbeddedSearchScreen";
import { SyncFinanceKitScreen } from "./screens/SyncFinanceKitScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("list");

  if (screen === "plaidLinkSession")
    return <PlaidLinkSessionScreen onBack={() => setScreen("list")} />;
  if (screen === "plaidLinkHeadlessSession")
    return <PlaidLinkHeadlessSessionScreen onBack={() => setScreen("list")} />;
  if (screen === "plaidLayerSession")
    return <PlaidLayerSessionScreen onBack={() => setScreen("list")} />;
  if (screen === "plaidEmbeddedSearch")
    return <PlaidEmbeddedSearchScreen onBack={() => setScreen("list")} />;
  if (screen === "syncFinanceKit")
    return <SyncFinanceKitScreen onBack={() => setScreen("list")} />;

  return (
    <SafeAreaView style={[styles.container, styles.androidSafeArea]}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>LinkKit Examples</Text>
        <Text style={styles.sdkVersion}>
          SDK: {ReactNativePlaidLinkSdk.sdkVersion}
        </Text>
        {SCREENS.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={styles.row}
            onPress={() => setScreen(s.key)}
          >
            <Text style={styles.rowTitle}>{s.title}</Text>
            <Text style={styles.rowDescription}>{s.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
