import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AI_URL , AUTH_URL } from '../constants/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SOS from '../assets/sosbut.png';
import { usePushNotifications } from '../utils/usePushNotifications';
import * as Notifications from "expo-notifications";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const appColors = {
  primaryBlue: "#1E90FF",
  white: "#FFFFFF",
  lightGray: "#F0F4F8",
  mediumGray: "#E0E0E0",
  darkText: "#4A4A4A",
  red: "#FF3B3B",
};

const Home = ({ navigation, userEmail }) => {
const [emergencyContacts, setEmergencyContacts] = useState([]);

  if (userEmail) {
    usePushNotifications(userEmail);
  }

  const [user, setUser] = useState(null);

//useEffect(()=>{
//AsyncStorage.removeItem('accessToken');
//})


  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Allow location access to use this feature.");
          setLoading(false);
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
        Alert.alert("Location Error", "Unable to fetch current location. Please ensure GPS is enabled.");
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, []);

useFocusEffect(
  React.useCallback(() => {
    const fetchUser = async () => {
      let token = await AsyncStorage.getItem('accessToken');
      console.log("Initial token:", token);

      try {
        // 🚀 NEW: Fetch emergency contacts
        const contactsJSON = await AsyncStorage.getItem('emergencyPhoneList');
        const parsedContacts = contactsJSON ? JSON.parse(contactsJSON) : [];
        console.log("📞 Emergency contacts:", parsedContacts);
        setEmergencyContacts(parsedContacts);

        // Existing user fetch logic
        let res = await fetch(`https://shieldx-auth.onrender.com/auth/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.warn("Token expired, attempting refresh...");
          token = await refreshTokenIfNeeded();

          res = await fetch(`${AUTH_URL}/auth/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        const data = await res.json();
        console.log("User data fetched:", data);

        if (!res.ok || !data?.name) {
          throw new Error("Invalid response");
        }

        setUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        Alert.alert("Error", "Failed to load profile. Try logging in again.");
        navigation.replace("Star");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigation])
);


  const handleManualSecurityCheck = async () => {
    try {
      Alert.alert(
        "Triggering Security Check",
        "Sending request to backend. Your emergency contacts might be notified.",
        [{ text: "OK" }]
      );

      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        Alert.alert("Authentication Required", "Please log in to trigger a security check.");
        navigation.navigate("Login");
        return;
      }

      const response = await fetch(`https://shieldx-back.onrender.com/api/trigger-security-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: location?.latitude,
          longitude: location?.longitude,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Security check triggered successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to trigger security check. Please try again.");
      }
    } catch (error) {
      console.error("Error triggering manual security check:", error);
      Alert.alert("Error", "Could not connect to backend to trigger security check. Check your internet connection.");
    }
  };
const handleFakeCall = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Incoming Call 📞",
      body: "Someone's calling you...",
      sound: "default",
      data: { screen: "FakeCall" },
    },
    trigger: {
      seconds: 180, // 3 minutes
    },
  });
};

 // ✅ Already well-structured — just tweaking `handleShareLiveLocation` bro

 const handleShareLiveLocation = async () => {
   try {
     Alert.alert("Sharing Location", "Live location sharing initiated!");

     // 1. Ask for location permission
     const { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
       Alert.alert('Permission denied', 'Location permission is required.');
       return;
     }

     // 2. Get current location
     const currentLocation = await Location.getCurrentPositionAsync({});
     const { latitude, longitude } = currentLocation.coords;

     // 3. Grab token + userId
     const accessToken = await AsyncStorage.getItem('accessToken');
     const userId = await AsyncStorage.getItem('userId');

     if (!accessToken || !userId) {
       Alert.alert('Auth error', 'Missing access token or user ID.');
       return;
     }

     // 🔥 4. Get emergency contacts dynamically from AsyncStorage
     const contactsJSON = await AsyncStorage.getItem('emergencyPhoneList');
     const parsedContacts = contactsJSON ? JSON.parse(contactsJSON) : [];

     if (parsedContacts.length === 0) {
       Alert.alert('No Emergency Contacts', 'You haven’t added any emergency contacts yet.');
       return;
     }

     // Format just phone numbers if stored as objects
     const phoneNumbers = parsedContacts.map(contact => {
       if (typeof contact === 'string') return contact;
       return contact?.phoneNumber || contact?.number || ''; // fallback keys
     }).filter(Boolean); // Remove falsy values

     // 5. Prepare payload
     const payload = {
       user_id: userId,
       lat: latitude,
       lng: longitude,
       emergency_contacts: phoneNumbers,
       is_emergency: true,
     };

     // 6. Fire the API request
     const response = await fetch('https://shieldx-back.onrender.com/api/share-location', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${accessToken}`,
       },
       body: JSON.stringify(payload),
     });

     const data = await response.json();

     if (response.ok) {
       Alert.alert('✅ Location Shared', data.message || 'Your location was sent.');
     } else {
       Alert.alert('❌ Error', data.detail || 'Something went wrong.');
     }

   } catch (err) {
     console.error("Location Share Error:", err);
     Alert.alert('❌ Error', 'Failed to share location. Check permissions and network.');
   }
 };


  return (
    <View style={styles.container}>
      {/* Top Header Section */}
      <View style={styles.topSection}>
        <View style={styles.leftTop}>
         <Image
           source={{ uri: user?.profilePicUrl  ||"https://via.placeholder.com/640x480.png/a59090/000000?Text=640x480"}}
           style={styles.avatar}
         />
         <View>
           <Text style={styles.greeting}>Hey there 👋</Text>
           <Text style={styles.username}>{user?.name || "User"}</Text>
         </View>
        </View>

        {/* Right Side Buttons - Row, Icons Only */}
        <View style={styles.rightTopRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleFakeCall}>
            <MaterialCommunityIcons name="phone-incoming-outline" size={24} color={appColors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShareLiveLocation}>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color={appColors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={appColors.primaryBlue} />
        ) : location ? (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            mapType="satellite"
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={location}
              title="Your Current Location"
              description="This is where you are right now"
            />
          </MapView>
        ) : (
          <Text style={styles.locationUnavailableText}>Location unavailable. Please enable GPS.</Text>
        )}
      </View>

      {/* SOS Button */}
      <TouchableOpacity
        style={styles.sosImageButtonWrapper}
        onPress={() => navigation.navigate("SOS", { autoTriggerSOS: true })}
        activeOpacity={0.7}
      >
        <Image source={SOS} style={styles.sosImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.lightGray,
    alignItems: 'center',
  },
  topSection: {
    height: Platform.OS === 'ios' ? screenHeight * 0.22 : screenHeight * 0.20,
    width: '100%',
    backgroundColor: appColors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  leftTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightTop: {
    justifyContent: 'space-between',
    height: '75%',
  },
  topButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButtonText: {
    color: appColors.white,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: appColors.white,
    marginRight: 15,
  },
  greeting: {
    color: appColors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  username: {
    color: appColors.white,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  mapContainer: {
    height: screenHeight * 0.50,
    width: "90%",
    borderRadius: 20,
marginTop:30,
    overflow: "hidden",
    backgroundColor: appColors.mediumGray,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
    marginBottom: 10,
  },
  rightTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },

  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
  },
  locationUnavailableText: {
    fontSize: 15,
    color: appColors.darkText,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sosImageButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 70 : 85,
    alignSelf: 'center',
  },
  sosImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        shadowColor: appColors.red,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
      android: {
        elevation: 15,
        shadowColor: appColors.red,
      },
    }),
  },
});

export default Home;
