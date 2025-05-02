import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SafetyTips = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tips</Text>
      <Text style={styles.text}>This is a placeholder for Safety Tips screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1E90FF", marginBottom: 10 },
  text: { fontSize: 18, color: "#22223b" }
});

export default SafetyTips;