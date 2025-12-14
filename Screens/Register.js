import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ToastAndroid,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import Feather from 'react-native-vector-icons/Feather';

import { AUTH_URL } from '../constants/api';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNo = (phoneNo) => phoneNo.length === 10 && /^\d+$/.test(phoneNo);

const Register = ({ navigation, setIsSignUp }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name) { newErrors.name = "Name is required."; isValid = false; }
    if (!formData.email || !validateEmail(formData.email)) { newErrors.email = "A valid email is required."; isValid = false; }
    if (!formData.phoneNo || !validatePhoneNo(formData.phoneNo)) { newErrors.phoneNo = "Phone number must be 10 digits."; isValid = false; }
    if (!formData.password || formData.password.length < 6) { newErrors.password = "Password must be at least 6 characters."; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      ToastAndroid.show("Please fix the errors in the form.", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        ToastAndroid.show("OTP sent to your email! Verifying...", ToastAndroid.LONG);
        navigation.navigate("Verify", {
          email: formData.email,
          phoneNo: formData.phoneNo
        });
      } else {
        Alert.alert("Registration Failed", data.message || "Check your network and try again.");
      }
    } catch (error) {
      console.error("Registration error:", error.message);
      Alert.alert("Connection Error", "Unable to connect to the server. Check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (key, iconName, placeholder, keyboardType, secureTextEntry = false) => (
    <View style={styles.inputContainer}>
      <Feather name={iconName} size={20} color={errors[key] ? '#E74C3C' : '#8d99ae'} style={styles.icon}/>
      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#8d99ae"
        value={formData[key]}
        onChangeText={(value) => handleChange(key, value)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContent}>
          <Image
            source={require('../assets/shieldx_logo.png')} // logo here
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start protecting your world with ShieldX</Text>

          <View style={styles.inputGroup}>
            {renderInput("name", "user", "Full Name", "default")}
            {renderInput("email", "mail", "Email Address", "email-address")}
            {renderInput("phoneNo", "phone", "Phone Number", "phone-pad")}
            {renderInput("password", "lock", "Password (min 6 chars)", "default", true)}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isLoading}
            onPress={handleRegister}
            style={[styles.button, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(false)}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  innerContent: {
    marginTop: 40,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#22223b",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8d99ae",
    marginBottom: 35,
    textAlign: "center",
    lineHeight: 22,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 45,
    fontSize: 16,
    color: "#22223b",
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    position: 'absolute',
    top: 17,
    left: 15,
    zIndex: 1,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
  button: {
    backgroundColor: "#1E90FF", // solid color
    width: "100%",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#7FC2FF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 25,
    padding: 5,
  },
  loginLinkText: {
    color: "#8d99ae",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  loginLinkHighlight: {
    color: "#1E90FF",
    fontWeight: 'bold',
  },
});

export default Register;
