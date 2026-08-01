import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Check, Upload } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader, PrimaryButton, StatusPill } from "../../src/components/UI";
import StepTracker from "../../src/components/StepTracker";
import { useRenewal } from "../../src/context/RenewalContext";
import { DOC_LISTS, vehicleDocItems } from "../../src/data/mockData";

export default function Documents() {
  const router = useRouter();
  const { serviceType, form, docs, setDocs } = useRenewal();
  const items = serviceType === "vehicle" ? vehicleDocItems(form.paperTypes) : DOC_LISTS.license;
  const allDone = items.every((_, i) => docs[i]);
  const toggle = (i) => setDocs({ ...docs, [i]: !docs[i] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Documents" onBack={() => router.back()} />
      <StepTracker current={2} serviceType={serviceType} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.intro}>
          Tap each item to upload. Your agency reviews these before submitting to FRSC.
        </Text>
        {/* TODO: replace toggle() with a real expo-image-picker /
            expo-document-picker upload per item, storing the
            resulting URI and showing a thumbnail once attached. */}
        <View style={{ gap: 12 }}>
          {items.map((label, i) => {
            const done = !!docs[i];
            return (
              <Pressable key={label} onPress={() => toggle(i)} style={[styles.row, { borderColor: done ? colors.green700 : colors.border }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                  <View style={[styles.icon, { backgroundColor: done ? colors.sage : "#F1EEE4" }]}>
                    {done ? <Check size={16} color={colors.green900} /> : <Upload size={15} color={colors.mute} />}
                  </View>
                  <Text style={styles.label}>{label}</Text>
                </View>
                {done ? <StatusPill tone="green">Uploaded</StatusPill> : <StatusPill tone="rust">Required</StatusPill>}
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: 20 }}>
          <PrimaryButton onPress={() => router.push("/renew/payment")} disabled={!allDone}>
            Continue to payment
          </PrimaryButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  intro: { fontFamily: fonts.body, color: colors.mute, fontSize: 13, marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1.5, padding: 16 },
  icon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  label: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 13.5, flexShrink: 1 },
});
