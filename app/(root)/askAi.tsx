import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/api";

const AI_URL = `${API_URL}/askAi`;

export default function AskAIScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const response = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error or server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask AI</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* Question Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask a finance question..."
          placeholderTextColor="#A1A1AA"
          multiline
        />
        <TouchableOpacity
          style={styles.askButton}
          onPress={handleAsk}
          disabled={loading || !question.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Answer Section */}
      <View style={styles.answerContainer}>
        {loading && <ActivityIndicator size="large" color="#2563EB" />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {answer ? <Text style={styles.answerText}>{answer}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 16,
  },
  headerButton: {
    padding: 4,
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  askButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  answerContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  answerText: {
    fontSize: 16,
    color: "#18181B",
    lineHeight: 22,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 15,
    marginBottom: 8,
  },
});
