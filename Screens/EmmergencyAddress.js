import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { AI_URL , AUTH_URL } from '../constants/api';

export default function EmergencyAddress({ navigation }) {
  const [addressType, setAddressType] = useState("Home");
  const [address, setAddress] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addressOptions = [
    { label: "Home", value: "Home" },
    { label: "Office", value: "Office" },
    { label: "Other", value: "Other" },
    { label: "Friend", value: "Friend" },
  ];

  const saveAddress = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Please enter a valid address");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        Alert.alert("Authentication Error", "Please login again");
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://shieldx-auth.onrender.com/emergency/address', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressType,
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Address saved successfully!");
        setAddress("");
        setAddressType("Home");
      } else {
        throw new Error(data.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Save address error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inner}>
          <Text style={styles.title}>Emergency Address</Text>

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "#1E90FF" }]}
            data={addressOptions}
            labelField="label"
            valueField="value"
            value={addressType}
            onChange={(item) => setAddressType(item.value)}
            placeholder={!isFocus ? "Select Address Type" : "..."}
            selectedTextStyle={styles.selectedText}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            disable={isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={address}
            onChangeText={setAddress}
            editable={!isLoading}
            multiline
          />

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={saveAddress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Address</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Security")}
          >
            <Text style={styles.homeButtonText}>🏠 Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#1E90FF",
  },
  dropdown: {
    borderWidth: 1,
    padding: 15,
    borderColor: "#ddd",
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 30,
    alignSelf: "center",
    width: "80%",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  homeButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 30,
    alignSelf: "center",
    width: "80%",
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
