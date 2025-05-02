import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from "react-native";

const OTP = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
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

  const handleVerify = () => {
   navigation.navigate("Reset");
  };

  return (
    <View style={styles.container}>
         <View style={{ flexDirection: "column", marginBottom: 20 }}>
            <Image
              source={require("../assets/verify.png")}
              style={{ width: 380, height: 380, resizeMode: "contain" }}
            />
          </View>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the 5-digit code sent to your email</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChange(text, idx)}
            placeholder="-"
            placeholderTextColor="#bbb"
            autoFocus={idx === 0}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, verified && { backgroundColor: "#999" }]}
        onPress={handleVerify}
        disabled={verified}
      >
        <Text style={styles.buttonText}>
          {verified ? "Verified ✅" : "Verify"}
        </Text>
      </TouchableOpacity>
      {verified && (
        <Text style={styles.successText}>Account verified successfully!</Text>
      )}
    </View>
  );
};

export default OTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20, // Add this line to reduce top space
      },
  title: {
    fontSize: 26,
    color: "#1E90FF",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#8d99ae",
    marginBottom: 30,
    textAlign: "center",
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
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  successText: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});