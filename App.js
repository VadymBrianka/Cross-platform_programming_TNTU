import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';

const App = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  // Функція для форматування введення (додає пробіл кожні 4 цифри)
  const handleInputChange = (text) => {
    // Видаляємо всі символи, крім цифр
    const cleaned = text.replace(/\D/g, '');
    
    // Обмежуємо довжину до 16 цифр
    const truncated = cleaned.slice(0, 16);

    // Додаємо пробіли для зручності читання
    let formatted = '';
    for (let i = 0; i < truncated.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += truncated[i];
    }

    setCardNumber(formatted);
    // Скидаємо результат при зміні тексту
    setValidationResult(null); 
  };

  // Алгоритм Луна для валідації картки
  const validateLuhn = (number) => {
    let sum = 0;
    let isSecond = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10);

      if (isSecond) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isSecond = !isSecond;
    }

    return sum % 10 === 0;
  };

  const handleValidate = () => {
    Keyboard.dismiss();
    const rawNumber = cardNumber.replace(/\s/g, ''); // Видаляємо пробіли для перевірки

    if (rawNumber.length !== 16) {
      setValidationResult({
        isValid: false,
        message: 'Номер картки має містити рівно 16 цифр.',
      });
      return;
    }

    const isValid = validateLuhn(rawNumber);

    setValidationResult({
      isValid: isValid,
      message: isValid 
        ? '✅ Картка дійсна!' 
        : '❌ Недійсний номер картки. Перевірте правильність вводу.',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Перевірка банківської картки</Text>

        <TextInput
          style={styles.input}
          placeholder="0000 0000 0000 0000"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={handleInputChange}
          maxLength={19} // 16 цифр + 3 пробіли
        />

        <TouchableOpacity style={styles.button} onPress={handleValidate}>
          <Text style={styles.buttonText}>Перевірити</Text>
        </TouchableOpacity>

        {validationResult && (
          <View
            style={[
              styles.resultContainer,
              validationResult.isValid ? styles.validResult : styles.invalidResult,
            ]}
          >
            <Text
              style={[
                styles.resultText,
                validationResult.isValid ? styles.validText : styles.invalidText,
              ]}
            >
              {validationResult.message}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    letterSpacing: 2,
    color: '#1F2937',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  validResult: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  invalidResult: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  validText: {
    color: '#065F46',
  },
  invalidText: {
    color: '#991B1B',
  },
});

export default App;