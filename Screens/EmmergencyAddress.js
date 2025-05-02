import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://192.168.124.74:3002/emergency-address";

export default function EmergencyAddress() {
  const [addressType, setAddressType] = useState("Home");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [userId, setUserId] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  const addressOptions = [
    { label: "Home", value: "Home" },
    { label: "Office", value: "Office" },
    { label: "Other", value: "Other" },
    { label: "Friend", value: "Friend" },
  ];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userDetails");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.id);
        } else {
          console.log("No user details found");
          navigation.navigate("login");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        navigation.navigate("login");
      }
    };

    const getStoredAddress = async () => {
      try {
        const savedAddress = await AsyncStorage.getItem("emergencyAddress");
        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress);
          setAddress(parsedAddress.address);
          setLatitude(parsedAddress.latitude);
          setLongitude(parsedAddress.longitude);
          setAddressType(parsedAddress.addressType);
        }
      } catch (error) {
        console.error("Error retrieving stored address:", error);
      }
    };

    getUserData();
    getStoredAddress();
  }, []);

  const saveAddress = async () => {
    if (!address.trim() || !latitude.trim() || !longitude.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    const newAddress = {
      userId,
      addressType,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      console.log("Sending request to API:", newAddress);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        Alert.alert("Error", "Invalid server response.");
        return;
      }

      if (response.ok) {
        await AsyncStorage.setItem("emergencyAddress", JSON.stringify(newAddress));
        Alert.alert("Success", "Address saved successfully!");
      } else {
        Alert.alert("Error", data.error || "Failed to save address.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Address</Text>
      <Dropdown
        data={addressOptions}
        labelField="label"
        valueField="value"
        value={addressType}
        onChange={(item) => setAddressType(item.value)}
        style={[styles.dropdown, isFocus && { borderColor: "#DC2626" }]}
        placeholder={!isFocus ? "Select Address Type" : "..."}
        selectedTextStyle={styles.selectedText}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <TextInput style={styles.input} placeholder="Enter Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Enter Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Enter Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
      <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate("EmergencyContacts")}>
        <Text style={styles.contactButtonText}>Emergency Contacts</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ededec", padding: 25 },
  title: { fontSize: 30, fontWeight: "bold", textAlign: "center", marginVertical: 40, color: "#DC2626" },
  dropdown: { borderWidth: 1, fontSize: 22, width: "100%", padding: 15, borderColor: "#ffffff", height: 48, borderRadius: 35, backgroundColor: "#fafafa", marginBottom: 15 },
  selectedText: { fontSize: 16, color: "#000" },
  input: { fontSize: 18, height: 50, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 15, backgroundColor: "#fafafa" },
  saveButton: { backgroundColor: "#DC2626", padding: 12, borderRadius: 10, alignItems: "center", width: "50%", alignSelf: "center", marginVertical: 10 },
  saveButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  contactButton: { backgroundColor: "#1D4ED8", padding: 12, borderRadius: 10, alignItems: "center", width: "60%", alignSelf: "center", marginTop: 10 },
  contactButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
