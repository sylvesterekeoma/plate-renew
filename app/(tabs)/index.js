import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Bell, User, ChevronRight, FileText, Car, Building2, Fingerprint, ShieldCheck, Clock } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { StatusPill } from "../../src/components/UI";
import { useRenewal } from "../../src/context/RenewalContext";

import { EXPIRY_ITEMS } from "../../src/data/mockData";

const FEATURES = [
  { Icon: Building2, t: "Vetted agencies only", d: "Every partner is verified before they can take a job" },
  { Icon: Fingerprint, t: "Face-verified requests", d: "Nobody can renew your license or papers as you without you" },
  { Icon: ShieldCheck, t: "Tracked end-to-end", d: "See every step until the card is in your hand" },
];

// Whichever item expires soonest is the one worth surfacing —
// recomputed each render since EXPIRY_ITEMS will eventually come
// from a live API instead of this static mock list.
const soonestExpiring = [...EXPIRY_ITEMS].sort((a, b) => a.daysLeft - b.daysLeft)[0];

export default function Dashboard() {
  const router = useRouter();
  const { resetWizard, activeReference } = useRenewal();

  const goRenew = (type) => {
    resetWizard(type);
    router.push(type === "license" ? "/renew/license-details" : "/renew/vehicle-details");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroEyebrow}>Welcome back,</Text>
            <Text style={styles.heroName}>Adaeze O.</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Bell size={19} color="#fff" />
            <View style={styles.avatar}>
              <User size={17} color={colors.green900} />
            </View>
          </View>
        </View>
        <Pressable onPress={() => goRenew(soonestExpiring.serviceType)} style={styles.expiryCard}>
          <View>
            <Text style={styles.expiryLabel}>Your {soonestExpiring.label} expires in</Text>
            <Text style={styles.expiryValue}>{soonestExpiring.daysLeft} days</Text>
          </View>
          <StatusPill tone="gold">Renew now</StatusPill>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {activeReference && (
          <Pressable onPress={() => router.push("/(tabs)/track")} style={styles.activeCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Clock size={20} color="#7A5A15" />
              <View>
                <Text style={styles.activeTitle}>Renewal in progress</Text>
                <Text style={styles.activeSub}>Documents under agency review</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#7A5A15" />
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickRow}>
          <Pressable onPress={() => goRenew("license")} style={styles.quickCard}>
            <View style={styles.quickIcon}>
              <FileText size={17} color={colors.green900} />
            </View>
            <Text style={styles.quickTitle}>Renew license</Text>
            <Text style={styles.quickSub}>Start a new request</Text>
          </Pressable>
          <Pressable onPress={() => goRenew("vehicle")} style={styles.quickCard}>
            <View style={styles.quickIcon}>
              <Car size={17} color={colors.green900} />
            </View>
            <Text style={styles.quickTitle}>Vehicle papers</Text>
            <Text style={styles.quickSub}>Licence, roadworthiness, insurance</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Why PlateRenew</Text>
        <View style={{ gap: 10 }}>
          {FEATURES.map((f) => (
            <View key={f.t} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <f.Icon size={15} color={colors.green900} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{f.t}</Text>
                <Text style={styles.featureSub}>{f.d}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.green900, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroEyebrow: { fontFamily: fonts.body, color: "#9FC5AE", fontSize: 12 },
  heroName: { fontFamily: fonts.display, color: "#fff", fontSize: 19 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" },
  expiryCard: {
    marginTop: 20,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiryLabel: { fontFamily: fonts.body, color: "#CFE3D6", fontSize: 11 },
  expiryValue: { fontFamily: fonts.displayBold, color: "#fff", fontSize: 24 },
  body: { paddingHorizontal: 24, paddingVertical: 20, gap: 20 },
  activeCard: {
    borderRadius: radii.md,
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  activeSub: { fontFamily: fonts.body, color: "#7A5A15", fontSize: 11.5 },
  sectionTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 15, marginBottom: -8 },
  quickRow: { flexDirection: "row", gap: 12 },
  quickCard: { flex: 1, borderRadius: radii.md, backgroundColor: colors.card, padding: 16 },
  quickIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  quickTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  quickSub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11, marginTop: 2 },
  featureRow: { flexDirection: "row", gap: 12, borderRadius: radii.md, backgroundColor: colors.card, padding: 14, alignItems: "flex-start" },
  featureIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontFamily: fonts.bodySemibold, color: colors.ink, fontSize: 13 },
  featureSub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5, marginTop: 2 },
});
