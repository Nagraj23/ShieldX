import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AI_URL , AUTH_URL } from '../constants/api';

const Email = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }

    // Check if the email format is valid
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.145.21:3001/auth/forgot/send-otp', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message || "OTP sent to your email.");
        navigation.navigate("OTP", { email });
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while sending OTP. Please try again.");
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>Enter your email address to receive an OTP for verification.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        placeholderTextColor="#bdbdbd"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Email;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7e9fc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#e0e1ea",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f6f7fb",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  link: {
    color: "#1E90FF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});
