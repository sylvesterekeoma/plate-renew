import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts } from "../../src/theme/tokens";
import { ScreenHeader, Field, FieldDivider, PrimaryButton, SavedProfileCard, SaveToggle } from "../../src/components/UI";
import StepTracker from "../../src/components/StepTracker";
import ExtractCard from "../../src/components/ExtractCard";
import { useRenewal } from "../../src/context/RenewalContext";
import { getSavedProfile, saveProfile } from "../../src/lib/savedProfile";

export default function LicenseDetails() {
  const router = useRouter();
  const { form, setForm } = useRenewal();
  const valid = form.licenseNo && form.fullName && form.state;
  const [saved, setSaved] = useState(null);
  const [saveNext, setSaveNext] = useState(true);

  useEffect(() => {
    getSavedProfile("license").then(setSaved);
  }, []);

  const applySaved = () => setForm((f) => ({ ...f, ...saved }));

  const handleContinue = async () => {
    if (saveNext) {
      const { fullName, licenseNo, state, licenseClass, address } = form;
      await saveProfile("license", { fullName, licenseNo, state, licenseClass, address });
    }
    router.push("/renew/agency");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="License Details" onBack={() => router.back()} />
      <StepTracker current={0} serviceType="license" />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.intro}>Tell us who's renewing and which license this is for.</Text>

        {saved ? <SavedProfileCard label="license details" onApply={applySaved} /> : null}

        <ExtractCard
          kind="driver's license"
          serviceType="license"
          onExtract={(data) => setForm((f) => ({ ...f, ...data }))}
        />
        <FieldDivider />

        <Field label="Full name (as on license)" placeholder="e.g. Adaeze Okonkwo" value={form.fullName} onChangeText={(v) => setForm({ ...form, fullName: v })} />
        <Field label="Existing license number" placeholder="AAB012345678" value={form.licenseNo} onChangeText={(v) => setForm({ ...form, licenseNo: v.toUpperCase() })} mono autoCapitalize="characters" />
        <Field label="Issuing state" placeholder="e.g. Lagos" value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
        <Field label="License class" placeholder="e.g. B (private vehicle)" value={form.licenseClass} onChangeText={(v) => setForm({ ...form, licenseClass: v })} />
        <Field label="Delivery address" placeholder="Where should the new card be sent?" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} />
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
});
