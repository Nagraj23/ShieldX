// MainTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./Home";
import RouteUpdateScreen from "./RouteUpdateScreen";
import SafetyTipsScreen from "./SafetyTipsScreen";
import TrainingScreen from "./TrainingScreen";
import ProfileScreen from "./ProfileScreen";
import RouteUpdateP from './RouteUpdate'
import RouteUpdate from "./RouteUpdateScreen";

const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown:false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Home") iconName = "home";
        else if (route.name === "Route") iconName = "map";
        else if (route.name === "Tips") iconName = "shield-checkmark";
        else if (route.name === "Training") iconName = "school";
        else if (route.name === "Profile") iconName = "person";
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Route" component={RouteUpdateScreen} />
    {/* <Tab.Screen name="map" component={RouteUpdate}/> */}
    <Tab.Screen name="Tips" component={SafetyTipsScreen} />
    <Tab.Screen name="Training" component={TrainingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;
