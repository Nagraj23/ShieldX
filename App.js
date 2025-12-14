// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { Alert, Modal, TextInput, View, Text, Button, StyleSheet } from 'react-native'; // Import Modal components
import { AI_URL } from './constants/api'; // Import your backend URL
import { usePushNotifications } from './utils/usePushNotifications'; // Import hook
import AsyncStorage from '@react-native-async-storage/async-storage';


import Initial from './Screens/Initial'; // Renamed from Initial to match your file
import Register from './Screens/Register';
import Auth from './Screens/Auth';
import Verify from './Screens/Verify';
import Forgot from './Screens/Forgot';
import Panic from './Screens/Panic'; // Assuming this is part of your main flow
import Star from './Screens/Star';
import Login from './Screens/Login';
import OTP from './Screens/OTP';
import Reset from './Screens/Reset';
import Email from './Screens/Email';
import FakeCall from './Screens/FakeCall';
import SOS from './Screens/SOS';
import EmergencyContact from './Screens/EmergencyContact';
import EmergencyAddress from './Screens/EmmergencyAddress';
import MainTabs from './Screens/MainTabs';
import RouteUpdate from './Screens/RouteUpdate';
import RouteUpdatePage from './Screens/RouteUpdateScreen';
import Security from './Screens/Security';
import Edit from './Screens/EditProfile'

const Stack = createStackNavigator();

// Set notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [notificationData, setNotificationData] = useState(null); // To store notification data
  const [userEmail, setUserEmail] = useState(''); // State to hold user's email
    const [emailLoaded, setEmailLoaded] = useState(false);

  // Fetch user email from AsyncStorage on app load
  useEffect(() => {
    const getStoredEmail = async () => {
      try {
        // Assuming your login stores the user's email or a user object containing email
     const storedEmail = await AsyncStorage.getItem('savedEmail');// Or 'loggedInUser.email' etc.
        if (storedEmail) {
          setUserEmail(storedEmail);
          console.log("Loaded user email from storage:", storedEmail);
        }
      } catch (error) {
        console.error("Failed to load user email from storage:", error);
      } finally {
               setEmailLoaded(true); // <--- Set to true once the Async Storage operation is complete
             }
    };
    getStoredEmail();
  }, []);

  // Pass userEmail to the hook
//  usePushNotifications(userEmail);

  useEffect(() => {
    // Listener for notifications received while the app is in the foreground
    const receivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
      if (notification.request.content.data?.type === 'security_check') {
        setNotificationData(notification.request.content.data);
        setShowSecurityModal(true);
      }
    });

    // Listener for user interacting with notifications (app in background/killed)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response received:", response);
      if (response.notification.request.content.data?.type === 'security_check') {
        setNotificationData(response.notification.request.content.data);
        setShowSecurityModal(true);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const handleSecurityCodeSubmit = async () => {
    if (!securityCode) {
      Alert.alert("Error", "Please enter a security code.");
      return;
    }

    const email_from_notification = notificationData?.user_email;

    if (!email_from_notification) {
      Alert.alert("Error", "User context missing for security check.");
      return;
    }

    try {
      // 🆕 Fetch emergency contacts from AsyncStorage
      const contactsJSON = await AsyncStorage.getItem('emergencyPhoneList');
      const parsedContacts = contactsJSON ? JSON.parse(contactsJSON) : [];
      const emergencyContacts = Array.isArray(parsedContacts)
        ? parsedContacts.filter(c => typeof c === 'string')
        : [];

      console.log("📞 Using emergency contacts:", emergencyContacts);

      const response = await fetch('https://shieldx-back.onrender.com/api/security-check', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: securityCode,
          user_email: email_from_notification,
          emergency_contacts: emergencyContacts, // ✅ Pass to backend
        }),
      });

      const data = await response.json();

      Alert.alert(data.status === 'success' ? '✅ Success' : '🚨 Error', data.message);

      if (data.status === 'success') {
        setShowSecurityModal(false);
        setSecurityCode('');
        setNotificationData(null);
      }
    } catch (error) {
      console.error("❌ Error submitting security code:", error);
      Alert.alert("Error", "Failed to submit security code. Please try again.");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial" screenOptions={{ headerShown: false }}>
        {/* Entry Redirector */}
        <Stack.Screen name="Initial" component={Initial} />

        {/* Auth Screens */}
        <Stack.Screen name="Star" component={Star} />
         <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Reset" component={Reset} />
        <Stack.Screen name="OTP" component={OTP} />
         <Stack.Screen name="Edit" component={Edit} />

        {/* Emergency Info Screens */}
        <Stack.Screen name="EmergencyContact" component={EmergencyContact} />
        <Stack.Screen name="EmergencyAddress" component={EmergencyAddress} />

        {/* Main App Screens */}
        <Stack.Screen name="MainTabs">
          {props => <MainTabs {...props} userEmail={userEmail} />}
        </Stack.Screen>
        <Stack.Screen name="FakeCall" component={FakeCall} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="SOS" component={SOS} />
        <Stack.Screen name="Security" component={Security} />
        <Stack.Screen name="RouteUpdate" component={RouteUpdate} />
        <Stack.Screen name="RouteUpdatePage" component={RouteUpdatePage} />
      </Stack.Navigator>

      {/* Security Code Modal */}
      <Modal
        visible={showSecurityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔐 Security Check Required</Text>
            <Text style={styles.modalBody}>
              Please enter your security code to verify your safety.
            </Text>
            {notificationData && notificationData.user_email && (
              <Text style={styles.modalBodySmall}>
                For: {notificationData.user_email}
              </Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter security code"
              keyboardType="numeric"
              secureTextEntry
              value={securityCode}
              onChangeText={setSecurityCode}
            />
            <Button title="Submit Code" onPress={handleSecurityCodeSubmit} />
          </View>
        </View>
      </Modal>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBodySmall: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
});