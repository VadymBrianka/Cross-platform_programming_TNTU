import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TimerScreen from './TimerScreen';

// Додаємо заглушки для базових компонентів, щоб уникнути конфліктів версій
jest.mock('react-native/Libraries/Components/TextInput/TextInput', () => ({
  __esModule: true,
  default: 'TextInput',
}));
jest.mock('react-native/Libraries/Text/Text', () => ({
  __esModule: true,
  default: 'Text',
}));

describe('TimerScreen Component Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders initial state correctly', () => {
    const { getByTestId } = render(<TimerScreen />);
    expect(getByTestId('timerValue').props.children.join('')).toBe('Таймер: 0');
  });

  test('starts and increments timer every second', () => {
    const { getByTestId } = render(<TimerScreen />);
    
    // Натискаємо "Старт"
    fireEvent.press(getByTestId('toggleButton'));

    // Перемотуємо час на 3 секунди вперед
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Перевіряємо, чи таймер збільшився до 3
    expect(getByTestId('timerValue').props.children.join('')).toBe('Таймер: 3');
  });

  test('resets the timer correctly', () => {
    const { getByTestId } = render(<TimerScreen />);
    
    // Запускаємо, чекаємо 2 секунди
    fireEvent.press(getByTestId('toggleButton'));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Натискаємо "Скинути"
    fireEvent.press(getByTestId('resetButton'));

    // Перевіряємо, чи значення обнулилося
    expect(getByTestId('timerValue').props.children.join('')).toBe('Таймер: 0');
  });
});