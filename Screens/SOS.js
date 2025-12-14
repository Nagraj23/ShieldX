"use client";

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {AI_URL}  from "../constants/api";

export default function SOS() {
  const outer = useRef(new Animated.Value(1)).current;
  const middle = useRef(new Animated.Value(1)).current;
  const inner = useRef(new Animated.Value(1)).current;

  const [countdown, setCountdown] = useState(5);
  const [sound, setSound] = useState(null);

  const countdownRef = useRef(null);
  const navigation = useNavigation();
  const API_URL = 'https://shieldx-back.onrender.com/api/sos';

  // 🔊 Setup audio when screen mounts
  useEffect(() => {
    setupAudio();

    // Start countdown
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownRef.current);
          sendSOS();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownRef.current);
      stopSound();
    };
  }, []);

  // 🧠 Clean up sound if user navigates away
  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", () => {
      stopSound();
    });
    return unsub;
  }, [navigation, sound]);

  const setupAudio = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  };

  const playSiren = async () => {
    try {
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        require("../assets/alert.mp3"),
        { shouldPlay: true }
      );
      setSound(playbackObject);
    } catch (error) {
      console.error("🔇 Siren playback error:", error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (e) {
        console.error("❌ Sound stop error:", e);
      }
    }
  };

 const sendSOS = async () => {
   console.log("🚨 sendSOS triggered");
   try {
     const userId = await AsyncStorage.getItem("userId");

     // 🔄 Pull emergency contacts from AsyncStorage
     const stored = await AsyncStorage.getItem("emergencyPhoneList");
     const contacts = JSON.parse(stored || "[]");

     if (!userId || contacts.length === 0) {
       console.error("❌ Missing user ID or emergency contacts");
       return;
     }

     // ✅ Validate phone numbers (E.164 format)
  const validContacts = contacts
    .map((phone) => {
      if (typeof phone === "number") phone = phone.toString();
      if (typeof phone === "string") return phone.trim();
      return null;
    })
    .filter((phone) => phone && /^\d{10,14}$/.test(phone));
console.log(validContacts)
  if (validContacts.length === 0) {
    console.error("🚫 No valid phone numbers to send SOS to");
    return;
  }

     // 📍 Get user location
     const { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== "granted") {
       console.error("📵 Location permission denied");
       return;
     }

     const loc = await Location.getCurrentPositionAsync({});
     const { latitude: lat, longitude: lon } = loc.coords;

     // 📨 Prepare payload
     const body = {
       user_id: userId,
       lat,
       lon,
       contacts: validContacts,
     };

     console.log("📡 Sending SOS with payload:", body);

     // 🧠 Send to backend
     const res = await fetch(API_URL, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(body),
     });

     if (!res.ok) {
       const errText = await res.text();
       console.error("❌ SOS API failed:", errText);
       return;
     }

     console.log("✅ SOS alert sent successfully!");
     await playSiren(); // 🎵 Play siren sound

   } catch (err) {
     console.error("💥 Error in sendSOS:", err);
   }
 };

  // 🔁 Pulsing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(outer, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(middle, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(inner, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(outer, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(middle, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(inner, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.appName}>ShieldX</Text>
      <Text style={styles.message}>
        Notifying contacts...{"\n"}Stay safe ❤️
      </Text>
      <View style={styles.buttonContainer}>
        <Animated.View
          style={[styles.circle, styles.outer, { transform: [{ scale: outer }] }]}
        />
        <Animated.View
          style={[styles.circle, styles.middle, { transform: [{ scale: middle }] }]}
        />
        <Animated.View
          style={[styles.circle, styles.inner, { transform: [{ scale: inner }] }]}
        />
        <Text style={styles.countdownText}>
          {countdown > 0 ? countdown : "SOS!"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  appName: {
    fontSize: 34,
    fontWeight: "600",
    color: "#F43F5E",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignSelf: "center",
    marginBottom: 24,
  },
  message: {
    fontSize: 22,
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: { position: "absolute", borderRadius: 999 },
  outer: { width: 280, height: 280, backgroundColor: "rgba(255, 228, 230, 0.6)" },
  middle: { width: 220, height: 220, backgroundColor: "rgba(254, 205, 211, 0.7)" },
  inner: { width: 160, height: 160, backgroundColor: "rgba(253, 164, 175, 0.8)" },
  countdownText: { fontSize: 60, color: "#DC2626", fontWeight: "bold" },
};
