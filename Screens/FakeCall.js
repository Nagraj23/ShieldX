import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, ImageBackground, Animated, Easing } from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Feather, MaterialIcons } from '@expo/vector-icons';

export default function FakeCall() {
  const soundRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const setup = async () => {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          console.warn("🚫 Audio permission not granted");
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        await playRingtone();
        Vibration.vibrate([500, 500, 500], true);
        startPulseAnimation();
      } catch (e) {
        console.error("❌ Error in setup:", e);
      }
    };

    setup();

    return () => {
      stopRingtone();
      Vibration.cancel();
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const playRingtone = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/mi_pure.mp3'), // 👈 make sure this exists!
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
    alert('📞 Call accepted! (You can now navigate to the active call UI)');
  };

  const handleDecline = async () => {
    await stopRingtone();
    Vibration.cancel();
    alert('❌ Call declined!');
  };

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <ImageBackground style={styles.container} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Animated.View style={[styles.callerInfo, animatedStyle]}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.callerName}>John Doe</Text>
          <Text style={styles.callerNumber}>(+91) 98765 43210</Text>
          <Text style={styles.callStatus}>Mobile</Text>
        </Animated.View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="speaker" size={28} color="white" />
            <Text style={styles.actionButtonText}>Speaker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="mic-off" size={28} color="white" />
            <Text style={styles.actionButtonText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="dialpad" size={28} color="white" />
            <Text style={styles.actionButtonText}>Keypad</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={handleDecline} style={[styles.callButton, styles.declineButton]}>
            <MaterialIcons name="call-end" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAccept} style={[styles.callButton, styles.acceptButton]}>
            <Feather name="phone" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 50,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  callerName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  callerNumber: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  callStatus: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 80,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  callButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
});
