import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const BASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com/';

export default function AdminBookManagerScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFirebaseBooks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/books.json`);
      if (!res.data) return [];
      return Object.keys(res.data).map(id => ({
        id,
        ...res.data[id],
        source: 'firebase',
      }));
    } catch (err) {
      console.error('Failed to fetch Firebase books:', err);
      return [];
    }
  };

  const fetchApiBooks = async () => {
    try {
      const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=react');
      const data = await response.json();
      return data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') || 'Unknown',
        description: item.volumeInfo.description || 'No description',
        image: item.volumeInfo.imageLinks?.thumbnail || '',
        price: 'N/A',
        content: 'Not available',
        pdfUrl: '',
        source: 'api',
      }));
    } catch (error) {
      console.error('API fetch failed:', error);
      return [];
    }
  };

  const fetchAllBooks = async () => {
    setLoading(true);
    const firebaseBooks = await fetchFirebaseBooks();
    const apiBooks = await fetchApiBooks();
    setBooks([...firebaseBooks, ...apiBooks]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const clearForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setImage('');
    setPrice('');
    setContent('');
    setPdfUrl('');
    setEditingId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!title || !author || !description || !image || !price || !content) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (pdfUrl && !pdfUrl.toLowerCase().endsWith('.pdf')) {
      Alert.alert('Error', 'PDF URL should end with ".pdf"');
      return;
    }

    const bookData = { title, author, description, image, price, content, pdfUrl };

    try {
      if (editingId) {
        await axios.patch(`${BASE_URL}/books/${editingId}.json`, bookData);
        Alert.alert('Updated', 'Book updated successfully');
      } else {
        await axios.post(`${BASE_URL}/books.json`, bookData);
        Alert.alert('Added', 'Book added successfully');
      }
      clearForm();
      fetchAllBooks();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save book');
    }
  };

  const handleEdit = book => {
    if (book.source !== 'firebase') {
      Alert.alert('Info', 'Only Firebase books can be edited');
      return;
    }

    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setImage(book.image);
    setPrice(book.price);
    setContent(book.content);
    setPdfUrl(book.pdfUrl || '');
    setEditingId(book.id);
  };

  const handleDelete = async (id, source) => {
    if (source !== 'firebase') {
      Alert.alert('Info', 'Only Firebase books can be deleted');
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/books/${id}.json`);
      Alert.alert('Deleted', 'Book removed');
      fetchAllBooks();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete book');
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.bookItem}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/80x120.png?text=No+Image' }}
          style={styles.bookImage}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>Author: {item.author}</Text>
          <Text style={styles.bookPrice}>Price: {item.price}</Text>
          <Text style={styles.bookContent}>Content: {item.content}</Text>
          {item.pdfUrl ? (
            <Button
              title="Open PDF"
              onPress={() =>
                Linking.openURL(item.pdfUrl).catch(() =>
                  Alert.alert('Error', 'Cannot open PDF link')
                )
              }
              color="#DDA0DD"
            />
          ) : null}
          <View style={styles.bookButtons}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Button title="Edit" onPress={() => handleEdit(item)} color="#DDA0DD" />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Delete" onPress={() => handleDelete(item.id, item.source)} color="#DDA0DD" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={books}
      keyExtractor={item => item.id}
      renderItem={renderBookItem}
      ListHeaderComponent={
        <View style={styles.card}>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>{editingId ? 'Edit Book' : 'Add Book'}</Text>
            <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={styles.input} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />
            <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
            <TextInput
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <TextInput
              placeholder="PDF URL (must end with .pdf)"
              value={pdfUrl}
              onChangeText={setPdfUrl}
              style={styles.input}
            />
            <Button
              title={editingId ? 'Update Book' : 'Add Book'}
              onPress={handleAddOrUpdate}
              color="#DDA0DD"
            />
          </View>
        </View>
      }
      ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  formContainer: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  bookItem: {
    flexDirection: 'row',
    gap: 10,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
  },
  bookPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  bookContent: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  bookButtons: {
    flexDirection: 'row',
    marginTop: 6,
  },
});
