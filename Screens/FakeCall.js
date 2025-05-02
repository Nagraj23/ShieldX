import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
  Vibration,
  Platform,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import Sound from "react-native-sound";

const { width, height } = Dimensions.get("window");

export default function CallingScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const acceptAnim = useRef(new Animated.Value(0)).current;
const declineAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  // Button bounce animation
  const createBounce = (animatedValue) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

  createBounce(acceptAnim).start();
  createBounce(declineAnim).start();
}, []);

  useEffect(() => {
    // Pulse animation for the profile picture
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Vibration pattern
    Vibration.vibrate([1000, 500, 1000], true);

    // Optional: play fake ringtone
    // let ringtone;
    // if (Platform.OS === "android" || Platform.OS === "ios") {
    //   ringtone = new Sound("ringtone.mp3", Sound.MAIN_BUNDLE, (error) => {
    //     if (!error) {
    //       ringtone.setNumberOfLoops(-1);
    //       ringtone.play();
    //     }
    //   });
    // }

    // return () => {
    //   Vibration.cancel();
    //   if (ringtone) {
    //     ringtone.stop();
    //     ringtone.release();
    //   }
    // };
  }, []);

  const handleAccept = () => {
    Alert.alert("Call Accepted", "Connecting...");
  };

  const handleDecline = () => {
    Alert.alert("Call Declined", "You declined the call.");
  };

  const handleMessage = () => {
    Alert.alert("Send Message", "Opening message options...");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.incomingText}>Incoming call</Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.nameText}>Dad</Text>
          <Text style={styles.phoneText}>+91 7620101655</Text>
        </View>

        <View style={styles.profileContainer}>
          <Animated.Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={[
              styles.profilePicture,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
        </View>

        <View style={styles.actionButtonsRow}>
          <Animated.View style={{ transform: [{ translateY: declineAnim }] }}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              activeOpacity={0.8}
              onPress={handleDecline}
            >
              <Icon name="phone-hangup" size={32} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: acceptAnim }] }}>
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              activeOpacity={0.8}
              onPress={handleAccept}
            >
              <Icon name="phone" size={32} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.messageOption} onPress={handleMessage}>
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop:50,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 10,
  },
  incomingText: {
    color: "rgba(0,0,0,0.18)",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  contactInfo: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  nameText: {
    color: "#000",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Snell Roundhand" : undefined,
    marginBottom: 2,
  },
  phoneText: {
    color: "#000",
    fontSize: 20,
    letterSpacing: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 40,
  },
  profilePicture: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#fff",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
    width: "100%",
    gap: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  declineButton: {
    backgroundColor: "#F44336",
  },
  messageOption: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
  },
  messageText: {
    color: "#bdbdbd",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
  },
});
