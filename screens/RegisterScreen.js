import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';
const API_KEY = 'AIzaSyBNWhkGwA_bKcmQNP5Y3GDWoaWuKA4jy5Y';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleRegister = async () => {
    try {
      if (!role) {
        Alert.alert('Error', 'Please select a role (user/admin).');
        return;
      }

      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );

      const uid = res.data.localId;

      await axios.put(`${BASE_URL}/users/${uid}.json`, { email, role });

      Alert.alert('Success', 'User registered successfully!');
      setEmail('');
      setPassword('');
      setRole('user');
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'An unknown error occurred.';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>

      {/* Add the logo image here */}
      <Image
        source={require('../assets/boook.png')}  // Make sure the path is correct relative to this file
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.roleTitle}>Select Role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'user' && styles.activeRole]}
          onPress={() => setRole('user')}
        >
          <Text style={styles.roleText}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'admin' && styles.activeRole]}
          onPress={() => setRole('admin')}
        >
          <Text style={styles.roleText}>Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={!role}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const plum = '#DDA0DD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: plum,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: plum,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: plum,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  activeRole: {
    backgroundColor: plum,
  },
  roleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  registerButton: {
    backgroundColor: plum,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLink: {
    color: plum,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
