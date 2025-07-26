// screens/Dashboard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard = ({ route }) => {
  const { userName, token } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {userName}!</Text>
      <Text style={styles.token}>Token: {token}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  token: { fontSize: 12, color: '#666' },
});

export default Dashboard;
