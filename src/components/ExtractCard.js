import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, CheckCircle2 } from "lucide-react-native";
import { colors, fonts, radii } from "../theme/tokens";
import { extractDocument } from "../lib/api";

/**
 * Lets the user photograph or pick an expired document and
 * auto-fills the form via extractDocument(). Swap that function's
 * implementation for a real OCR/document-AI call — see the notes
 * in src/lib/api.js.
 */
export default function ExtractCard({ kind, serviceType, onExtract }) {
  const [status, setStatus] = useState("idle"); // idle | reading | done

  const pickAndExtract = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;

    setStatus("reading");
    try {
      const data = await extractDocument(serviceType, result.assets[0].uri);
      onExtract(data);
      setStatus("done");
    } catch (e) {
      setStatus("idle");
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: status === "done" ? colors.sage : colors.card, borderColor: status === "done" ? colors.green700 : "#C9D2CB" },
      ]}
    >
      {status === "idle" && (
        <Pressable onPress={pickAndExtract} style={styles.row}>
          <View style={styles.iconWrap}>
            <Camera size={18} color={colors.green900} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Scan your expired {kind}</Text>
            <Text style={styles.subtitle}>Snap or upload a photo and we'll fill the form for you</Text>
          </View>
          <Upload size={16} color={colors.mute} />
        </Pressable>
      )}
      {status === "reading" && (
        <View style={styles.row}>
          <ActivityIndicator color={colors.green900} />
          <Text style={styles.readingText}>Reading your document…</Text>
        </View>
      )}
      {status === "done" && (
        <Pressable onPress={pickAndExtract} style={styles.row}>
          <CheckCircle2 size={18} color={colors.green900} />
          <Text style={styles.doneText}>Details extracted — check the fields below</Text>
          <Text style={styles.rescan}>Rescan</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.md, borderWidth: 1.5, borderStyle: "dashed", padding: 16, marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.sage, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.display, color: colors.ink, fontSize: 13.5 },
  subtitle: { fontFamily: fonts.body, color: colors.mute, fontSize: 11.5, marginTop: 2 },
  readingText: { fontFamily: fonts.bodyMedium, color: colors.ink, fontSize: 12.5 },
  doneText: { fontFamily: fonts.bodyMedium, color: colors.green900, fontSize: 12.5, flex: 1 },
  rescan: { fontFamily: fonts.bodySemibold, color: colors.green700, fontSize: 11, textDecorationLine: "underline" },
});
