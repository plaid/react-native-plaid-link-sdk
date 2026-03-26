import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eee" },
  header: { fontSize: 28, fontWeight: "700", margin: 20 },
  title: { fontSize: 24, fontWeight: "700", margin: 20 },
  sdkVersion: { fontSize: 12, color: "#888", marginLeft: 20, marginBottom: 12 },
  row: {
    margin: 12,
    marginTop: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  rowTitle: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
  rowDescription: { fontSize: 14, color: "#555" },
  group: { margin: 20, backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  groupHeader: { fontSize: 20, marginBottom: 20 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingText: { color: "#888" },
  error: { marginTop: 10, color: "red" },
});
