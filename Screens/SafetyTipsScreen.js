import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SafetyTipsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Safety Tips Screen</Text>
  </View>
);

export default SafetyTipsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});