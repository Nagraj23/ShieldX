import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, YatraOne_400Regular } from "@expo-google-fonts/yatra-one";
import { Playfair_Display_Regular, Playfair_Display_Bold } from '@expo-google-fonts/playfair-display'; 

const { width, height } = Dimensions.get("window");

const images = [
  {
    id: "1",
    uri: require("../assets/safetyr.png"),
    title: "Your Safety, Our Priority.",
    description:
      "Empower yourself with tools designed to keep you safe, informed, and connected anytime, anywhere.",
  },
  {
    id: "2",
    uri: require("../assets/sos.png"),
    title: "Navigate with Ease.",
    description:
      "Get real-time assistance and track safe routes wherever you are.",
  },
  {
    id: "3",
    uri: require("../assets/SAFETYT.png"),
    title: "Stay Smart, Stay Safe.",
    description:
      "Discover essential tips and tricks to enhance your personal safety.",
  },
];

const Star = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [fontsLoaded] = useFonts({
    YatraOne_400Regular,
    
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#3e82fc",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
          Loading fonts...
        </Text>
        <Image
          source={require("../assets/safetyr.png")}
          style={{ width: 80, height: 80, marginBottom: 20 }}
        />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const handleGetStarted = () => {
    if (activeIndex < images.length - 1) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate("Auth");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={[styles.name, { fontFamily: "YatraOne_400Regular" }]}>
              ShieldX
            </Text>
            <Text style={styles.title}>
              {item.title}
            </Text>
            <Image source={item.uri} style={styles.image} />
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleGetStarted}>
          <Text style={styles.nextText}>
            {activeIndex === images.length - 1 ? "Start" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
//#3e82fc
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "white", // white light blue background
  },
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
     fontWeight:'bold',
    color: "#3e82fc",
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 40,
    color: "#3e82fc",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    color: "#3e82fc",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  skipButton: {
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  skipText: {
    color: "#3e82fc",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nextText: {
    color: "#1E90FF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Star;
