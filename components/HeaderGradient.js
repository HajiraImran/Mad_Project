import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HeaderGradient({ children }) {
  return (
    <LinearGradient
      colors={['#8e4585', '#dda0dd']}  // Plum gradient start & end colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.content}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: 100,  // standard header height
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
