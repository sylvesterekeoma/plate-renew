import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";
import { STEP_LABELS } from "../data/mockData";

export default function StepTracker({ current, serviceType = "license" }) {
  const labels = STEP_LABELS[serviceType];
  return (
    <View style={styles.row}>
      {labels.map((s, i) => (
        <View key={s} style={[styles.bar, { backgroundColor: i <= current ? colors.green900 : colors.sageDeep }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, paddingHorizontal: 20, paddingBottom: 16 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
});
