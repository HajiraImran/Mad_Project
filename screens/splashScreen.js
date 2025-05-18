import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get('https://zenquotes.io/api/random');
        if (res.data && res.data.length > 0) {
          setQuote(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch quote:', err);
      } finally {
        setLoading(false);
        setTimeout(() => navigation.replace('Home'), 4000);
      }
    };

    fetchQuote();
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#6a0dad', '#8e44ad', '#c39bd3']}
      style={styles.container}
    >
      <Image
        source={require('../assets/boook.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Mind Fuel</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
      ) : quote ? (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>"{quote.q}"</Text>
          <Text style={styles.quoteAuthor}>– {quote.a}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Failed to load quote</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 40,
  },
  quoteBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    shadowColor: '#4b0082',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4b0082',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6a0dad',
    textAlign: 'right',
    fontStyle: 'normal',
  },
  errorText: {
    color: '#fff',
    marginTop: 30,
    fontSize: 16,
  },
});
