import { View, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";

export default function PageLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#222" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
