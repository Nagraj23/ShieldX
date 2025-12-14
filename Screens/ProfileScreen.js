import React, { useLayoutEffect, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View, Text, Image, Alert,
  StatusBar, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AI_URL , AUTH_URL } from '../constants/api';
import { refreshTokenIfNeeded } from './AuthHelper';
const colors = {
  primary: "#1E90FF",
  white: "#FFFFFF",
  lightGray: "#F0F4F8",
  darkText: "#333333",
  red: "#FF3B3B",
  gray: "#E0E0E0"
};

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


useFocusEffect(
  React.useCallback(() => {
    const fetchUser = async () => {
      let token = await AsyncStorage.getItem('accessToken');
      console.log("Initial token:", token);

      try {
        let res = await fetch(`${AUTH_URL}/auth/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.warn("Token expired, attempting refresh...");
          token = await refreshTokenIfNeeded();

          res = await fetch(`https://shieldx-auth.onrender.com/auth/user/me`, {
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
  }, [navigation]) // 👈 make sure to include navigation as a dep
);
  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.replace("Star");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { profilePicUrl, name, email } = user || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.banner}>
          <Image
            source={{ uri: profilePicUrl  }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate("Edit", { user })}
          >
            <Ionicons name="pencil" size={22} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutIcon}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity style={styles.itemCard}><Text>John Doe - 1234567890</Text></TouchableOpacity>
          <TouchableOpacity style={styles.itemCard}><Text>Jane Smith - 9876543210</Text></TouchableOpacity>
        </View>

      </ScrollView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.lightGray },
  banner: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.white
  },
  editIcon: {
    position: 'absolute',
    right: 60,
    top: 50,
  },
  logoutIcon: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 12,
  },
  description: {
    fontSize: 18,
    color: colors.white,
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: colors.white,
    marginTop: 10,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: colors.lightGray,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
});
