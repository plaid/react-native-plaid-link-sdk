import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  LinkAccount,
  LinkEvent,
  LinkInstitution,
  LinkSuccess,
} from "react-native-plaid-link-sdk";

type Props = {
  linkSuccess: LinkSuccess;
  events: LinkEvent[];
  onClose: () => void;
};

export function LinkSuccessScreen({ linkSuccess, events, onClose }: Props) {
  const { publicToken, metadata } = linkSuccess;
  const institution = getInstitution(metadata.institution);

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied to clipboard", label);
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, styles.androidSafeArea]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🟢 LinkSuccess</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll}>
          <SectionHeader title="Public Token" />
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                copyToClipboard(publicToken, "Public token copied")
              }
            >
              <Text style={styles.tokenText}>{publicToken}</Text>
              <Text style={styles.copyIcon}>📋</Text>
            </TouchableOpacity>
          </View>

          {events.length > 0 && (
            <>
              <SectionHeader title="Link Events" />
              <View style={styles.card}>
                {events.map((event, index) => (
                  <ExpandableEvent
                    key={index}
                    event={event}
                    isLast={index === events.length - 1}
                  />
                ))}
              </View>
            </>
          )}

          <SectionHeader title="Metadata" />
          <View style={styles.card}>
            {institution && (
              <Row
                label="Institution"
                value={`${institution.name} (${institution.id})`}
              />
            )}
            <AccountsRow accounts={metadata.accounts} />
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                copyToClipboard(metadata.linkSessionId, "Session ID copied")
              }
            >
              <Text style={styles.rowLabel}>Session ID</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue} numberOfLines={1}>
                  {metadata.linkSessionId}
                </Text>
                <Text style={styles.copyIcon}>📋</Text>
              </View>
            </TouchableOpacity>
          </View>

          <SectionHeader title="Metadata JSON" />
          <View style={styles.card}>
            <Text style={styles.mono} selectable>
              {metadata.metadataJson || "---"}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function AccountsRow({ accounts }: { accounts: LinkAccount[] }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>Accounts</Text>
      {accounts.length === 0 ? (
        <Text style={styles.rowValue}>—</Text>
      ) : (
        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <Text key={account.id} style={styles.rowValue}>
              {account.name ?? "—"} {account.mask ? `••${account.mask}` : ""}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function ExpandableEvent({
  event,
  isLast,
}: {
  event: LinkEvent;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded((v) => !v)}
      style={[styles.eventRow, isLast && styles.eventRowLast]}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{event.eventName}</Text>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </View>
      {expanded && (
        <Text style={styles.mono}>
          {JSON.stringify(event.metadata, null, 2)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function getInstitution(institution: unknown): LinkInstitution | null {
  if (
    typeof institution === "object" &&
    institution !== null &&
    "name" in institution &&
    "id" in institution
  ) {
    return institution as LinkInstitution;
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f7" },
  androidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "600" },
  closeButton: { padding: 8 },
  closeIcon: { fontSize: 20, color: "#888" },
  scroll: { flex: 1 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 6,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  rowLabel: { fontSize: 15, color: "#000", flex: 1 },
  rowValue: { fontSize: 15, color: "#555", textAlign: "right" },
  tokenText: { fontSize: 14, color: "#333", flex: 1, marginRight: 8 },
  copyIcon: { fontSize: 16 },
  accountsList: { alignItems: "flex-end", gap: 4 },
  mono: {
    fontFamily: "Courier",
    fontSize: 12,
    color: "#333",
    paddingVertical: 12,
  },
  eventRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  eventRowLast: { borderBottomWidth: 0 },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventName: { fontSize: 15, fontWeight: "600" },
  chevron: { fontSize: 12, color: "#888" },
});
