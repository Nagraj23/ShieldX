import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const trainingTopics = [
  { id: '1', title: 'Basic First Aid Training' },
  { id: '2', title: 'Self-Defense Techniques' },
  { id: '3', title: 'Fire Safety and Evacuation' },
  { id: '4', title: 'Emergency Response Planning' },
  { id: '5', title: 'CPR Certification' },
];

const Training = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Icon name="school" size={24} color="#1E90FF" style={styles.icon} />
      <Text style={styles.topicText}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training</Text>
      <FlatList
        data={trainingTopics}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1E90FF", marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { marginRight: 15 },
  topicText: { fontSize: 16, color: "#22223b", flex: 1 },
});

export default Training;
