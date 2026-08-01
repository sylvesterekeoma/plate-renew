import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { PrimaryButton } from "../../src/components/UI";

export default function Welcome() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <View style={styles.idCard}>
          <View style={styles.idCardTop}>
            <View>
              <Text style={styles.idEyebrow}>Federal Republic of Nigeria</Text>
              <Text style={styles.idTitle}>Vehicle Papers</Text>
              <Text style={styles.idSubtitle}>+ Driver's License</Text>
            </View>
            <ShieldCheck size={22} color={colors.gold} />
          </View>
          <View style={styles.idCardBottom}>
            <View>
              <Text style={styles.idNumber}>AB1 •••• •••• 92</Text>
              <Text style={styles.idExpiry}>Expires 03 / 2027</Text>
            </View>
            <View style={styles.idChip} />
          </View>
        </View>
        <Text style={styles.heading}>Skip the FRSC queue.{"\n"}We renew it all for you.</Text>
        <Text style={styles.body}>
          PlateRenew connects you with verified agencies to renew your driver's license and vehicle papers — from
          document pickup to a delivered card.
        </Text>
      </View>
      <View style={{ gap: 12 }}>
        <PrimaryButton onPress={() => router.push("/onboarding/face-capture")}>Get started</PrimaryButton>
        <Text style={styles.loginRow}>
          Already have an account? <Text style={{ color: colors.green900, fontWeight: "600" }}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone, paddingHorizontal: 24, paddingVertical: 24, justifyContent: "space-between" },
  center: { alignItems: "center" },
  idCard: { width: "100%", borderRadius: radii.lg, backgroundColor: colors.green900, padding: 20, marginBottom: 32 },
  idCardTop: { flexDirection: "row", justifyContent: "space-between" },
  idEyebrow: { fontFamily: fonts.body, color: "#9FC5AE", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" },
  idTitle: { fontFamily: fonts.display, color: "#fff", fontSize: 15, marginTop: 2 },
  idSubtitle: { fontFamily: fonts.display, color: "#9FC5AE", fontSize: 15, marginTop: 3, letterSpacing: 0.5 },
  idCardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24 },
  idNumber: { fontFamily: fonts.mono, color: "#fff", fontSize: 13, letterSpacing: 1 },
  idExpiry: { fontFamily: fonts.body, color: "#9FC5AE", fontSize: 10, marginTop: 4 },
  idChip: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.gold },
  heading: { fontFamily: fonts.displayBold, color: colors.ink, fontSize: 22, textAlign: "center", lineHeight: 28 },
  body: { fontFamily: fonts.body, color: colors.mute, fontSize: 14, textAlign: "center", marginTop: 12, lineHeight: 20 },
  loginRow: { fontFamily: fonts.body, color: colors.mute, fontSize: 12, textAlign: "center" },
});
