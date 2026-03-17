import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText} testID="timerValue">Таймер: {seconds}</Text>
      <View style={styles.buttons}>
        <Button 
          title={isActive ? "Пауза" : "Старт"} 
          onPress={() => setIsActive(!isActive)} 
          testID="toggleButton"
        />
        <Button 
          title="Скинути" 
          onPress={() => { setIsActive(false); setSeconds(0); }} 
          testID="resetButton"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 40, alignItems: 'center' },
  timerText: { fontSize: 32, marginBottom: 20, fontWeight: 'bold' },
  buttons: { flexDirection: 'row', gap: 10 }
});