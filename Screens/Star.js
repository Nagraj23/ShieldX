import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const images = [
  {
    id: "1",
    uri: require("../assets/safetyr.png"),
    title: "Your Safety, Our Priority.",
    description: "Empower yourself with tools designed to keep you safe, informed, and connected anytime, anywhere."
  },
  {
    id: "2",
    uri: require("../assets/sos.png"),
    title: "Navigate with Ease.",
    description: "Get real-time assistance and track safe routes wherever you are."
  },
  {
    id: "3",
    uri: require("../assets/SAFETYT.png"),
    title: "Stay Smart, Stay Safe.",
    description: "Discover essential tips and tricks to enhance your personal safety."
  },
];

const Star = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
      navigation.navigate("Register");
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
            
    <Text style={styles.name}>ShieldX</Text>
            <Text style={styles.title}>{item.title}</Text>
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

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.nextText}>
            {activeIndex === images.length - 1 ? "Start" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#daedff", // Solid light blue background
  },
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: width * 0.80,
    height: height * 0.40,
    resizeMode: "contain",
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    color: "#000",
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
    borderColor: "#000",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  skipText: {
    color: "#000",
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
