import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function PanicScreen() {
  const soundRef = useRef(null);

  // Runs when screen mounts
  useEffect(() => {
    const setup = async () => {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          console.warn("🚫 Audio permission not granted");
          return;
        }

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          allowsRecordingIOS: false,
          shouldDuckAndroid: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });

        await playRingtone();
        Vibration.vibrate([500, 500, 500], true); // loop vibration
      } catch (e) {
        console.error("❌ Error in setup:", e);
      }
    };

    setup();

    // Cleanup when screen unmounts
    return () => {
      stopRingtone();
      Vibration.cancel();
    };
  }, []);

  const playRingtone = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alert.mp3'),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );
      soundRef.current = sound;
      await sound.playAsync();
    } catch (err) {
      console.error("🔥 Error playing ringtone:", err);
    }
  };

  const stopRingtone = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (err) {
      console.error("🛑 Error stopping ringtone:", err);
    }
  };

  const handleAccept = async () => {
    await stopRingtone();
    Vibration.cancel();
    alert('📞 Call accepted!');
  };

  const handleDecline = async () => {
    await stopRingtone();
    Vibration.cancel();
    alert('❌ Call declined!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📲 Incoming Fake Call...</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleDecline} style={[styles.button, styles.decline]}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAccept} style={[styles.button, styles.accept]}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 50,
    width: 120,
    alignItems: 'center',
  },
  accept: {
    backgroundColor: 'green',
  },
  decline: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
