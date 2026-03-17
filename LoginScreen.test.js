import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen, { validateEmail, validatePassword } from './LoginScreen';

jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => ({
  __esModule: true,
  default: 'TextInput',
}));

jest.mock('react-native/Libraries/Text/Text', () => ({
  __esModule: true,
  default: 'Text',
}));

describe('LoginScreen Unit Tests', () => {
  test('valid email passes validation', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('invalid email fails validation', () => {
    expect(validateEmail('wrong_email')).toBe(false);
  });

  test('valid password passes validation', () => {
    expect(validatePassword('123456')).toBe(true);
  });

  test('short password fails validation', () => {
    expect(validatePassword('123')).toBe(false);
  });
});

describe('LoginScreen Component Tests', () => {
  test('shows error on invalid email', () => {
    const { getByTestId } = render(<LoginScreen />);
    
    // Симуляція введення у поля
    fireEvent.changeText(getByTestId('emailInput'), 'invalid');
    fireEvent.changeText(getByTestId('passwordInput'), '123456');
    
    // Натискання кнопки
    fireEvent.press(getByTestId('loginButton'));
    
    // Перевірка повідомлення
    expect(getByTestId('messageText').props.children).toBe('Invalid email format');
  });

  test('shows success message on valid inputs', () => {
    const { getByTestId } = render(<LoginScreen />);
    
    fireEvent.changeText(getByTestId('emailInput'), 'student@tntu.edu.ua');
    fireEvent.changeText(getByTestId('passwordInput'), 'securePass123');
    fireEvent.press(getByTestId('loginButton'));
    
    expect(getByTestId('messageText').props.children).toBe('Login successful!');
  });
});