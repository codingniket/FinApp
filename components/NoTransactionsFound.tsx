import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NoTransactionsFound = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="receipt-outline" size={48} color="#A1A1AA" />
      <Text style={styles.title}>No Transactions Yet</Text>
      <Text style={styles.subtitle}>
        Start tracking your expenses by adding your first transaction
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    minHeight: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#18181B",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#71717A",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NoTransactionsFound;
