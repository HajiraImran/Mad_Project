import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';

export default function AdminUserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users.json`);
        if (res.data) {
          const parsedUsers = Object.entries(res.data)
            .map(([id, data]) => ({
              id,
              email: data.email || 'No Email',
              role: data.role || 'user',
            }))
            .filter(user => user.role !== 'admin'); // 🧹 Exclude admins

          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.detail}>📧 Email: {item.email}</Text>
      <Text style={styles.detail}>👤 Role: {item.role}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registered Users</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {   
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  detail: { fontSize: 15, marginBottom: 4 },
});
