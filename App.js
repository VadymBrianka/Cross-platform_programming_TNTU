import React, { useState } from 'react';

import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

 

export default function App() {

  const [num1, setNum1] = useState('');

  const [num2, setNum2] = useState('');

  const [result, setResult] = useState('');

 

  const handleCalculation = (operation) => {

    const n1 = parseFloat(num1);

    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {

      setResult('Некоректні дані');

      return;

    }

    let res;

    switch (operation) {

      case '+': res = n1 + n2; break;

      case '-': res = n1 - n2; break;

      case '*': res = n1 * n2; break;

      case '/': res = n2 !== 0 ? n1 / n2 : 'Ділення на 0'; break;

      default: res = 'Помилка';

    }

    setResult(res.toString());

  };

 

  return (

    <View style={styles.container}>

      <Text style={styles.text}>Простий калькулятор</Text>

      <TextInput style={styles.input} keyboardType="numeric" value={num1} onChangeText={setNum1} placeholder="Перше число" />

      <TextInput style={styles.input} keyboardType="numeric" value={num2} onChangeText={setNum2} placeholder="Друге число" />

      <Button title="Додати" onPress={() => handleCalculation('+')} />

      <Button title="Відняти" onPress={() => handleCalculation('-')} />

      <Button title="Множити" onPress={() => handleCalculation('*')} />

      <Button title="Ділити" onPress={() => handleCalculation('/')} />

      <Text style={styles.text}>Результат: {result}</Text>

    </View>

  );

}

 

const styles = StyleSheet.create({

  container: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

  },

  text: {

    fontSize: 20,

    marginBottom: 10,

  },

  input: {

    width: 200,

    borderWidth: 1,

    padding: 10,

    marginBottom: 10,

  },

});