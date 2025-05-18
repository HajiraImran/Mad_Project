import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Share, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const response = await axios.get('https://zenquotes.io/api/quotes');
      setQuotes(response.data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const onShare = async (quote, author) => {
    try {
      const message = `"${quote}"\n\n- ${author}`;
      await Share.share({
        message,
        title: 'Motivational Quote',
      });
    } catch (error) {
      alert('Error sharing quote: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>"{item.q}"</Text>
      <Text style={styles.authorText}>- {item.a}</Text>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => onShare(item.q, item.a)}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="share-alt" size={20} color="#7B61FF" />
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#7B61FF"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={quotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  quoteCard: {
    backgroundColor: '#fafafa',
    padding: 20,
    marginBottom: 14,
    borderRadius: 14,
    shadowColor: '#7B61FF',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#444',
    lineHeight: 26,
  },
  authorText: {
    marginTop: 12,
    fontSize: 15,
    textAlign: 'right',
    fontWeight: '600',
    color: '#7B61FF',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    alignSelf: 'flex-end',
  },
  shareText: {
    color: '#7B61FF',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
});
