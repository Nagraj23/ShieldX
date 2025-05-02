
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ToastAndroid,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";


export default function Profile() {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !phoneNo || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://192.168.124.69:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phoneNo, password }),
      });

      if (response.ok) {
        ToastAndroid.show("User registered successfully", ToastAndroid.LONG);
        console.log("User account created & signed in!");
        navigation.navigate("Login");
      } else {
        const errorData = await response.json();
        console.log(errorData)
        Alert.alert("Error", errorData.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      Alert.alert("Error", "Unable to connect to the server. Try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={{ flexDirection: "column", marginBottom: 20 }}>
            <Text style={styles.name}>Welcome to</Text>
            <Text style={styles.name}>ShieldX - Safety Guard</Text>
          </View>
          <View style={styles.inp}>
            <TextInput
              style={styles.user}
              placeholder="Enter your Email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.user}
              placeholder="Enter your Phone Number"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              value={phoneNo}
              onChangeText={setPhoneNo}
            />
            <TextInput
              style={styles.user}
              placeholder="Enter your Password"
              secureTextEntry
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.user}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#ccc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>───── Or Sign up with ─────</Text>
          <View style={styles.socials}>
            <Image source={require("../assets/google.png")} style={styles.icon} />
            <Image source={require("../assets/face.png")} style={styles.icon} />
          </View>
          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Login")} activeOpacity={0.8}>
            <Text style={styles.signupText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  card: { width: "95%", alignItems: "center" },
  name: { fontSize: 22, fontWeight: "bold" },
  inp: { width: "85%" },
  user: {
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
  button: {
    backgroundColor: "#F72585",
    width: "85%",
    padding: 15,
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  signupButton: { width: "85%", padding: 15, alignItems: "center" },
  signupText: { fontWeight: "bold", fontSize: 16, marginTop: 10 },
  icon: { width: 45, height: 45, marginRight: 10 },
  socials: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 15 },
});