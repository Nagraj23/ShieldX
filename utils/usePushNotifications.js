// utils/usePushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { AI_URL } from '../constants/api'; // Import your backend URL

export function usePushNotifications(userEmail) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    async function setupNotifications() {
      console.log("usePushNotifications: useEffect triggered.");
      console.log("usePushNotifications: userEmail received:", userEmail);

      const token = await registerForPushNotificationsAsync();
      console.log("usePushNotifications: Token from registerForPushNotificationsAsync:", token);

      if (token) {
        setExpoPushToken(token);
        console.log("Expo Push Token (state):", token);

        if (userEmail) { // Only register with backend if userEmail is provided and not null
          console.log("usePushNotifications: User email and token are present. Attempting to register with backend.");
          try {
            const requestBody = JSON.stringify({ email: userEmail, token: token, type: "expo" });
            console.log("usePushNotifications: Request body for /api/register-token:", requestBody);

            // This is the line that now correctly targets the backend
            const response = await fetch(`${AI_URL}/api/register-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: requestBody,
            });


            console.log("usePushNotifications: Response status from /api/register-token:", response.status);
            const data = await response.json();
            console.log("usePushNotifications: Response data from /api/register-token:", data);

            if (response.ok) {
                console.log("usePushNotifications: Token registration to backend successful.");
            } else {
                console.error("usePushNotifications: Token registration to backend failed with status:", response.status, " and message:", data.message || "No specific error message from backend.");
            }
          } catch (error) {
            console.error("usePushNotifications: Caught error during fetch to /api/register-token:", error);
          }
        } else {
          console.warn("usePushNotifications: userEmail is null or undefined. Skipping token registration with backend. This usually means the user is not yet logged in or email not loaded from AsyncStorage.");
        }
      } else {
        console.warn("usePushNotifications: No push token obtained. Skipping registration with backend.");
      }
    }

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Handle received notifications
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle notification interactions
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      console.log("usePushNotifications: Listeners removed on unmount.");
    };
  }, [userEmail]);

  return expoPushToken;
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn("registerForPushNotificationsAsync: Expo project ID not found in app.json. Push notifications might not work correctly on Android.");
    }

    try {
        const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('registerForPushNotificationsAsync: Push Token obtained:', token);
        return token;
    } catch (e) {
        console.error("registerForPushNotificationsAsync: Error getting Expo Push Token:", e);
        return null;
    }
  } else {
    console.warn('registerForPushNotificationsAsync: Must use physical device for Push Notifications. Simulator will not get a token.');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return null;
}