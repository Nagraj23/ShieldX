import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
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

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // if (!email.trim() || !password.trim()) {
    //   Alert.alert("Error", "Email and Password fields cannot be empty");
    //   return;
    // }

    // try {
    //   const response = await fetch("http://192.168.124.241:3002/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();
    //   // console.log(data)

    //   if (response.ok) {
    //     const { token, userData } = data;

    //     // Store token and login status
    //     await AsyncStorage.setItem("authToken", token);
    //     await AsyncStorage.setItem("userDetails", JSON.stringify(userData));
    //     await AsyncStorage.setItem("isLoggedin", "true");
    //     console.log(AsyncStorage.getItem("authToken"));
    //     ToastAndroid.show("Login successful", ToastAndroid.LONG);

    //     // Navigate to Home
    //     navigation.replace("Home");
    //   } else {
    //     Alert.alert("Login Failed", data.error || "Invalid email or password");
    //   }
    // } catch (error) {
    //   console.log(error.message);
    //   Alert.alert("Login Failed", "Unable to connect. Please try again.");
    // }
    navigation.navigate("MainTabs");
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
          <View style={{ flexDirection: "column", marginBottom: 20 }}>
            <Image
              source={require("../assets/login.png")}
              style={{ width: 380, height: 380, resizeMode: "contain" }}
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

          <TouchableOpacity activeOpacity={0.9} onPress={()=>navigation.navigate('Email')}>
            <Text
              style={{
                fontSize:18,
                color: "blue",
                marginBottom: 20,
                alignSelf: "flex-end",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.9}
          >
            <Text style={styles.signupText}> don't have Account ? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  name: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "notoserif",
  },
  inp: {
    width: "85%",
  },
  user: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android Shadow
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
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 35,
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
  icon: {
    width: 45,
    height: 45,
    marginRight: 10,
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
});
