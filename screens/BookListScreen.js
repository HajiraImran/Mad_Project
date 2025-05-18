import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com';

const PlumButton = ({ onPress, children, style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.plumButton, style]}
  >
    {children}
  </TouchableOpacity>
);

export default function BookListScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const debouncedSearch = debounce((query) => {
    setSearch(query);
  }, 500);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/books.json`);
      if (!res.data) {
        setBooks([]);
        setLoading(false);
        return;
      }

      const formattedBooks = Object.keys(res.data).map(id => ({
        id,
        ...res.data[id],
      }));

      setBooks(formattedBooks);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(search.toLowerCase())
  );

  const relatedBooks = selectedBook
    ? books.filter(
        b =>
          b.id !== selectedBook.id &&
          b.author &&
          selectedBook.author &&
          b.author.toLowerCase() === selectedBook.author.toLowerCase()
      )
    : [];

  if (loading) {
    return <ActivityIndicator size="large" color="#7a57b8" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedBook(item)}
      activeOpacity={0.85}
      style={styles.cardTouchable}
    >
      <LinearGradient
        colors={['#d6a4ff', '#fcb7ce', '#b19cd9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
        {item.pdfUrl?.trim() !== '' && (
          <PlumButton onPress={() => Linking.openURL(item.pdfUrl)} style={styles.pdfButton}>
            <FontAwesome name="file-pdf-o" size={18} color="#5a2e91" />
            <Text style={styles.pdfText}>View PDF</Text>
          </PlumButton>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderRelatedItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedBook(item)} style={styles.relatedCard}>
      <Image source={{ uri: item.image }} style={styles.relatedImage} />
      <Text numberOfLines={2} style={styles.relatedTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const BookDetail = () => (
    <ScrollView contentContainerStyle={styles.detailWrapper} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: selectedBook.image }} style={styles.detailImage} />
      <Text style={styles.detailTitle}>{selectedBook.title}</Text>
      <Text style={styles.detailAuthor}>{selectedBook.author}</Text>
      <Text style={styles.detailPrice}>${selectedBook.price}</Text>
      <Text style={styles.detailDesc}>{selectedBook.description}</Text>

      {/* Show book content here */}
      {selectedBook.content ? (
        <>
          <Text style={styles.contentHeader}>Content:</Text>
          <Text style={styles.detailContent}>{selectedBook.content}</Text>
        </>
      ) : null}

      {selectedBook.pdfUrl?.trim() ? (
        <PlumButton style={styles.pdfButton} onPress={() => Linking.openURL(selectedBook.pdfUrl)}>
          <FontAwesome name="file-pdf-o" size={18} color="#5a2e91" />
          <Text style={styles.pdfText}>Read PDF</Text>
        </PlumButton>
      ) : (
        <Text style={{ color: '#888', marginTop: 10 }}>No PDF available</Text>
      )}

      {relatedBooks.length > 0 && (
        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeader}>Related Books</Text>
          <FlatList
            horizontal
            data={relatedBooks}
            keyExtractor={(item) => item.id}
            renderItem={renderRelatedItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <PlumButton style={styles.closeButton} onPress={() => setSelectedBook(null)}>
        <Text style={styles.closeText}>← Back</Text>
      </PlumButton>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {selectedBook ? (
        <BookDetail />
      ) : (
        <>
          <TextInput
            placeholder="Search by title"
            onChangeText={debouncedSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={renderBookCard}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No books found.</Text>}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 10 },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  cardTouchable: {
    flex: 1,
    margin: 6,
  },
  card: {
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#4b2c91' },
  author: { fontSize: 14, color: '#6b4ca3', marginBottom: 4 },
  description: { fontSize: 12, color: '#5a3e8b', marginBottom: 6 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#7a57b8' },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pdfText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a2e91',
    marginLeft: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
  detailWrapper: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  detailImage: { width: '100%', height: 300, borderRadius: 12, marginBottom: 20 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', color: '#4b2c91', textAlign: 'center', marginBottom: 10 },
  detailAuthor: { fontSize: 18, color: '#6b4ca3', marginBottom: 6 },
  detailPrice: { fontSize: 20, fontWeight: 'bold', color: '#7a57b8', marginBottom: 12 },
  detailDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5a3e8b',
    textAlign: 'justify',
    marginBottom: 16,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b2c91',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5a3e8b',
    textAlign: 'justify',
    marginBottom: 16,
  },
  relatedSection: { marginTop: 30, width: '100%' },
  relatedHeader: { fontSize: 20, fontWeight: 'bold', color: '#4b2c91', marginBottom: 10, paddingLeft: 4 },
  relatedCard: { width: 120, marginRight: 12 },
  relatedImage: { width: 120, height: 160, borderRadius: 10 },
  relatedTitle: { fontSize: 14, textAlign: 'center', marginTop: 5, color: '#6b4ca3' },
  plumButton: {
    backgroundColor: '#b19cd9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#7a57b8',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
  closeText: {
    color: '#4b2c91',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
