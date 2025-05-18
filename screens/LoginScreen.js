import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, Chip, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import axios from 'axios';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';
const API_KEY = 'AIzaSyBNWhkGwA_bKcmQNP5Y3GDWoaWuKA4jy5Y';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#DDA0DD',
    accent: '#DDA0DD',
  },
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );

      const { localId } = res.data;
      const userRes = await axios.get(`${BASE_URL}/users/${localId}.json`);
      const userData = userRes.data;

      if (!userData) throw new Error('User data not found in database.');

      if (role === userData.role) {
        // Navigate to HomeTabs with role and userId
        navigation.replace('HomeTabs', { userId: localId, role });
      } else {
        throw new Error('Role mismatch. Please select the correct role.');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>

        {/* Book Image */}
         <Image
                source={require('../assets/boook.png')}
                style={styles.logo}
                resizeMode="contain"
              />
        <Text variant="headlineMedium" style={styles.title}>Login</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Select Role</Text>
        <View style={styles.chipRow}>
          <Chip
            selected={role === 'admin'}
            onPress={() => setRole('admin')}
            style={styles.chip}
            selectedColor="white"
          >
            Admin
          </Chip>
          <Chip
            selected={role === 'user'}
            onPress={() => setRole('user')}
            style={styles.chip}
            selectedColor="white"
          >
            User
          </Chip>
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          disabled={!role}
          style={styles.button}
        >
          Login
        </Button>

        <View style={styles.registerContainer}>
          <Text>Don't have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate('Register')}>
            Register
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

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
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#DDA0DD',
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 10,
  },
  registerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
