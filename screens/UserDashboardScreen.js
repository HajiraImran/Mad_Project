import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';

export default function UserDashboardScreen({ route, navigation }) {
  const { userId } = route.params;
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${userId}.json`);
        if (response.data && response.data.email) {
          setUserEmail(response.data.email);
        } else {
          setUserEmail('User');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        Alert.alert('Error', 'Unable to load user data.');
        setUserEmail('User');
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const GradientButton = ({ onPress, icon, children, style }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.button, style]}>
      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconTextContainer}>
          {icon}
          <Text style={[styles.buttonText, { color: 'black' }]}>{children}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>


      <GradientButton
        onPress={() => navigation.navigate('BookList')}
        icon={<FontAwesome5 name="book-open" size={20} color="black" style={styles.icon} />}
      >
        Browse Books
      </GradientButton>

      <GradientButton
        onPress={() => navigation.navigate('Search')}
        icon={<FontAwesome5 name="search" size={20} color="black" style={styles.icon} />}
      >
        Search Books
      </GradientButton>

      {/* Quotes button with gradient but no icon */}
      <GradientButton onPress={() => navigation.navigate('Quotes')}>
        View Motivational Quotes
      </GradientButton>

      <GradientButton
        onPress={() => navigation.navigate('Trivia', { userId })}
        icon={<FontAwesome5 name="question-circle" size={20} color="black" style={styles.icon} />}
      >
        Play Trivia Quiz
      </GradientButton>

      

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <View style={styles.iconTextContainer}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#d9534f" style={styles.icon} />
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',  // Changed to white
  },
  title: { 
    fontSize: 30, 
    fontWeight: '800', 
    marginBottom: 50,
    color: '#222',
    textAlign: 'center',
  },
  button: {
    width: '85%',
    borderRadius: 30,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#3b3b3b',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  gradient: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: '#d9534f',
    marginTop: 30,
  },
  logoutText: {
    color: '#d9534f',
  },
});
