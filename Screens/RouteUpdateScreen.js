// 🌍 imports
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { AI_URL } from "../constants/api";

const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";
const LOCATION_UPDATE_INTERVAL = 5 * 60 * 1000;
let lastSent = 0;

const { width, height } = Dimensions.get("window");
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

// 🛠️ BACKGROUND TASK SETUP
if (!TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("❌ Background task error", error);
      return;
    }

    if (!data) return;

    const now = Date.now();
    if (now - lastSent < LOCATION_UPDATE_INTERVAL) return;
    lastSent = now;

    try {
      const { locations } = data;
      const location = locations?.[0];
      const userId = await AsyncStorage.getItem("internalUserId");
      const journeyId = await AsyncStorage.getItem("currentJourneyId");
      const contactData = await AsyncStorage.getItem("internalEmergencyContact");

      let emergencyContacts = [];
      try {
        const parsed = JSON.parse(contactData);
        emergencyContacts = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        if (contactData) emergencyContacts = [contactData];
      }

      emergencyContacts = emergencyContacts.filter(
        (num) => typeof num === "string" && /^\d{10,14}$/.test(num)
      );

      if (!location || !userId || !journeyId || emergencyContacts.length === 0) return;

      await fetch(`${AI_URL}/api/location/update_location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          type: "route_monitor",
          emergency_contacts: emergencyContacts,
          journey_id: journeyId,
        }),
      });

      console.log("✅ Background location sent at", new Date(now).toLocaleTimeString());
    } catch (err) {
      console.error("❌ Background send error:", err);
    }
  });
}

// 🚀 MAIN COMPONENT
export default function RouteUpdate() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [allRoutesCoordinates, setAllRoutesCoordinates] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const mapRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem("internalUserId");
      if (!id) {
        id = uuid.v4();
        await AsyncStorage.setItem("internalUserId", id);
      }
      userIdRef.current = id;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUserLocation(loc.coords);

      const isTrackingFlag = await AsyncStorage.getItem("isTracking");
      if (isTrackingFlag !== "true") {
        const tasks = await TaskManager.getRegisteredTasksAsync();
        const registered = tasks.find(t => t.taskName === LOCATION_TASK_NAME);
        if (registered) {
          console.log("🧹 Stopping leftover background task");
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      }
    })();
  }, []);

  const fetchCoords = async (address) => {
    const GOOGLE_API_KEY = "AIzaSyC9wUqhLFroJbDWTuOwYhjw0OzpllfndNc";
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      if (data.results.length) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        Alert.alert("Error", "Invalid address: " + address);
        return null;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      Alert.alert("Error", "Could not fetch coordinates");
      return null;
    }
  };

  const decodePolyline = (encoded) => {
    let points = [], index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lat += result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lng += result & 1 ? ~(result >> 1) : result >> 1;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const fetchRoute = async (from, to) => {
    const API = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&mode=walking&alternatives=true&key=AIzaSyC9wUqhLFroJbDWTuOwYhjw0OzpllfndNc`;
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.routes.length) {
        const decoded = decodePolyline(data.routes[0].overview_polyline.points);
        setAllRoutesCoordinates([decoded]);
        mapRef.current?.fitToCoordinates(decoded, {
          edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error("Route error:", err);
      Alert.alert("Error", "Could not fetch directions");
    }
  };

  const handleStartJourney = async () => {
    if (!from || !to) return Alert.alert("Missing info", "Enter both From and To");

    setLoadingTracking(true);
    try {
      const fromC = await fetchCoords(from);
      const toC = await fetchCoords(to);
      if (!fromC || !toC) return;

      await fetchRoute(fromC, toC);

      const stored = await AsyncStorage.getItem("emergencyPhoneList");
      const contacts = JSON.parse(stored || "[]");
     const validContacts = contacts
         .map((phone) => {
           if (typeof phone === "number") phone = phone.toString();
           if (typeof phone === "string") return phone.trim();
           return null;
         })
         .filter((phone) => phone && /^\d{10,14}$/.test(phone));
     console.log(validContacts)

      if (validContacts.length === 0) {
        return Alert.alert("Error", "No valid emergency contacts found!");
      }

      const res = await fetch('https://shieldx-back.onrender.com/api/share_route', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userIdRef.current,
          start_lat: fromC.latitude,
          start_lng: fromC.longitude,
          end_lat: toC.latitude,
          end_lng: toC.longitude,
          emergency_contacts: validContacts,
        }),
      });

      const data = await res.json();

      await AsyncStorage.setItem("currentJourneyId", data.journey_id);
      await AsyncStorage.setItem("internalEmergencyContact", JSON.stringify(validContacts));
      await AsyncStorage.setItem("isTracking", "true");

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: LOCATION_UPDATE_INTERVAL,
        deferredUpdatesInterval: LOCATION_UPDATE_INTERVAL,
        distanceInterval: 0,
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Journey Tracker",
          notificationBody: "Your location is updating every 5 mins.",
        },
      });

      setIsTracking(true);
    } catch (err) {
      console.error("Start journey error:", err);
      Alert.alert("Error", "Could not start tracking");
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleStopJourney = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    await AsyncStorage.multiRemove(["currentJourneyId", "internalEmergencyContact", "isTracking"]);
    setIsTracking(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: userLocation?.latitude || 20.5937,
          longitude: userLocation?.longitude || 78.9629,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {allRoutesCoordinates.map((route, idx) => (
          <Polyline key={idx} coordinates={route} strokeWidth={4} strokeColor="#FF4F79" />
        ))}
      </MapView>

      <View style={styles.floatingInputCard}>
        <View style={styles.inputRow}>
          <Ionicons name="navigate" size={20} color="#888" />
          <TextInput style={styles.input} value={from} onChangeText={setFrom} placeholder="From" />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="place" size={20} color="#888" />
          <TextInput style={styles.input} value={to} onChangeText={setTo} placeholder="To" />
        </View>
        <TouchableOpacity style={styles.button} onPress={isTracking ? handleStopJourney : handleStartJourney}>
          <Text style={styles.buttonText}>
            {loadingTracking ? "Loading..." : isTracking ? "Stop Journey" : "Start Journey"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  floatingInputCard: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#FF4F79",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
