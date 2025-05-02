import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = "http://192.168.124.74:3002/emergency-contact"; // Adjust if needed

export default function EmergencyContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Load Contacts from AsyncStorage
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem("emergencyContacts");
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  // Save Contacts to AsyncStorage
  const saveContacts = async (newContacts) => {
    try {
      await AsyncStorage.setItem("emergencyContacts", JSON.stringify(newContacts));
    } catch (error) {
      console.error("Error saving contacts:", error);
    }
  };

  // Add Contact to Server & AsyncStorage
  const addContact = async () => {
    console.log("Button Pressed");

    if (!name.trim() || !relation.trim() || !phone.trim()) {
      Alert.alert("Error", "Name, relation, and phone are required.");
      return;
    }

    const newContact = { name, relation, phone, email, priority: 1 };

    try {
      console.log("Sending request to API:", newContact);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });

      const responseText = await response.text();
      console.log("Raw API Response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        Alert.alert("Error", "Invalid server response.");
        return;
      }

      if (response.ok && data?.contact) {
        const updatedContacts = [...contacts, data.contact];
        setContacts(updatedContacts);
        await saveContacts(updatedContacts); // Save locally
        Alert.alert("Success", "Contact added successfully!");
        setName("");
        setRelation("");
        setPhone("");
        setEmail("");
      } else {
        Alert.alert("Error", data.error || "Failed to add contact.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Relation" value={relation} onChangeText={setRelation} />
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <View>
              <Text style={styles.contactName}>{item.name} ({item.relation})</Text>
              <Text style={styles.contactDetails}>📞 {item.phone}</Text>
              {item.email && <Text style={styles.contactDetails}>📧 {item.email}</Text>}
            </View>
            <TouchableOpacity onPress={() => deleteContact(item._id || item.id)}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 20, color: "#DC2626" },
  inputContainer: { marginBottom: 20 },
  input: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 15,
    borderWidth: 1,
    width: "100%",
    padding: 15,
    color: "black",
    borderColor: "#ffffff",
    height: 48,
    borderRadius: 35,
    backgroundColor: "#fafafa",
    marginBottom: 15,
  },
  addButton: { backgroundColor: "#DC2626", padding: 12, borderRadius: 5, alignSelf: "center", width: "50%" },
  addButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold", alignSelf: "center" },
  contactItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  contactName: { fontSize: 18, fontWeight: "bold" },
  contactDetails: { fontSize: 14, color: "#555" },
  homeButton: { 
    marginTop: 20, 
    backgroundColor: "#10B981", 
    padding: 12, 
    borderRadius: 5, 
    alignSelf: "center", 
    width: "50%" 
  },
  homeButtonText: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold", 
    alignSelf: "center" 
  }
});
