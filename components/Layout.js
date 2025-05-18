import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout({ children }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>📚 Mind Fuel</Text>
      </LinearGradient>

      <View style={styles.content}>
        {children}
      </View>

      <LinearGradient
        colors={['#a18cd1', '#fbc2eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footer}
      >
        <Text style={styles.footerText}>© 2025 Mind Fuel</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { color: '#000', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1 },

  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: '#000', fontSize: 14 },
});
