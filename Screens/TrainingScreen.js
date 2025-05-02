import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TrainingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Training Screen</Text>
  </View>
);

export default TrainingScreen;

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