import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Building2, Check } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { StatusPill, ScreenHeader } from "../../src/components/UI";
import { useRenewal } from "../../src/context/RenewalContext";
import { AGENCIES } from "../../src/data/mockData";
import { getRenewalStatus } from "../../src/lib/api";

export default function Track() {
  const { activeReference, agencyId } = useRenewal();
  const [status, setStatus] = useState(null);
  const agency = AGENCIES.find((a) => a.id === agencyId);

  useEffect(() => {
    if (!activeReference) return;
    getRenewalStatus(activeReference).then(setStatus);
  }, [activeReference]);

  if (!activeReference || !status) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
        <ScreenHeader title="Track renewal" />
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No active renewal</Text>
          <Text style={styles.emptySub}>Start a renewal from Home to see its progress here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Track renewal" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={styles.refCard}>
          <View>
            <Text style={styles.refLabel}>Reference</Text>
            <Text style={styles.refValue}>{status.reference}</Text>
          </View>
          <StatusPill tone="gold">In progress</StatusPill>
        </View>

        <View style={{ marginTop: 24 }}>
          {status.steps.map((s, i) => (
            <View key={s.t} style={styles.stepRow}>
              {i < status.steps.length - 1 && (
                <View style={[styles.connector, { backgroundColor: s.done ? colors.green700 : "#E2DED2" }]} />
              )}
              <View style={[styles.dot, { backgroundColor: s.done ? colors.green900 : s.active ? colors.gold : "#E2DED2" }]}>
                {s.done && <Check size={11} color="#fff" />}
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.stepTitle}>{s.t}</Text>
                {s.active && <Text style={styles.stepActive}>In progress now</Text>}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.agencyRow}>
          <View style={styles.agencyIcon}>
            <Building2 size={17} color={colors.green900} />
          </View>
          <View>
            <Text style={styles.agencyName}>{agency?.name ?? "Your agency"}</Text>
            <Text style={styles.agencySub}>Assigned agent for this request</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 40 },
  emptyTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 15 },
  emptySub: { fontFamily: fonts.body, color: colors.mute, fontSize: 12.5, textAlign: "center" },
  refCard: {
    borderRadius: radii.md,
    backgroundColor: colors.green900,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refLabel: { fontFamily: fonts.body, color: "#9FC5AE", fontSize: 11 },
  refValue: { fontFamily: fonts.mono, color: "#fff", fontSize: 14 },
  stepRow: { flexDirection: "row", paddingBottom: 26, position: "relative" },
  connector: { position: "absolute", left: 9, top: 20, width: 2, height: "100%" },
  dot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  stepActive: { fontFamily: fonts.bodyMedium, color: colors.gold, fontSize: 11, marginTop: 2 },
  agencyRow: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: colors.card, borderRadius: radii.md, padding: 14 },
  agencyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  agencyName: { fontFamily: fonts.bodySemibold, color: colors.ink, fontSize: 12.5 },
  agencySub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11 },
});
