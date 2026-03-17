import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './LoginScreen';
import TimerScreen from './TimerScreen';
import CalculatorScreen from './CalculatorScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Базове завдання:</Text>
        <LoginScreen />
        
        <View style={styles.divider} />
        
        <Text style={styles.header}>Індивідуальне завдання:</Text>
        <TimerScreen />

        <View style={styles.divider} />
        
        <Text style={styles.header}>Індивідуальне (Варіант 2): Калькулятор</Text>
        <CalculatorScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  divider: { height: 2, backgroundColor: '#eee', marginVertical: 20 }
});