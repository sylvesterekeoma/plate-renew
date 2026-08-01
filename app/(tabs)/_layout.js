import React from "react";
import { Tabs } from "expo-router";
import { Home, FileText, Clock, User } from "lucide-react-native";
import { colors, fonts } from "../../src/theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green900,
        tabBarInactiveTintColor: "#A8B3AC",
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 10 },
        tabBarStyle: { borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen
        name="renewals"
        options={{ title: "Renewals", tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }}
      />
      <Tabs.Screen name="track" options={{ title: "Track", tabBarIcon: ({ color, size }) => <Clock color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} />
    </Tabs>
  );
}
