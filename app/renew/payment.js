import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Paystack } from "react-native-paystack-webview";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader, PrimaryButton, Field } from "../../src/components/UI";
import StepTracker from "../../src/components/StepTracker";
import { useRenewal } from "../../src/context/RenewalContext";
import { AGENCIES, GOVT_FEE } from "../../src/data/mockData";
import { submitRenewal, initializePayment, verifyPayment } from "../../src/lib/api";

// Public key only — safe to ship in the app. The secret key must
// only ever live on your backend (see src/lib/api.js).
const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_replace_me";

export default function Payment() {
  const router = useRouter();
  const { serviceType, form, setForm, agencyId, docs, setActiveReference } = useRenewal();
  const [stage, setStage] = useState("idle"); // idle | initializing | paying | verifying | submitting
  const paystackRef = useRef(null);
  const pendingRef = useRef(null);

  const agency = AGENCIES.find((a) => a.id === agencyId);
  const serviceFee = agency?.fee ?? 32500;
  const total = serviceFee + GOVT_FEE;
  const emailValid = /\S+@\S+\.\S+/.test(form.email || "");
  const busy = stage !== "idle";

  const beginPayment = async () => {
    if (!emailValid) return;
    setStage("initializing");
    const { reference } = await initializePayment({ serviceType, form, agencyId, docs, total });
    pendingRef.current = reference;
    setStage("paying");
    paystackRef.current?.startTransaction();
  };

  const onPaystackSuccess = async () => {
    setStage("verifying");
    try {
      const result = await verifyPayment(pendingRef.current);
      if (!result.verified || result.status !== "success") {
        throw new Error("Payment could not be verified");
      }
      setStage("submitting");
      const { reference } = await submitRenewal({ serviceType, form, agencyId, docs });
      setActiveReference(reference);
      router.push("/renew/confirmation");
    } catch (e) {
      Alert.alert("Payment not confirmed", "We couldn't verify that payment. No charge was applied to your renewal — please try again.");
      setStage("idle");
    }
  };

  const onPaystackCancel = () => {
    setStage("idle");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader title="Payment" onBack={() => router.back()} />
      <StepTracker current={3} serviceType={serviceType} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Cost breakdown</Text>
          <Row label="Agency service fee" value={serviceFee} />
          <Row label="FRSC statutory fee" value={GOVT_FEE} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
          </View>
        </View>

        <Field
          label="Email (for your payment receipt)"
          placeholder="you@example.com"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.paymentMethod}>
          <ShieldCheck size={19} color={colors.green900} />
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>Card, bank transfer, or USSD</Text>
            <Text style={styles.methodSub}>Handled securely by Paystack</Text>
          </View>
          <CheckCircle2 size={18} color={colors.green900} />
        </View>

        <View style={styles.escrowNote}>
          <AlertTriangle size={14} color={colors.green900} />
          <Text style={styles.escrowText}>
            Your payment is verified before your renewal is submitted, and held until your renewed papers are
            confirmed delivered before the agency is paid out.
          </Text>
        </View>

        <PrimaryButton onPress={beginPayment} disabled={!emailValid || busy} loading={busy} icon={Lock}>
          {stageLabel(stage, total)}
        </PrimaryButton>

        {/* Invisible driver for the Paystack checkout sheet — startTransaction()
            opens it as a modal WebView; nothing renders here directly. */}
        <Paystack
          ref={paystackRef}
          paystackKey={PAYSTACK_PUBLIC_KEY}
          amount={total}
          billingEmail={form.email || "renewal@platerenew.app"}
          currency="NGN"
          onCancel={onPaystackCancel}
          onSuccess={onPaystackSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function stageLabel(stage, total) {
  switch (stage) {
    case "initializing":
      return "Preparing checkout…";
    case "paying":
      return "Waiting for payment…";
    case "verifying":
      return "Verifying payment…";
    case "submitting":
      return "Submitting renewal…";
    default:
      return `Pay ₦${total.toLocaleString()} securely`;
  }
}

function Row({ label, value }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ fontFamily: fonts.body, color: colors.mute, fontSize: 12.5 }}>{label}</Text>
      <Text style={{ fontFamily: fonts.mono, color: colors.ink, fontSize: 12.5 }}>₦{value.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  breakdown: { borderRadius: radii.md, backgroundColor: colors.card, padding: 16, marginBottom: 20 },
  breakdownTitle: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5, marginBottom: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 12, marginTop: 8, borderTopWidth: 1, borderTopColor: "#F0EDE3" },
  totalLabel: { fontFamily: fonts.display, color: colors.ink, fontSize: 14 },
  totalValue: { fontFamily: fonts.mono, color: colors.green900, fontSize: 15, fontWeight: "700" },
  payWithLabel: { fontFamily: fonts.bodyMedium, color: colors.mute, fontSize: 12, marginBottom: 8 },
  paymentMethod: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.green900, padding: 16, marginBottom: 20 },
  methodTitle: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 13 },
  methodSub: { fontFamily: fonts.body, color: colors.mute, fontSize: 11 },
  escrowNote: { flexDirection: "row", gap: 8, backgroundColor: colors.sage, borderRadius: radii.sm, padding: 12, marginBottom: 24 },
  escrowText: { flex: 1, fontFamily: fonts.body, color: colors.green900, fontSize: 11.5, lineHeight: 16 },
});
