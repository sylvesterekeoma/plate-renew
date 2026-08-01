import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { CheckCircle2, Copy, Check, Clock } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { PrimaryButton } from "../../src/components/UI";
import { useRenewal } from "../../src/context/RenewalContext";
import { AGENCIES } from "../../src/data/mockData";

export default function Confirmation() {
  const router = useRouter();
  const { serviceType, agencyId, activeReference } = useRenewal();
  const agency = AGENCIES.find((a) => a.id === agencyId);
  const [copied, setCopied] = useState(false);
  const authority = serviceType === "vehicle" ? "the vehicle inspection office" : "FRSC";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <CheckCircle2 size={32} color={colors.green900} />
        </View>
        <Text style={styles.title}>Request submitted</Text>
        <Text style={styles.sub}>
          {agency?.name ?? "Your agency"} has received your documents and will begin processing with {authority}.
        </Text>

        <View style={styles.refCard}>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Tracking reference</Text>
            <Pressable onPress={() => setCopied(true)} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={styles.refValue}>{activeReference}</Text>
              {copied ? <Check size={13} color={colors.green700} /> : <Copy size={13} color={colors.mute} />}
            </Pressable>
          </View>
          <View style={styles.refRow}>
            <Text style={styles.refLabel}>Estimated ready by</Text>
            <Text style={styles.readyValue}>{agency?.turnaround ?? "5–7 working days"}</Text>
          </View>
        </View>
      </View>

      <PrimaryButton onPress={() => router.replace("/(tabs)/track")} icon={Clock}>
        Track my renewal
      </PrimaryButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone, paddingHorizontal: 24, paddingVertical: 24, justifyContent: "space-between" },
  center: { alignItems: "center", flex: 1, justifyContent: "center" },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontFamily: fonts.displayBold, color: colors.ink, fontSize: 19 },
  sub: { fontFamily: fonts.body, color: colors.mute, fontSize: 13, textAlign: "center", marginTop: 8, lineHeight: 19, paddingHorizontal: 8 },
  refCard: { width: "100%", borderRadius: radii.md, backgroundColor: colors.card, padding: 16, marginTop: 24 },
  refRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  refLabel: { fontFamily: fonts.body, color: colors.mute, fontSize: 12 },
  refValue: { fontFamily: fonts.mono, color: colors.ink, fontSize: 13, fontWeight: "600" },
  readyValue: { fontFamily: fonts.body, color: colors.ink, fontSize: 12.5, fontWeight: "500" },
});
