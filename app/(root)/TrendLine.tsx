import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useLast10Transactions } from "@/hooks/useTransactions";

const screenWidth = Dimensions.get("window").width;

type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: string;
  created_at: string;
};

function getChartData(transactions: Transaction[]) {
  // Sort by created_at ascending for left-to-right chart
  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const labels: string[] = sorted.map((tx) => {
    const d = new Date(tx.created_at);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const income: number[] = [];
  const expense: number[] = [];
  const balance: number[] = [];
  let runningBalance = 0;
  sorted.forEach((tx) => {
    const amt = parseFloat(tx.amount);
    if (amt > 0) {
      income.push(amt);
      expense.push(0);
    } else {
      income.push(0);
      expense.push(Math.abs(amt));
    }
    runningBalance += amt;
    balance.push(runningBalance);
  });
  return { labels, income, expense, balance };
}

interface TrendLineProps {
  loadData?: () => void;
}

const TrendLine: React.FC<TrendLineProps> = ({ loadData }) => {
  const router = useRouter();
  const { user } = useUser();
  const { transactions, isLoading, refetch } = useLast10Transactions(user?.id);
  const [selected, setSelected] = useState<"income" | "expense" | "balance">(
    "balance"
  );
  const chartData = useMemo(
    () => getChartData(transactions as Transaction[]),
    [transactions]
  );

  const getDataset = () => {
    if (selected === "income") return chartData.income;
    if (selected === "expense") return chartData.expense;
    return chartData.balance;
  };
  const getColor = () => {
    if (selected === "income") return "#22c55e";
    if (selected === "expense") return "#ef4444";
    return "#2563eb";
  };
  const getLabel = () => {
    if (selected === "income") return "Income";
    if (selected === "expense") return "Expenses";
    return "Balance";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trend (Last 10)</Text>
        <TouchableOpacity onPress={refetch} style={styles.headerButton}>
          <Ionicons name="refresh" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {isLoading ? (
          <Text style={{ marginTop: 60 }}>Loading...</Text>
        ) : transactions.length === 0 ? (
          <Text style={{ marginTop: 60 }}>No transactions found.</Text>
        ) : (
          <>
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: getDataset(),
                    color: () => getColor(),
                  },
                ],
              }}
              width={screenWidth - 32}
              height={260}
              yAxisLabel={"$"}
              yAxisSuffix={""}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => getColor(),
                labelColor: (opacity = 1) => `rgba(100,116,139,${opacity})`,
                propsForBackgroundLines: {
                  stroke: "#E2E8F0",
                },
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: getColor(),
                },
              }}
              bezier
              style={styles.chart}
            />
            <Text style={styles.graphLabel}>{getLabel()}</Text>
          </>
        )}
      </View>
      {/* Bottom Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selected === "income" && styles.activeButton,
          ]}
          onPress={() => setSelected("income")}
        >
          <Text
            style={[
              styles.buttonText,
              selected === "income" && styles.activeButtonText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selected === "expense" && styles.activeButton,
          ]}
          onPress={() => setSelected("expense")}
        >
          <Text
            style={[
              styles.buttonText,
              selected === "expense" && styles.activeButtonText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            selected === "balance" && styles.activeButton,
          ]}
          onPress={() => setSelected("balance")}
        >
          <Text
            style={[
              styles.buttonText,
              selected === "balance" && styles.activeButtonText,
            ]}
          >
            Balance
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  graphLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#2563eb",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  switchButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#2563eb",
  },
  buttonText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
});

export default TrendLine;
