// Design tokens — carried over 1:1 from the web prototype so the
// native build matches it exactly. Change colors/fonts here only.

export const colors = {
  ink: "#132019",
  green900: "#0B3D2E",
  green700: "#125C41",
  green500: "#1F7A54",
  sage: "#DCE9DF",
  sageDeep: "#C4DBC9",
  bone: "#F6F4EE",
  card: "#FFFFFF",
  gold: "#C8932A",
  goldSoft: "#F4E6C6",
  rust: "#B8442C",
  rustSoft: "#F5DCD4",
  mute: "#6E7A72",
  border: "#EAE6D9",
  fieldBorder: "#DDE3D8",
};

// Loaded via @expo-google-fonts/* in app/_layout.js and referenced
// by these keys everywhere in the app — see useFonts() call.
export const fonts = {
  display: "SpaceGrotesk_600SemiBold",
  displayBold: "SpaceGrotesk_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  mono: "IBMPlexMono_600SemiBold",
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = (n) => n * 4;
