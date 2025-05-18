import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Image, TouchableOpacity,
  ActivityIndicator, StyleSheet, Modal, ScrollView, Dimensions, KeyboardAvoidingView
} from 'react-native';

const { height } = Dimensions.get('window');

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => searchBooks(query), 500);
      setTypingTimeout(timeout);
    } else {
      setResults([]);
    }
    return () => clearTimeout(typingTimeout);
  }, [query]);

  const searchBooks = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`);
      const json = await res.json();
      const items = (json.items || []).map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
        description: item.volumeInfo.description || 'No description available.',
      }));
      setResults(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedBook(item);
        setModalVisible(true);
      }}
    >
      {item.thumbnail ? <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} /> : null}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRelatedBooks = () => {
    const relatedBooks = results.filter(book => book.id !== selectedBook?.id).slice(0, 5);
    return (
      <View>
        <Text style={styles.relatedTitle}>Related Books</Text>
        <FlatList
          data={relatedBooks}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedBook(item);
                setModalVisible(true);
              }}
              style={styles.relatedBookCard}
            >
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.relatedThumbnail} />
              ) : (
                <View style={[styles.relatedThumbnail, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 10 }}>No Image</Text>
                </View>
              )}
              <Text style={styles.relatedBookTitle} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.relatedBooksContainer}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search books..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={query ? <Text style={styles.empty}>No results found.</Text> : null}
        />
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView style={styles.modalContentWrapper} behavior="padding">
            <ScrollView contentContainerStyle={styles.modalContainer}>
              {selectedBook?.thumbnail ? (
                <Image source={{ uri: selectedBook.thumbnail }} style={styles.modalImage} />
              ) : null}
              <Text style={styles.modalTitle}>{selectedBook?.title}</Text>
              <Text style={styles.modalAuthor}>{selectedBook?.author}</Text>
              <Text style={styles.modalDescription}>{selectedBook?.description}</Text>

              {renderRelatedBooks()}

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: { width: 60, height: 90 },
  info: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  author: { fontSize: 14, color: '#555', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContentWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    marginTop: height * 0.15,
  },
  modalContainer: {
    paddingBottom: 30,
  },
  modalImage: {
    width: 150,
    height: 220,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  modalAuthor: { fontSize: 16, color: '#555', textAlign: 'center', marginVertical: 5 },
  modalDescription: { fontSize: 14, color: '#333', marginVertical: 10, textAlign: 'justify' },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  relatedBooksContainer: {
    paddingBottom: 10,
  },
  relatedBookCard: {
    marginRight: 10,
    width: 100,
    alignItems: 'center',
  },
  relatedThumbnail: {
    width: 90,
    height: 130,
    borderRadius: 6,
  },
  relatedBookTitle: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});
