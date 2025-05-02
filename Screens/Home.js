import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Home = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Allow location access to use this feature."
          );
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        console.log("Location fetched successfully");
      } catch (error) {
        Alert.alert("Error", "Unable to fetch location.");
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Hey there 👋</Text>
            <Text style={styles.username}>Lucy</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="mic-outline" size={24} color="black" />
            <Ionicons
              name="notifications-outline"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
            />
          </View>
        </View> */}
        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={()=>navigation.navigate('FakeCall')} style={styles.actionButton}>
            <FontAwesome5 name="phone-slash" size={24} color="#f91443" />
            <Text style={styles.buttonText}>Fake call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="location-on" size={24} color="#f91443" />
            <Text style={styles.buttonText}>Share live location</Text>
          </TouchableOpacity>
        </View>

        {/* Start Journey */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start a Journey</Text>
          <Text style={styles.cardSubtitle}>
            Enter your destination, and the app will track your route in
            real-time.
          </Text>
        </View>

        {/* Map Section */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FF4F79"
            style={{ marginTop: 20 }}
          />
        ) : location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            mapType="hybrid"
          >
            <Marker
              key={`${location.latitude}-${location.longitude}`}
              coordinate={location}
              title="Your Location"
            >
            </Marker>
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Location unavailable</Text>
        )}
      </ScrollView>

      {/* SOS Button */}
      <TouchableOpacity  onPress={()=>navigation.navigate('SOS')}   style={styles.sosButton}>
        <Ionicons name="alert" size={24} color="white" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  contentContainer: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  greeting: { color: "black", fontSize: 14 },
  username: { color: "black", fontSize: 18, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
    padding: 15,
  },
  actionButton: {
    backgroundColor: "#ffffff",
    padding: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 15,
  },
  buttonText: { color: "black", marginTop: 5, fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: { color: "black", fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { color: "gray", marginTop: 5 },
  map: {
    height: 380,
    width: "100%", // Ensure it takes full width
    marginVertical: 20,
    borderRadius: 20, // Rounded corners
    borderWidth: 2, // Ensure border is visible
    borderColor: "black",
    overflow: "hidden", // Ensures the map respects borderRadius
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  sosButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#409cff",
    padding: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "center",
    shadowColor: "#FF4F79",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  sosText: { color: "white", fontWeight: "bold", marginLeft: 5, fontSize: 16 },
});

export default Home;
