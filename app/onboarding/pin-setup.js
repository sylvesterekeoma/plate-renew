import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { colors, fonts } from "../../src/theme/tokens";
import { ScreenHeader } from "../../src/components/UI";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function PinSetup() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const press = async (n) => {
    if (pin.length >= 4) return;
    const next = pin + n;
    setPin(next);
    if (next.length === 4) {
      // TODO: don't store the raw PIN — hash it, or better, use it
      // only to derive a local unlock key while the real auth
      // token lives server-side.
      await SecureStore.setItemAsync("backup_pin_set", "true");
      setTimeout(() => router.replace("/(tabs)"), 400);
    }
  };
  const del = () => setPin(pin.slice(0, -1));

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Backup PIN" onBack={() => router.back()} />
      <Text style={styles.sub}>Set a 4-digit PIN as a fallback if face verification ever fails.</Text>
      <View style={styles.center}>
        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i < pin.length ? colors.green900 : "transparent" }]} />
          ))}
        </View>
        <View style={styles.grid}>
          {KEYS.map((k, i) =>
            k === "" ? (
              <View key={i} style={styles.key} />
            ) : (
              <Pressable key={i} onPress={() => (k === "⌫" ? del() : press(k))} style={styles.key}>
                <Text style={styles.keyText}>{k}</Text>
              </Pressable>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bone, paddingHorizontal: 8, paddingVertical: 8 },
  sub: { fontFamily: fonts.body, color: colors.mute, fontSize: 13, paddingHorizontal: 24, marginTop: -4, marginBottom: 24 },
  center: { flex: 1, alignItems: "center" },
  dots: { flexDirection: "row", gap: 16, marginBottom: 40 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.green900 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: 240, justifyContent: "space-between" },
  key: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  keyText: { fontFamily: fonts.display, color: colors.ink, fontSize: 20 },
});
