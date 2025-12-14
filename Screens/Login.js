import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "./Checkbox";
import { AUTH_URL } from '../constants/api';

export default function Login({ navigation,setIsSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      const savedPassword = await AsyncStorage.getItem("savedPassword");
      const savedRememberMe = await AsyncStorage.getItem("rememberMe");

      if (savedRememberMe === "true") {
        setEmail(savedEmail || "");
        setPassword(savedPassword || "");
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);



  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and Password fields cannot be empty");
      return;
    }

    try {
      const response = await fetch('http://192.168.145.21:3001/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login API Response Data:", data);

      if (response.ok) {
        // --- FIX START ---
        // Destructure both accessToken and refreshToken from the response data.
        // Assuming your backend /auth/login endpoint sends refreshToken.
        const { accessToken, refreshToken, userData } = data;

        if (!accessToken) {
          Alert.alert("Login Failed", "Access token missing in response");
          return;
        }

        // Store both accessToken and refreshToken in AsyncStorage
        await AsyncStorage.setItem("accessToken", accessToken);
        if (refreshToken) { // Only save if refreshToken is provided by the backend
          await AsyncStorage.setItem("refreshToken", refreshToken);
        }
        // --- FIX END ---

        if (userData) {
          await AsyncStorage.setItem("userDetails", JSON.stringify(userData));
          if (userData?.id) {
            await AsyncStorage.setItem("userId", userData.id);
            console.log("User ID Stored:", userData.id);
          } else {
            console.warn("❌ No user ID found in userData:", userData);
          }
          console.log("User Data Stored:", userData);
        }
        await AsyncStorage.setItem("isLoggedin", "true");

        const emailToSave = userData?.email || email;
        console.log('Saving email to AsyncStorage:', emailToSave);
        await AsyncStorage.setItem("savedEmail", emailToSave);

        if (rememberMe) {
          await AsyncStorage.setItem("savedPassword", password);
          await AsyncStorage.setItem("rememberMe", "true");
        } else {
          await AsyncStorage.removeItem("savedEmail");
          await AsyncStorage.removeItem("savedPassword");
          await AsyncStorage.setItem("rememberMe", "false");
        }

        // Log the tokens from AsyncStorage after saving for debugging
        console.log("Access Token from AsyncStorage after save:", await AsyncStorage.getItem("accessToken"));
        console.log("Refresh Token from AsyncStorage after save:", await AsyncStorage.getItem("refreshToken")); // Added for debugging

        ToastAndroid.show("Login successful", ToastAndroid.LONG);

        navigation.navigate("Initial");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      Alert.alert("Login Failed", "Unable to connect. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/login.png")}
              style={styles.loginImage}
            />
          </View>

          <View style={styles.inp}>
            <TextInput
              style={styles.user}
              placeholder="Email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.user}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <View style={styles.rememberMeContainer}>
            <Checkbox
              value={rememberMe}
              onValueChange={(newValue) => setRememberMe(newValue)}
              label="Remember Me"
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Email")}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

         <TouchableOpacity
           onPress={() => setIsSignUp(true)}
         >
           <Text>Don't have an account? Register</Text>
         </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "95%",
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "column",
    marginBottom: 20,
    marginTop: -50,
  },
  loginImage: {
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
  inp: {
    width: "85%",
  },
  user: {
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
    backgroundColor: "#1E90FF",
    width: "85%",
    padding: 15,
    borderRadius: 35,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 22,
  },
  signupButton: {
    backgroundColor: "transparent",
    width: "85%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  signupText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 10,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  forgotPasswordText: {
    fontSize: 18,
    color: "blue",
    marginBottom: 20,
    alignSelf: "flex-end",
  },
});