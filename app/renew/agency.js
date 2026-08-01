import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Building2, ShieldCheck, MapPin, Star, CheckCircle2, Circle } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader, PrimaryButton } from "../../src/components/UI";
import StepTracker from "../../src/components/StepTracker";
import { useRenewal } from "../../src/context/RenewalContext";
import { AGENCIES } from "../../src/data/mockData";

export default function Agency() {
  const router = useRouter();
  const { serviceType, agencyId, setAgencyId } = useRenewal();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Choose Agency" onBack={() => router.back()} />
      <StepTracker current={1} serviceType={serviceType} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.intro}>Pick a verified partner agency to process your renewal with FRSC.</Text>

        <View style={{ gap: 12 }}>
          {AGENCIES.map((a) => {
            const selected = agencyId === a.id;
            return (
              <Pressable key={a.id} onPress={() => setAgencyId(a.id)} style={[styles.card, { borderColor: selected ? colors.green900 : colors.border }]}>
                <View style={styles.cardTop}>
                  <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
                    <View style={styles.icon}>
                      <Building2 size={17} color={colors.green900} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.name}>{a.name}</Text>
                        {a.verified && <ShieldCheck size={13} color={colors.green700} />}
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <MapPin size={11} color={colors.mute} />
                        <Text style={styles.area}>{a.area}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Star size={11} color={colors.gold} fill={colors.gold} />
                          <Text style={styles.rating}>{a.rating}</Text>
                        </View>
                        <Text style={styles.turnaround}>{a.turnaround}</Text>
                      </View>
                    </View>
                  </View>
                  {selected ? <CheckCircle2 size={19} color={colors.green900} /> : <Circle size={19} color="#D6DED8" />}
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.feeLabel}>Service fee</Text>
                  <Text style={styles.feeValue}>₦{a.fee.toLocaleString()}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton onPress={() => router.push("/renew/documents")} disabled={!agencyId}>
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
  card: { borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1.5, padding: 16 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  name: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  area: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5 },
  rating: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 11.5 },
  turnaround: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F0EDE3" },
  feeLabel: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5 },
  feeValue: { fontFamily: fonts.mono, color: colors.ink, fontSize: 13 },
});
