// module.exports = {
//   preset: 'react-native', // Цей рядок автоматично додає __DEV__ та інші змінні
//   transformIgnorePatterns: [
//     "node_modules/(?!(react-native|@react-native|@testing-library)/)"
//   ]
// };

module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@testing-library|expo|@expo|expo-modules-core)/"
  ]
};