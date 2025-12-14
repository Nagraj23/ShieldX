import React, { useState,useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AI_URL , AUTH_URL } from '../constants/api';

const ResetPassword = ({ route, navigation }) => {
  const { email, otp: otp } = route.params; // Get email passed from OTP screen
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(()=>{
  console.log("email :",email)
  console.log("otp ",otp)
  },[])

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }


    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.145.21:3001/auth/forgot/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,  otp: otp,newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password has been reset!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Account recovered successfully</Text>

      <Text style={styles.label}>Enter New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        placeholderTextColor="#999"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#999" }]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
