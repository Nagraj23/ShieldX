import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FakeCallPage() {
  const [callStatus, setCallStatus] = useState('Incoming Fake Call...');
  
  const acceptCall = () => {
    setCallStatus('Call Accepted');
  };

  const declineCall = () => {
    setCallStatus('Call Declined');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.callText}>{callStatus}</Text>

      {/* Fake Call Icon */}
      <Image 
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Phone_icon.svg/512px-Phone_icon.svg.png' }} 
        style={styles.phoneIcon} 
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={declineCall}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={acceptCall}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'dodgerblue',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  phoneIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 350,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
