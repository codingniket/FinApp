import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Summary {
  balance: number;
  income: number;
  expenses: number;
}

interface BalanceCardProps {
  summary: Summary;
}

const BalanceCard = ({ summary }: BalanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return `${amount < 0 ? "-" : ""}$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <View style={styles.balanceCard}>
      {/* Robot Icon Button */}
      <TouchableOpacity
        style={styles.robotButton}
        onPress={() => router.push("/askAi")}
        accessibilityLabel="Ask AI"
      >
        <Ionicons name="chatbubbles-outline" size={28} color="#64748B" />
      </TouchableOpacity>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>
        {formatCurrency(summary.balance)}
      </Text>

      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, styles.incomeColor]}>
            +{formatCurrency(summary.income)}
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, styles.expenseColor]}>
            {formatCurrency(-Math.abs(summary.expenses))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 24,
    letterSpacing: -1,
  },
  balanceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceStatItem: {
    flex: 1,
  },
  balanceStatLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  balanceStatAmount: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  incomeColor: {
    color: "#10B981",
  },
  expenseColor: {
    color: "#EF4444",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
  },
  robotButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
});

export default BalanceCard;
