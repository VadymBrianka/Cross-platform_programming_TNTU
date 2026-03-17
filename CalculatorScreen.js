import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CalculatorScreen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value) => {
    if (value === '=') {
      try {
        // eval() автоматично впорається з дійсними числами та дужками
        const evalResult = eval(input).toString();
        setResult(evalResult);
      } catch (e) {
        setResult('Помилка');
      }
    } else if (value === 'C') {
      // Повне очищення
      setInput('');
      setResult('');
    } else if (value === '⌫') {
      // Видалення останнього символу
      setInput((prev) => prev.slice(0, -1));
    } else {
      // Додавання символу (зокрема і крапки)
      setInput((prev) => prev + value);
    }
  };

  // Оновлена матриця кнопок (5 рядків по 4 колонки)
  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '=']
  ];

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.inputText}>{input}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>
      <View style={styles.keyboard}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity 
                key={btn} 
                style={[
                  styles.button, 
                  ['/', '*', '-', '+', '='].includes(btn) ? styles.operatorButton : null,
                  ['C', '⌫'].includes(btn) ? styles.actionButton : null
                ]} 
                onPress={() => handlePress(btn)}
              >
                <Text style={[
                  styles.buttonText, 
                  ['/', '*', '-', '+', '='].includes(btn) ? styles.operatorText : null,
                  ['C', '⌫'].includes(btn) ? styles.actionText : null
                ]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f3f4f6', borderRadius: 10, marginVertical: 10 },
  display: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'flex-end', marginBottom: 10, minHeight: 100, justifyContent: 'flex-end' },
  inputText: { fontSize: 24, color: '#374151' },
  resultText: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginTop: 10 },
  keyboard: { gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { flex: 1, backgroundColor: '#e5e7eb', padding: 15, borderRadius: 8, alignItems: 'center' },
  operatorButton: { backgroundColor: '#3b82f6' }, // Синій для математичних операцій
  actionButton: { backgroundColor: '#ef4444' }, // Червоний для кнопок C та ⌫
  buttonText: { fontSize: 24, color: '#1f2937', fontWeight: 'bold' },
  operatorText: { color: '#fff' },
  actionText: { color: '#fff' }
});