import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

// Import Screens
import Profile from './Profile';
import SOS from './SOS'

const Tab = createBottomTabNavigator();

const SOSButton = ({ onPress }) => (
  <TouchableOpacity style={styles.sosButton} onPress={onPress}>
    <Icon name="bell" size={24} color="white" />
    <Text style={styles.sosText}>SOS</Text>
  </TouchableOpacity>
);

const BottomNavigator = () => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={() => null}  // Placeholder for Home Content
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color}/>,
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOS}
        options={{
          tabBarButton: (props) => <SOSButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fce4ec',
    elevation: 5,
  },
  sosButton: {
    width: 80,
    height: 80,
    backgroundColor: '#ff3b30',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  sosText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
