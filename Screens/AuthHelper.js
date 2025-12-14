// utils/authHelpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AI_URL , AUTH_URL } from '../constants/api';

export const refreshTokenIfNeeded = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${AUTH_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh token failed");

  const data = await res.json();

  await AsyncStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
};
