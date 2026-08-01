import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck } from "lucide-react-native";
import { colors, fonts } from "../src/theme/tokens";

// TODO: once auth is wired up, check for a stored session
// (expo-secure-store) here and route straight to /(tabs) if the
// user is already enrolled, instead of always going to onboarding.
export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/onboarding/welcome"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={[colors.green900, colors.green700, "#0E4534"]} style={styles.container}>
      <View style={styles.badge}>
        <ShieldCheck size={38} color={colors.green900} strokeWidth={2.2} />
      </View>
      <Text style={styles.title}>PlateRenew</Text>
      <Text style={styles.subtitle}>Your license, renewed by trusted agents</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontFamily: fonts.displayBold, color: "#fff", fontSize: 26 },
  subtitle: { fontFamily: fonts.body, color: "#CFE3D6", fontSize: 13, marginTop: 6 },
});
