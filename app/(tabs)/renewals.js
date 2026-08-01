import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { FileText } from "lucide-react-native";
import { colors, fonts } from "../../src/theme/tokens";
import { ScreenHeader } from "../../src/components/UI";

// TODO: fetch the user's renewal history via an API call
// (e.g. listRenewals() in src/lib/api.js) and render a list of
// past + active requests here, each linking into /renew or
// /(tabs)/track with its reference.
export default function Renewals() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Renewals" />
      <View style={styles.empty}>
        <FileText size={32} color={colors.mute} />
        <Text style={styles.emptyTitle}>No past renewals yet</Text>
        <Text style={styles.emptySub}>Requests you start will show up here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 40 },
  emptyTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 15, marginTop: 4 },
  emptySub: { fontFamily: fonts.body, color: colors.mute, fontSize: 12.5, textAlign: "center" },
});
