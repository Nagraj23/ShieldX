import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Checkbox = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
      onPress={() => onValueChange(!value)}
    >
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#777',
          backgroundColor: value ? '#1E90FF' : '#FFF',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        {value && (
          <View
            style={{
              height: 12,
              width: 12,
              backgroundColor: '#FFF',
            }}
          />
        )}
      </View>
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  );
};
export default Checkbox