import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator, // Added for loading state
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BACKEND_URL } from '../constants/api'; // Assuming you have this constant

// Define colors palette for consistency
const appColors = {
  primaryBlue: "#1E90FF", // Dodger Blue
  white: "#FFFFFF",
  lightGray: "#F0F4F8", // Used for backgrounds
  mediumGray: "#E0E0E0", // Used for borders/placeholders
  darkText: "#4A4A4A", // Darker text for readability
  red: "#FF3B3B", // For logout/error actions
};

export default function Profile({ navigation }) { // Ensure navigation prop is passed
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem('accessToken'); // Get token from storage

        if (!token) {
          Alert.alert("Authentication Required", "Please log in to view your profile.");
          navigation.replace('Star'); // Redirect to initial login/register screen
          return;
        }

        const response = await fetch(`${BACKEND_URL}/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load profile data.");
        Alert.alert("Profile Load Error", err.message || "Could not fetch profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem('accessToken'); // Clear the token
            navigation.replace('Star'); // Navigate back to the initial login/register screen
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColors.primaryBlue} />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => { /* Re-fetch logic here or navigate away */ }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fallback for userData if it's null/undefined after loading
  const username = userData?.username || userData?.name || "User"; // Use 'name' if 'username' is not available
  const email = userData?.email || "N/A";
  const phoneNo = userData?.phoneNo || "N/A";
  const profilePicUrl = userData?.profilePicUrl || "https://i.pravatar.cc/150?img=68"; // Default avatar

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: profilePicUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileDetail}>{email}</Text>
          <Text style={styles.profileDetail}>Phone: {phoneNo}</Text>
        </View>

        {/* Action Cards */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate("EmergencyContactsScreen")}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="contacts" size={30} color={appColors.primaryBlue} />
            <Text style={styles.cardText}>Emergency Contacts</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={appColors.darkText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate("EmergencyAddress")} // Assuming this is your EmergencyAddress screen
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="map-marker-outline" size={30} color={appColors.primaryBlue} />
            <Text style={styles.cardText}>Emergency Address</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={appColors.darkText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate("RouteUpdatePage")} // Using 'RouteUpdatePage' as per your App.js snippet
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="routes" size={30} color={appColors.primaryBlue} />
            <Text style={styles.cardText}>Recent Routes</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={appColors.darkText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate("Security")} // For security code / password management
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="security" size={30} color={appColors.primaryBlue} />
            <Text style={styles.cardText}>Security Code</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={appColors.darkText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => Alert.alert("Settings", "Navigate to general settings screen")}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={30} color={appColors.primaryBlue} />
            <Text style={styles.cardText}>General Settings</Text>
            <Ionicons name="chevron-forward-outline" size={24} color={appColors.darkText} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={24} color={appColors.white} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.lightGray,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: appColors.darkText,
  },
  errorText: {
    color: appColors.red,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: appColors.primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center', // Center content horizontally within scroll view
    paddingVertical: 20, // Add vertical padding to the content
  },
  profileHeader: {
    width: '100%',
    alignItems: 'center', // Center profile image and text
    paddingVertical: 25,
    backgroundColor: appColors.white,
    marginBottom: 20,
    borderBottomLeftRadius: 30, // Rounded bottom corners
    borderBottomRightRadius: 30,
    elevation: 5, // Subtle shadow for Android
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Half of width/height for a perfect circle
    borderWidth: 3,
    borderColor: appColors.primaryBlue,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: appColors.darkText,
    marginBottom: 5,
  },
  profileDetail: {
    fontSize: 16,
    color: appColors.darkText,
    opacity: 0.8,
    marginBottom: 3,
  },
  cardContainer: {
    width: '90%', // Limit width for cards
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute items horizontally
    backgroundColor: appColors.white,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 12, // Spacing between cards
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardText: {
    flex: 1, // Allows text to take available space
    fontSize: 16,
    color: appColors.darkText,
    fontWeight: '500',
    marginLeft: 15, // Space between icon and text
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.red,
    width: '90%', // Match card width
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 15, // Extra space for iOS safe area
    elevation: 5,
    shadowColor: appColors.red,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    gap: 10, // Space between icon and text
  },
  logoutButtonText: {
    color: appColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});