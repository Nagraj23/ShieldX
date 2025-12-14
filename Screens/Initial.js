import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AUTH_URL } from '../constants/api';

export default function Initial() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserSetup = async () => {
      try {
        let token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.warn('⚠️ No token found in storage');
          return navigation.replace('Star');
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        console.log('🔁 Fetching user, contact, and address info...');

        // Helper function to fetch with token refresh handling
        const fetchWithTokenRefresh = async (url, options) => {
          let response = await fetch(url, options);
          if (response.status === 403) {
            // Try to get new token from response headers
            const newToken = response.headers.get('x-new-access-token');
            if (newToken) {
              console.log('✅ Updated Access Token from response header.');
              await AsyncStorage.setItem('accessToken', accessToken);
              // Retry the request with new token
              options.headers.Authorization = `Bearer ${accessToken}`;
              response = await fetch(url, options);
            }
          }
          return response;
        };

        const parseJsonOrLogHtml = async (res, name) => {
          const text = await res.text();
          if (text.startsWith('<')) {
            console.error(`❌ ${name} returned HTML instead of JSON:\n`, text.slice(0, 100));
            throw new Error(`${name} returned HTML instead of JSON`);
          }
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error(`❌ Failed to parse ${name} JSON:\n`, text);
            throw err;
          }
        };

        // Sequentially fetch user, contacts, and address to handle token refresh properly
        const userRes = await fetchWithTokenRefresh('https://shieldx-auth.onrender.com/auth/user/me', { headers });
        const userData = await parseJsonOrLogHtml(userRes, '/user/me');

        const contactsRes = await fetchWithTokenRefresh('https://shieldx-auth.onrender.com/emergency/contact', { headers });
        const contactsData = await parseJsonOrLogHtml(contactsRes, '/emergency/contact');

        const addressRes = await fetchWithTokenRefresh('https://shieldx-auth.onrender.com/emergency/address', { headers });
        const addressData = await parseJsonOrLogHtml(addressRes, '/emergency/address');

        console.log('✅ User:', userData);
        console.log('📇 Contacts:', contactsData);
        console.log('📍 Address:', addressData);

        const hasSecurityCode = !!userData?.securityCode;
        const hasContacts = Array.isArray(contactsData?.emergencyContact) && contactsData.emergencyContact.length > 0;
        const hasAddress = !!addressData?.address;

        if (!hasContacts) {
          console.log('🚨 Missing contacts → EmergencyContactsScreen');
          return navigation.replace('EmergencyContact');
        }

        if (!hasAddress) {
          console.log('🚨 Missing address → EmergencyAddressScreen');
          return navigation.replace('EmergencyAddress');
        }

        if (!hasSecurityCode) {
          console.log('🔐 Missing security code → SecurityScreen');
          return navigation.replace('Security');
        }

        console.log('🎉 All good → MainTabs');
        navigation.replace('MainTabs');

      } catch (err) {
        console.error('💥 Initial setup failed:', err.message);
        navigation.replace('Star');
      }
    };

    checkUserSetup();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
