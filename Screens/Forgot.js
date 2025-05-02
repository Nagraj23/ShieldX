import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const Forgot = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, idx) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < 4) {
        inputs[idx + 1].current.focus();
      }
      if (!text && idx > 0) {
        inputs[idx - 1].current.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "column",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/forgot.png")}
          style={{ width: 280, height: 280, resizeMode: "contain" }}
        />
      </View>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter the 5-digit code sent to your email.
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, idx)}
            placeholder="-"
            placeholderTextColor="#bbb"
            autoFocus={idx === 0}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Verify")}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 90,
    // top:60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginHorizontal: 10,
  },
  otpInput: {
    width: 48,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    color: "#333",
    backgroundColor: "#f6f7fb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    color: "#1E90FF",
    fontSize: 20,
    textAlign: "center",
  },
});
