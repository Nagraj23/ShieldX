import React, { useRef, useState ,useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { AI_URL , AUTH_URL } from '../constants/api';

const OTP = ({ route, navigation }) => {
  const { email } = route.params; // Get email passed from previous screen
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, idx) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < 4) inputs[idx + 1].current.focus();
      if (!text && idx > 0) inputs[idx - 1].current.focus();
    }
  };

  useEffect(()=>{
  console.log("email :",email)
  },[])

  const handleVerify = async () => {
    const fullOtp = otp.join("");

    if (fullOtp.length !== 5) {
      Alert.alert("Validation Error", "Please enter all 5 digits of the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.145.21:3001/auth/forgot/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerified(true);
        Alert.alert("Success", "OTP verified successfully!");
        navigation.navigate("Reset", { email  ,otp: fullOtp}); // Pass email to Reset screen
      } else {
        Alert.alert("Error", data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
        style={[styles.button, loading && { backgroundColor: "#999" }]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : verified ? "Verified ✅" : "Verify"}
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
    paddingTop: 20,
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
