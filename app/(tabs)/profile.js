import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Alert, Linking } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  User, ChevronRight, FileText, Car, ScanFace, KeyRound,
  Trash2, LogOut, ShieldCheck, Mail, MessageCircle,
} from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader } from "../../src/components/UI";
import { getSavedProfile, clearSavedProfile } from "../../src/lib/savedProfile";

const SUPPORT_EMAIL = "support@platerenew.app";

export default function Profile() {
  const router = useRouter();
  const [savedLicense, setSavedLicense] = useState(null);
  const [savedVehicle, setSavedVehicle] = useState(null);

  const load = useCallback(() => {
    getSavedProfile("license").then(setSavedLicense);
    getSavedProfile("vehicle").then(setSavedVehicle);
  }, []);

  // Refresh whenever the tab regains focus, so a save/clear made
  // elsewhere (or on this screen) is always reflected here.
  useFocusEffect(load);

  const confirmClear = (kind, label, refresh) => {
    Alert.alert(
      `Forget saved ${label}?`,
      `You'll need to re-enter your ${label.toLowerCase()} next time you start a renewal.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Forget",
          style: "destructive",
          onPress: async () => {
            await clearSavedProfile(kind);
            refresh(null);
          },
        },
      ]
    );
  };

  const confirmLogout = () => {
    Alert.alert("Log out?", "You'll need to verify your face again to sign back in.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => router.replace("/onboarding/welcome") },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <User size={26} color={colors.green900} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Adaeze Okonkwo</Text>
            <View style={styles.verifiedRow}>
              <ShieldCheck size={13} color={colors.green700} />
              <Text style={styles.verifiedText}>Face-verified account</Text>
            </View>
          </View>
        </View>

        <SectionLabel>Saved details</SectionLabel>
        <SavedRow
          icon={FileText}
          title="Driver's license"
          subtitle={savedLicense ? `${savedLicense.fullName || "Saved"} · ${savedLicense.licenseNo || ""}` : "Nothing saved yet"}
          onClear={savedLicense ? () => confirmClear("license", "License details", setSavedLicense) : null}
        />
        <SavedRow
          icon={Car}
          title="Vehicle papers"
          subtitle={savedVehicle ? `${savedVehicle.vehicleMake || "Saved"} · ${savedVehicle.plateNo || ""}` : "Nothing saved yet"}
          onClear={savedVehicle ? () => confirmClear("vehicle", "Vehicle details", setSavedVehicle) : null}
        />

        <SectionLabel>Security</SectionLabel>
        <ActionRow
          icon={ScanFace}
          title="Re-enroll Face ID"
          subtitle="Update the face scan used to verify you"
          onPress={() => router.push("/onboarding/face-capture")}
        />
        <ActionRow
          icon={KeyRound}
          title="Change backup PIN"
          subtitle="Update your fallback PIN"
          onPress={() => router.push("/onboarding/pin-setup")}
        />

        <SectionLabel>Support</SectionLabel>
        <ActionRow
          icon={MessageCircle}
          title="Live chat"
          subtitle="Chat with our support team now"
          onPress={() => router.push("/support/chat")}
        />
        <ActionRow
          icon={Mail}
          title="Email us"
          subtitle={SUPPORT_EMAIL}
          onPress={() =>
            Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("PlateRenew support request")}`)
          }
        />

        <SectionLabel>Account</SectionLabel>
        <ActionRow icon={Mail} title="adaeze.okonkwo@email.com" subtitle="Contact email" onPress={() => {}} />

        <Pressable style={styles.logoutRow} onPress={confirmLogout}>
          <LogOut size={17} color={colors.rust} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <Text style={styles.version}>PlateRenew · v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function SavedRow({ icon: Icon, title, subtitle, onClear }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={17} color={colors.green900} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      {onClear ? (
        <Pressable onPress={onClear} hitSlop={10} style={styles.clearBtn}>
          <Trash2 size={16} color={colors.mute} />
        </Pressable>
      ) : null}
    </View>
  );
}

function ActionRow({ icon: Icon, title, subtitle, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Icon size={17} color={colors.green900} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <ChevronRight size={17} color={colors.mute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingBottom: 32 },
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontFamily: fonts.display, color: colors.ink, fontSize: 16 },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  verifiedText: { fontFamily: fonts.body, color: colors.green700, fontSize: 12 },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    color: colors.mute,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 8,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 13.5 },
  rowSub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5, marginTop: 2 },
  clearBtn: { padding: 4 },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.rust,
  },
  logoutText: { fontFamily: fonts.displayBold, color: colors.rust, fontSize: 14 },
  version: { textAlign: "center", fontFamily: fonts.body, color: colors.mute, fontSize: 11, marginTop: 16 },
});
