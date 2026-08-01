import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, fonts, radii } from "../theme/tokens";

export function PrimaryButton({ children, onPress, disabled, icon: Icon = ArrowRight, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryBtn,
        { backgroundColor: disabled ? "#B9C4BC" : colors.green900, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Text style={styles.primaryBtnText}>{children}</Text>
      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Icon size={17} color="#fff" />}
    </Pressable>
  );
}

export function GhostButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.ghostBtn}>
      <Text style={styles.ghostBtnText}>{children}</Text>
    </Pressable>
  );
}

export function StatusPill({ tone = "green", children }) {
  const map = {
    green: { bg: colors.sage, fg: colors.green900 },
    gold: { bg: colors.goldSoft, fg: "#7A5A15" },
    rust: { bg: colors.rustSoft, fg: colors.rust },
  };
  const t = map[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

export function Field({ label, placeholder, value, onChangeText, mono, autoCapitalize = "words", keyboardType = "default" }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA79E"
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[styles.input, { fontFamily: mono ? fonts.mono : fonts.body }]}
      />
    </View>
  );
}

export function FieldDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>or enter manually</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function ScreenHeader({ title, onBack, right }) {
  const { ChevronLeft } = require("lucide-react-native");
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={{ marginRight: 8 }}>
            <ChevronLeft size={22} color={colors.ink} />
          </Pressable>
        ) : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function SavedProfileCard({ label, onApply }) {
  const { Star, ChevronRight } = require("lucide-react-native");
  return (
    <Pressable onPress={onApply} style={styles.savedCard}>
      <View style={styles.savedIcon}>
        <Star size={16} color={colors.gold} fill={colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.savedTitle}>Use your saved {label}</Text>
        <Text style={styles.savedSub}>From your last renewal — tap to fill instantly</Text>
      </View>
      <ChevronRight size={17} color="#7A5A15" />
    </Pressable>
  );
}

export function SaveToggle({ checked, onChange }) {
  const { Check } = require("lucide-react-native");
  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.saveToggleRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Check size={12} color="#fff" /> : null}
      </View>
      <Text style={styles.saveToggleText}>Save these details so I don't have to retype them next renewal</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    width: "100%",
    borderRadius: radii.lg,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#fff", fontFamily: fonts.displayBold, fontSize: 15 },
  ghostBtn: {
    width: "100%",
    borderRadius: radii.lg,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: colors.green900,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBtnText: { color: colors.green900, fontFamily: fonts.displayBold, fontSize: 15 },
  pill: { borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontFamily: fonts.bodySemibold, fontSize: 11 },
  fieldLabel: { fontFamily: fonts.bodyMedium, color: colors.mute, fontSize: 12, marginBottom: 6 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: "#fff",
  },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2DED2" },
  dividerText: { fontFamily: fonts.body, color: colors.mute, fontSize: 11 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 19 },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.goldSoft,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  savedTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  savedSub: { fontFamily: fonts.body, color: "#7A5A15", fontSize: 11.5, marginTop: 2 },
  saveToggleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#C9D2CB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: colors.green900, borderColor: colors.green900 },
  saveToggleText: { flex: 1, fontFamily: fonts.body, color: colors.mute, fontSize: 12 },
});
