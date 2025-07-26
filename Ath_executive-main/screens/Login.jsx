import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const response = await fetch('https://hrmapi.bahi-khata.in/User/authenticate', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: form.email,
          password: form.password,
        }),
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (response.ok && data.token) {
          // ✅ Navigate with empID
          navigation.navigate('ExecutiveDashboard', {
            userName: data.userName,
            token: data.token,
            empID: data.empID, // <- Pass empID here
          });
        } else {
          Alert.alert('Login Failed', 'Invalid email or password.');
        }
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        Alert.alert('Server Error', 'Unexpected response format.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('./image.png')} // Make sure this image exists
          />
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>View tracking and other details</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry
              value={form.password}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.formFooter}>
          Don't have an account?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', justifyContent: 'center', marginVertical: 36 },
  headerImg: { width: 80, height: 80, marginBottom: 36 },
  title: { fontSize: 31, fontWeight: '700', color: '#1D2A32', marginBottom: 6 },
  subtitle: { fontSize: 15, fontWeight: '500', color: '#929292' },
  form: { flexGrow: 1 },
  input: { marginBottom: 16 },
  inputLabel: { fontSize: 17, fontWeight: '600', color: '#222', marginBottom: 8 },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  formAction: { marginTop: 4, marginBottom: 16 },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: '#075eec',
  },
  btnText: { fontSize: 18, fontWeight: '600', color: '#fff' },
  formLink: { fontSize: 16, fontWeight: '600', color: '#075eec', textAlign: 'center' },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
});
