import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';

export default function AdminDashboardScreen({ navigation, route }) {
  const { userId } = route.params;
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${userId}.json`);
        if (res.data?.name) {
          setAdminName(res.data.name);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setAdminName('Admin');
      }
    };

    fetchAdminData();
  }, [userId]);

  const handleLogout = () => {
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.replace('Login');
  };

  const GradientButton = ({ onPress, iconName, children, style }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.button, style]}>
      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconTextContainer}>
          <Icon name={iconName} size={24} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {adminName || 'Admin'}!</Text>

      <GradientButton
        onPress={() => navigation.navigate('AdminBookManager', { userId })}
        iconName="book-open-page-variant"
      >
        Manage Books
      </GradientButton>

      <GradientButton
        onPress={() => navigation.navigate('AdminUserList')}
        iconName="account-group"
      >
        View Users
      </GradientButton>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <View style={styles.iconTextContainer}>
          <Icon name="logout" size={24} color="#d9534f" style={styles.icon} />
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // white background for clean look
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555',
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
    color: 'black',
  },
  logoutButton: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: '#d9534f',
    marginTop: 30,
    width: '85%',
  },
  logoutText: {
    color: '#d9534f',
  },
});
