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

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // if (!email || !phoneNo || !password) {
    //   Alert.alert("Error", "All fields are required");
    //   return;
    // }

    // try {
    //   const response = await fetch("http://192.168.124.241:3002/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, phoneNo, password }),
    //   });

    //   if (response.ok) {
    //     ToastAndroid.show("User registered successfully", ToastAndroid.LONG);
    //     navigation.navigate("Login");
    //   } else {
    //     const errorData = await response.json();
    //     Alert.alert("Error", errorData.error || "Registration failed.");
    //   }
    // } catch (error) {
    //   Alert.alert("Error", "Unable to connect to the server. Try again later.");
    // }
    navigation.navigate("Verify");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar Icon */}
        {/* <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Image
              source={require("../assets/register.png")}
              style={styles.avatarImage}
            />
          </View>
        </View> */}
        {/* Title and Subtitle */}
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Enter Your Personal Information</Text>
        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#bdbdbd"
            value={phoneNo}
            onChangeText={setPhoneNo}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#bdbdbd"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#bdbdbd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity >
            <Image source={require("../assets/google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity >
            <Image source={require("../assets/face.png")} style={styles.socialIcon} />
          </TouchableOpacity>
         
        </View>

        <View style={{marginTop: 10, alignItems: "center"}}>
          <Text style={{color: "#22223b", fontSize: 18}}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{color: "#1E90FF", fontSize: 18, fontWeight: "bold"}}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 30 },
 
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#22223b",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#8d99ae",
    marginBottom: 25,
    textAlign: "center",
  },
  inputGroup: {
    width: "90%",
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22223b",
    marginBottom: 6,
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 13,
    fontSize: 16,
    color: "#22223b",
    marginBottom: 18,
    // Remove border for a cleaner look
  },
  button: {
    backgroundColor: "#1E90FF",
    width: "90%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    width: "90%",
    alignSelf: "center"
  },
  line: {
    flex: 1,
    height: 1,
    width:50,
    backgroundColor: "#d1d5db",
  },
  orText: {
    marginHorizontal: 10,
    color: "#8d99ae",
    fontWeight: "bold",
    fontSize: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 18,
  },
  socialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e1ea",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    width: 45,
    height:45,
    resizeMode: "contain",
  },
});

export default Register;