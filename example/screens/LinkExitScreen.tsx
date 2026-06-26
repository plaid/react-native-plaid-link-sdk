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
  LinkExit,
  LinkEvent,
  LinkInstitution,
} from "react-native-plaid-link-sdk";

type Props = {
  linkExit: LinkExit;
  events: LinkEvent[];
  onClose: () => void;
};

export function LinkExitScreen({ linkExit, events, onClose }: Props) {
  const { error, metadata } = linkExit;
  const institution = getInstitution(metadata.institution);

  const copyToClipboard = async (text: string) => {
    Alert.alert("Copied", text);
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, styles.androidSafeArea]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔴 LinkExit</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll}>
          <SectionHeader title="Exit Error" />
          <View style={styles.card}>
            {error ? (
              <>
                <Row label="Code" value={error.errorCode} />
                <Row label="Type" value={error.errorType} />
                <Row label="Message" value={error.errorMessage} />
                {error.displayMessage && (
                  <Row label="Display Message" value={error.displayMessage} />
                )}
              </>
            ) : (
              <Text style={styles.noError}>No error</Text>
            )}
          </View>

          <SectionHeader title="Metadata" />
          <View style={styles.card}>
            {metadata.status && <Row label="Status" value={metadata.status} />}
            {institution && (
              <Row label="Institution" value={institution.name} />
            )}
            <Row label="Request ID" value={metadata.requestId || "---"} />
            <TouchableOpacity
              onPress={() => copyToClipboard(metadata.linkSessionId)}
            >
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Session ID</Text>
                <View style={styles.rowValueRow}>
                  <Text style={styles.rowValue} numberOfLines={1}>
                    {metadata.linkSessionId || "---"}
                  </Text>
                  <Text style={styles.copyIcon}> 📋</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <SectionHeader title="Metadata JSON" />
          <View style={styles.card}>
            <Text style={styles.mono} selectable>
              {metadata.metadataJson || "---"}
            </Text>
          </View>

          {events.length > 0 && (
            <>
              <SectionHeader title="Link Events" />
              <View style={styles.card}>
                {events.map((event, index) => (
                  <ExpandableEvent key={index} event={event} />
                ))}
              </View>
            </>
          )}
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

function ExpandableEvent({ event }: { event: LinkEvent }) {
  return (
    <View style={styles.eventRow}>
      <Text style={styles.eventName}>{event.eventName}</Text>
      <Text style={styles.mono}>{JSON.stringify(event.metadata, null, 2)}</Text>
    </View>
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
    backgroundColor: "#f2f2f7",
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
  rowValueRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  rowLabel: { fontSize: 15, color: "#000", flex: 1 },
  rowValue: { fontSize: 15, color: "#555", textAlign: "right", flex: 1 },
  copyIcon: { fontSize: 15 },
  noError: { color: "green", paddingVertical: 12, fontSize: 15 },
  mono: {
    fontFamily: "Courier",
    fontSize: 12,
    color: "#333",
    paddingVertical: 12,
  },
  eventRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  eventName: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
});
