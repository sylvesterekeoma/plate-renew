import React, { useRef, useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput,
  Pressable, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Send, Headset } from "lucide-react-native";
import { colors, fonts, radii } from "../../src/theme/tokens";
import { ScreenHeader } from "../../src/components/UI";
import { sendSupportMessage } from "../../src/lib/api";

const INITIAL_MESSAGES = [
  {
    id: "m1",
    from: "agent",
    text: "Hi, I'm Chidinma from PlateRenew support. How can I help with your renewal today?",
  },
];

// Auto-replies stand in for a real agent/chatbot backend — see
// sendSupportMessage() in src/lib/api.js for where this gets
// wired to a real live-chat provider.
const CANNED_REPLIES = [
  "Got it — let me check that for you. Could you share your tracking reference if you have one (looks like PR-XXXX-XXX)?",
  "Thanks, I can see that. A member of the team will follow up on this within the hour.",
  "That's a good question — I'll flag it to the relevant agency and update you here as soon as I hear back.",
];

export default function SupportChat() {
  const router = useRouter();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const replyIndex = useRef(0);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg = { id: "u" + Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    scrollRef.current?.scrollToEnd({ animated: true });

    await sendSupportMessage(text);

    const reply = CANNED_REPLIES[replyIndex.current % CANNED_REPLIES.length];
    replyIndex.current += 1;
    setMessages((prev) => [...prev, { id: "a" + Date.now(), from: "agent", text: reply }]);
    setSending(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <ScreenHeader
        title="Live Chat"
        onBack={() => router.back()}
        right={
          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Agents online</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.body}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {sending && (
            <View style={[styles.bubbleRow, { justifyContent: "flex-start" }]}>
              <AgentAvatar />
              <View style={[styles.bubble, styles.agentBubble]}>
                <Text style={styles.typingText}>Typing…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message…"
            placeholderTextColor="#9AA79E"
            style={styles.input}
            multiline
          />
          <Pressable onPress={send} disabled={!input.trim()} style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}>
            <Send size={17} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AgentAvatar() {
  return (
    <View style={styles.avatar}>
      <Headset size={14} color={colors.green900} />
    </View>
  );
}

function MessageBubble({ message }) {
  const isAgent = message.from === "agent";
  return (
    <View style={[styles.bubbleRow, { justifyContent: isAgent ? "flex-start" : "flex-end" }]}>
      {isAgent && <AgentAvatar />}
      <View style={[styles.bubble, isAgent ? styles.agentBubble : styles.userBubble]}>
        <Text style={isAgent ? styles.agentText : styles.userText}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusPill: { flexDirection: "row", alignItems: "center", gap: 6, marginRight: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#3DA35D" },
  statusText: { fontFamily: fonts.body, color: colors.mute, fontSize: 11 },
  body: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  avatar: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.sage,
    alignItems: "center", justifyContent: "center", marginBottom: 2,
  },
  bubble: { maxWidth: "78%", borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: 10 },
  agentBubble: { backgroundColor: colors.card, borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: colors.green900, borderTopRightRadius: 4 },
  agentText: { fontFamily: fonts.body, color: colors.ink, fontSize: 13.5, lineHeight: 19 },
  userText: { fontFamily: fonts.body, color: "#fff", fontSize: 13.5, lineHeight: 19 },
  typingText: { fontFamily: fonts.body, color: colors.mute, fontSize: 13, fontStyle: "italic" },
  inputRow: {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#EAE6D9",
    backgroundColor: colors.bone,
  },
  input: {
    flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: "#DDE3D8",
    paddingHorizontal: 14, paddingVertical: 10, fontFamily: fonts.body, color: colors.ink, fontSize: 13.5,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green900,
    alignItems: "center", justifyContent: "center",
  },
});
