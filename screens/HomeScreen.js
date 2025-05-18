import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/boook.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Mind Fuel</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#a18cd1', '#fbc2eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#fbc2eb', '#a18cd1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDA0DD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    borderRadius: 30,
    marginVertical: 10,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
});
