import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader, Field, FieldDivider, PrimaryButton, SavedProfileCard, SaveToggle } from "../../src/components/UI";
import StepTracker from "../../src/components/StepTracker";
import ExtractCard from "../../src/components/ExtractCard";
import { useRenewal } from "../../src/context/RenewalContext";
import { getSavedProfile, saveProfile } from "../../src/lib/savedProfile";
import { VEHICLE_PAPER_TYPES } from "../../src/data/mockData";

export default function VehicleDetails() {
  const router = useRouter();
  const { form, setForm } = useRenewal();
  const valid = form.plateNo && form.ownerName && form.vehicleMake && (form.paperTypes || []).length > 0;
  const [saved, setSaved] = useState(null);
  const [saveNext, setSaveNext] = useState(true);

  useEffect(() => {
    getSavedProfile("vehicle").then(setSaved);
  }, []);

  const applySaved = () => setForm((f) => ({ ...f, ...saved }));

  const togglePaperType = (key) => {
    const cur = form.paperTypes || [];
    const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
    setForm({ ...form, paperTypes: next });
  };

  const handleContinue = async () => {
    if (saveNext) {
      const { ownerName, plateNo, vehicleMake, chassisNo, address } = form;
      await saveProfile("vehicle", { ownerName, plateNo, vehicleMake, chassisNo, address });
    }
    router.push("/renew/agency");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Vehicle Details" onBack={() => router.back()} />
      <StepTracker current={0} serviceType="vehicle" />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.intro}>Tell us about the vehicle and which papers need renewing.</Text>

        {saved ? <SavedProfileCard label="vehicle details" onApply={applySaved} /> : null}

        <ExtractCard
          kind="vehicle papers"
          serviceType="vehicle"
          onExtract={(data) => setForm((f) => ({ ...f, ...data }))}
        />
        <FieldDivider />

        <Field label="Owner's full name" placeholder="e.g. Adaeze Okonkwo" value={form.ownerName} onChangeText={(v) => setForm({ ...form, ownerName: v })} />
        <Field label="Number plate" placeholder="e.g. LND 442 XA" value={form.plateNo} onChangeText={(v) => setForm({ ...form, plateNo: v.toUpperCase() })} mono autoCapitalize="characters" />
        <Field label="Vehicle make & model" placeholder="e.g. Toyota Camry 2018" value={form.vehicleMake} onChangeText={(v) => setForm({ ...form, vehicleMake: v })} />
        <Field label="Chassis / VIN number" placeholder="e.g. JT2BF22K1W0123456" value={form.chassisNo} onChangeText={(v) => setForm({ ...form, chassisNo: v.toUpperCase() })} mono autoCapitalize="characters" />

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Which papers need renewing? (select all that apply)</Text>
          <View style={{ gap: 8 }}>
            {VEHICLE_PAPER_TYPES.map((pt) => {
              const active = (form.paperTypes || []).includes(pt.key);
              return (
                <Pressable
                  key={pt.key}
                  onPress={() => togglePaperType(pt.key)}
                  style={[styles.paperRow, { backgroundColor: active ? colors.sage : colors.card, borderColor: active ? colors.green700 : colors.fieldBorder }]}
                >
                  <View style={[styles.checkbox, active && styles.checkboxChecked]}>
                    {active ? <Check size={12} color="#fff" /> : null}
                  </View>
                  <View>
                    <Text style={styles.paperLabel}>{pt.label}</Text>
                    <Text style={styles.paperSub}>{pt.sub}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Field label="Delivery address" placeholder="Where should documents be sent?" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} />
        <SaveToggle checked={saveNext} onChange={setSaveNext} />

        <View style={{ marginTop: 8 }}>
          <PrimaryButton onPress={handleContinue} disabled={!valid}>
            Continue
          </PrimaryButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  intro: { fontFamily: fonts.body, color: colors.mute, fontSize: 13, marginBottom: 16 },
  label: { fontFamily: fonts.bodyMedium, color: colors.mute, fontSize: 12, marginBottom: 8 },
  paperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: 12,
  },
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
  paperLabel: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 13 },
  paperSub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11, marginTop: 1 },
});
