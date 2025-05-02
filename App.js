import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from './Screens/Register';
import Verify from './Screens/Verify';
import Forgot from './Screens/Forgot';
import Panic from './Screens/Panic'
import Star from './Screens/Star';
import Login from './Screens/Login';
import OTP from './Screens/OTP';
import Reset from './Screens/Reset';
import Email from './Screens/Email';
import FakeCall from './Screens/FakeCall';
import SOS from './Screens/SOS';
import EmergencyContactsScreen from './Screens/EmergencyContact';
import EmergencyAddress from './Screens/EmmergencyAddress';
import MainTabs from './Screens/MainTabs'; // new tab navigator wrapper
import RouteUpdate from './Screens/RouteUpdate';
import RouteUpdatePage from './Screens/RouteUpdateScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Star" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Star" component={Star} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Reset" component={Reset} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="FakeCall" component={FakeCall} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="SOS" component={SOS} />
        <Stack.Screen name="EmergencyContactsScreen" component={EmergencyContactsScreen} />
        <Stack.Screen name="EmergencyAddress" component={EmergencyAddress} />
      </Stack.Navigator>
    </NavigationContainer>
    // // <FakeCall />
    // // <RouteUpdate />
    // <RouteUpdatePage />

  );
}
