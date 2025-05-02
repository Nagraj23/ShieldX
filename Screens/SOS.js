"use client"

import { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar, SafeAreaView, Platform 
} from "react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SOS() {
  const outerCircle = new Animated.Value(1);
  const middleCircle = new Animated.Value(1);
  const innerCircle = new Animated.Value(1);

  const API_URL = "http://192.168.124.74:8000/api/share-location"; // Update with your API endpoint

  const fetchSOS = async () => {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied!");
        return;
      }

      // Get user's location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log(`User Location: ${latitude}, ${longitude}`);

      // Store emergency info in AsyncStorage
      await AsyncStorage.setItem("emergencyInfo", JSON.stringify({ latitude, longitude }));

      // Retrieve stored data (for verification)
      const storedInfo = await AsyncStorage.getItem("emergencyInfo");
      console.log("Stored Emergency Info:", JSON.parse(storedInfo));

      // Send location to API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) throw new Error("Failed to send SOS");

      console.log("SOS Alert Sent ✅");

      // Ensure sound permissions
      const { status: soundStatus } = await Audio.requestPermissionsAsync();
      if (soundStatus !== "granted") {
        console.error("Audio permission denied!");
        return;
      }

      // Load and play siren sound
      const sound = new Audio.Sound();
      await sound.loadAsync(require("../assets/alert copy.mp3"));
      await sound.playAsync();
      console.log("Siren Sound Playing 🔊");

      // Unload sound when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });

    } catch (error) {
      console.error("Error in SOS function:", error);
    }
  };

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.parallel([
        Animated.timing(outerCircle, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(middleCircle, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(innerCircle, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(outerCircle, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(middleCircle, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(innerCircle, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    ]);

    Animated.loop(pulse).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.appName}>ShieldX</Text>
      <Text style={styles.message}>Your contacts are being notified{"\n"}"Safety is on the way"</Text>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.circle, styles.outerCircle, { transform: [{ scale: outerCircle }] }]} />
        <Animated.View style={[styles.circle, styles.middleCircle, { transform: [{ scale: middleCircle }] }]} />
        <Animated.View style={[styles.circle, styles.innerCircle, { transform: [{ scale: innerCircle }] }]} />
        <TouchableOpacity activeOpacity={0.8} style={styles.sosButton} onPress={fetchSOS}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingHorizontal: 16 },
  appName: { fontSize: 34, fontWeight: "600", color: "#F43F5E", textAlign: "center", marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, marginBottom: 16 },
  message: { fontSize: 22, color: "#1F2937", textAlign: "center", marginBottom: 32 },
  buttonContainer: { alignItems: "center", justifyContent: "center", height: 400 },
  circle: { position: "absolute", borderRadius: 999 },
  outerCircle: { width: 280, height: 280, backgroundColor: "rgba(255, 228, 230, 0.6)" },
  middleCircle: { width: 220, height: 220, backgroundColor: "rgba(254, 205, 211, 0.7)" },
  innerCircle: { width: 160, height: 160, backgroundColor: "rgba(253, 164, 175, 0.8)" },
  sosButton: { width: 112, height: 112, borderRadius: 56, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 },
  sosText: { color: "white", fontSize: 24, fontWeight: "bold" },
});
