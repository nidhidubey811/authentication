import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation'; // built-in in RN 0.71+

const ExecutiveDashboard = ({ route }) => {
  const { userName, token, empID } = route.params;

  const [tracking, setTracking] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [location, setLocation] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);

  // Ask permission on Android
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Send to backend
  const sendLocationToServer = async (lat, lng) => {
    try {
      const response = await fetch('https://hrmapi.bahi-khata.in/LocationTrack/AddLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empID: empID,
          lat: lat,
          long: lng,
          location: `Lat: ${lat}, Lng: ${lng}`,
          trackDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      console.log('✅ Location sent:', data);
    } catch (err) {
      console.log('❌ Failed to send location:', err.message);
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setGpsEnabled(false);
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        setLocation({ coords });
        setGpsEnabled(true);

        const lat = coords.latitude;
        const lng = coords.longitude;

        // Save to UI
        setVisitHistory((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            lat,
            lng,
            accuracy: coords.accuracy,
          },
          ...prev,
        ]);

        // Save to backend
        sendLocationToServer(lat, lng);
      },
      (error) => {
        console.log('❌ GPS error:', error.message);
        setGpsEnabled(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  useEffect(() => {
    if (tracking) {
      getLocation(); // first time
      const interval = setInterval(() => {
        getLocation();
      }, 4 * 60 * 1000); // every 4 min
      return () => clearInterval(interval);
    }
  }, [tracking]);

  const toggleTracking = () => {
    const newState = !tracking;
    setTracking(newState);
    Alert.alert(newState ? '✅ Tracking Started' : '🛑 Tracking Stopped');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userName}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTracking}>
        <Text style={styles.buttonText}>{tracking ? 'Stop Day' : 'Start Day'}</Text>
      </TouchableOpacity>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          Tracking: {tracking ? '🟢 ON' : '🔴 OFF'}
        </Text>
        <Text style={styles.statusText}>
          GPS: {gpsEnabled ? '🛰 ON' : '❌ OFF'}
        </Text>
        {location && (
          <>
            <Text style={styles.statusText}>
              Lat: {location.coords.latitude.toFixed(5)}
            </Text>
            <Text style={styles.statusText}>
              Lng: {location.coords.longitude.toFixed(5)}
            </Text>
            <Text style={styles.statusText}>
              Accuracy: {location.coords.accuracy} m
            </Text>
          </>
        )}
      </View>

      <Text style={styles.historyTitle}>Visit History (Today)</Text>
      <FlatList
        data={visitHistory}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ width: '100%', marginTop: 10 }}
        renderItem={({ item }) => (
          <View style={styles.visitItem}>
            <Text>🕒 {item.time}</Text>
            <Text>📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}</Text>
            <Text>🎯 Accuracy: {item.accuracy} m</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ExecutiveDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: {
    backgroundColor: '#075eec',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  statusBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  statusText: { fontSize: 15, marginVertical: 2 },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  visitItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
});
