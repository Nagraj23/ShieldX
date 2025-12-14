import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Home";
import RouteUpdateScreen from "./RouteUpdateScreen";
import SafetyTipsScreen from "./Chatbot";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

const MainTabs = ({ userEmail }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
       tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: "#409cff",
      tabBarInactiveTintColor: "#999",
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
      tabBarStyle: {
        height: 70,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#fff",
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      },
      tabBarIcon: ({ color, focused }) => {
        let iconName;
        if (route.name === "Home") iconName = "home";
        else if (route.name === "Route") iconName = "map";
        else if (route.name === "Tips") iconName = "shield-checkmark";
        else if (route.name === "Profile") iconName = "person";

        return (
          <Ionicons
            name={iconName}
            size={focused ? 28 : 24}
            color={color}
            style={{ marginBottom: -4 }}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home">
      {(props) => <HomeScreen {...props} userEmail={userEmail} />}
    </Tab.Screen>
    <Tab.Screen name="Route" component={RouteUpdateScreen} />
    <Tab.Screen name="Tips" component={SafetyTipsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabs;
