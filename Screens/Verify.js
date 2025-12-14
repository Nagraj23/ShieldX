import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  Alert,
} from "react-native";
import { AUTH_URL } from "../constants/api";

const Verify = ({ navigation, route }) => {
  const { phoneNo } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const inputs = Array(6).fill().map(() => useRef());

  const handleChange = (text, idx) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);

      if (text && idx < 5) {
        inputs[idx + 1].current.focus();
      } else if (!text && idx > 0) {
        inputs[idx - 1].current.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      Alert.alert("Error", "Please enter all 6 digits of the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://shieldx-auth.onrender.com/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNo, otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok && data.message?.includes("verified")) {
        ToastAndroid.show("Phone verified ✅", ToastAndroid.SHORT);
        setVerified(true);
        navigation.replace("Login");
      } else {
        Alert.alert("Invalid OTP", data.message || "Try again");
      }
    } catch (err) {
      console.error("❌ OTP Verify Error:", err.message);
      Alert.alert("Error", "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch(`${AUTH_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNo }),
      });

      const data = await res.json();
      if (res.ok && data.message?.includes("OTP")) {
        ToastAndroid.show("OTP resent to your phone 📱", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", data.message || "Resend failed");
      }
    } catch (err) {
      console.error("❌ Resend OTP error:", err.message);
      Alert.alert("Error", "Couldn't resend OTP. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/verify.png")}
        style={{ width: 380, height: 300, resizeMode: "contain" }}
      />

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to +91-{phoneNo}
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
        style={[styles.button, loading && { backgroundColor: "#888" }]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={resending}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.resendText}>
          {resending ? "Resending..." : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      {verified && (
        <Text style={styles.successText}>Account verified successfully! ✅</Text>
      )}
    </View>
  );
};

export default Verify;

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
  resendText: {
    textAlign: "center",
    color: "#1E90FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  successText: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});
