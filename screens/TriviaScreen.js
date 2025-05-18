import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const FIREBASE_URL = 'https://book-app-7def6-default-rtdb.firebaseio.com';

export default function TriviaScreen({ route }) {
  const { userId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const fetchTrivia = async () => {
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=5&type=multiple');
      const formatted = res.data.results.map(q => ({
        question: decodeHTML(q.question),
        correct: decodeHTML(q.correct_answer),
        options: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
      }));
      setQuestions(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load quiz.');
    }
  };

  const decodeHTML = (str) =>
    str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)).replace(/&quot;/g, '"');

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    fetchTrivia();
  }, []);

  const handleAnswer = (option) => {
    const isCorrect = option === questions[current].correct;
    if (isCorrect) setScore(score + 1);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      saveScoreToFirebase(finalScore);
    }
  };

  const saveScoreToFirebase = async (finalScore) => {
    try {
      const payload = {
        score: finalScore,
        timestamp: new Date().toISOString(),
      };
      await axios.post(`${FIREBASE_URL}/triviaScores/${userId}.json`, payload);
      Alert.alert('Quiz Completed', `Your Score: ${finalScore} / ${questions.length}`, [
        { text: 'OK' },
      ]);
      setCurrent(0);
      setScore(0);
      fetchTrivia();
    } catch (err) {
      console.error('Error saving score:', err);
      Alert.alert('Error', 'Could not save score.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} color="#7B61FF" />;
  }

  const currentQ = questions[current];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.question}>{currentQ.question}</Text>
      {currentQ.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => handleAnswer(opt)}
          activeOpacity={0.8}
          style={styles.optionWrapper}
        >
          <LinearGradient
            colors={['#d4a5ff', '#a18cd1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.option}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
      <Text style={styles.counter}>Question {current + 1} of {questions.length}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexGrow: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
    color: '#3e3e3e',
    textAlign: 'center',
  },
  optionWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  option: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  counter: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    fontWeight: '500',
  },
});
