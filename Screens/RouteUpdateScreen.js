import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';

const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // Replace with your API key

export default function RouteUpdate({ navigation }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [routePreview, setRoutePreview] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let currentLocation = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      } catch (e) {
        // Ignore location error
      }
    })();
  }, []);

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${GOOGLE_PLACES_API_KEY}&language=en&components=country:in`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToChange = (text) => {
    setTo(text);
    fetchSuggestions(text);
  };

  const handleSuggestionPress = (suggestion) => {
    setTo(suggestion.description);
    setSuggestions([]);
  };

  const fetchCoords = async (address, setter) => {
    if (!address) return;
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await resp.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        setter({ latitude: loc.lat, longitude: loc.lng });
      }
    } catch (e) {
      console.warn('Geocode error:', e);
    }
  };

  useEffect(() => {
    fetchCoords(from, setFromCoords);
  }, [from]);

  useEffect(() => {
    fetchCoords(to, setToCoords);
  }, [to]);

  useEffect(() => {
    const fetchAllPreviews = async () => {
      if (fromCoords && toCoords && suggestions.length > 0) {
        for (const item of suggestions) {
          if (!routePreview[item.place_id]) {
            await fetchRoutePreview(fromCoords, toCoords, item.place_id);
          }
        }
      }
    };
    fetchAllPreviews();
  }, [suggestions, fromCoords, toCoords]);

  const fetchRoutePreview = async (fromC, toC, placeId) => {
    if (!fromC || !toC) return;
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromC.latitude},${fromC.longitude}&destination=${toC.latitude},${toC.longitude}&key=${GOOGLE_PLACES_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.routes && data.routes.length) {
        const points = decodePolyline(data.routes[0].overview_polyline.points);
        setRoutePreview((prev) => ({ ...prev, [placeId]: points }));
      }
    } catch (e) {
      console.warn('Route fetch error:', e);
    }
  };

  function decodePolyline(encoded) {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inputCard}>
        <View style={styles.inputRow}>
          <Ionicons name="navigate" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={from}
            onChangeText={setFrom}
            placeholder="From"
            placeholderTextColor="#bbb"
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="place" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={to}
            onChangeText={handleToChange}
            placeholder="To"
            placeholderTextColor="#bbb"
            autoFocus
          />
          <TouchableOpacity style={styles.addBtn} onPress={async () => {
            if (fromCoords && toCoords) {
              setLoading(true);
              try {
                const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromCoords.latitude},${fromCoords.longitude}&destination=${toCoords.latitude},${toCoords.longitude}&key=${GOOGLE_PLACES_API_KEY}`;
                const resp = await fetch(url);
                const data = await resp.json();
                if (data.routes && data.routes.length) {
                  const points = decodePolyline(data.routes[0].overview_polyline.points);
                  setRoutePreview({ direct: points });
                }
              } catch (e) {
                console.warn('Route fetch error:', e);
              } finally {
                setLoading(false);
              }
            }
          }}>
            <Ionicons name="navigate" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {loading && (
          <ActivityIndicator size="small" color="#888" style={{ marginVertical: 8 }} />
        )}
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.suggestionTitle}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.suggestionSubtitle}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                  {fromCoords && toCoords && routePreview[item.place_id] && (
                    <MapView
                      style={{
                        height: 80,
                        width: '100%',
                        marginTop: 8,
                        borderRadius: 8,
                      }}
                      initialRegion={{
                        latitude: fromCoords.latitude,
                        longitude: fromCoords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                     mapType="hybrid"
                    >
                      <Polyline
                        coordinates={routePreview[item.place_id]}
                        strokeColor="#FF4F79"
                        strokeWidth={3}
                      />
                    </MapView>
                  )}
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 180, marginTop: 4 }}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.startBtn, !(from && to) && { backgroundColor: '#ccc' }]}
        disabled={!(from && to)}
        
      >
        <Text style={styles.startBtnText}>Start</Text>
      </TouchableOpacity>
      {/* Always show MapView below input fields */}
      <View style={{ flex: 1, minHeight: 250, marginVertical: 10 }}>
        <MapView
          style={{    height: 420,
            width: "100%", // Ensure it takes full width
            marginVertical: 20,
            borderRadius: 20, // Rounded corners
            borderWidth: 2, // Ensure border is visible
            borderColor: "black",
            overflow: "hidden",}}
          initialRegion={userLocation ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : {
            latitude: 20.5937, // Default: India center
            longitude: 78.9629,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
          region={fromCoords && toCoords ? {
            latitude: (fromCoords.latitude + toCoords.latitude) / 2,
            longitude: (fromCoords.longitude + toCoords.longitude) / 2,
            latitudeDelta: Math.abs(fromCoords.latitude - toCoords.latitude) + 0.05,
            longitudeDelta: Math.abs(fromCoords.longitude - toCoords.longitude) + 0.05,
          } : undefined}
        >
          {userLocation && !fromCoords && !toCoords && (
            <Marker coordinate={userLocation} title="Your Location" />
          )}
          {fromCoords && <Marker coordinate={fromCoords} title="From" pinColor="green" />}
          {toCoords && <Marker coordinate={toCoords} title="To" pinColor="red" />}
          {routePreview.direct && (
            <Polyline coordinates={routePreview.direct} strokeWidth={4} strokeColor="#007AFF" />
          )}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef8f5',
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 4,
  },
  addBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 16,
    padding: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  startBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
