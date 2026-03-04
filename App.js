import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  StyleSheet, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as SQLite from 'expo-sqlite';

// --- Окремий компонент для картки пароля ---
const PasswordCard = ({ item, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.serviceText}>{item.service}</Text>
        <Text style={styles.infoText}>Логін: {item.username}</Text>
        
        <View style={styles.passwordRow}>
          <Text style={[styles.infoText, { flex: 1 }]}>
            Пароль: {showPassword ? item.password : '••••••••'}
          </Text>
          
          <TouchableOpacity 
            style={styles.toggleVisibilityBtn} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.toggleText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Text style={styles.btnText}>Ред.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
          <Text style={styles.btnText}>Вид.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  const [db, setDb] = useState(null);
  const [passwordsList, setPasswordsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  
  // Стани форми
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);
  const [showInputPassword, setShowInputPassword] = useState(false);

  const isWeb = Platform.OS === 'web';

  // Єдина ініціалізація для всіх платформ
  useEffect(() => {
    setupSQLite();
  }, []);

  const setupSQLite = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('password_manager.db');
      setDb(database);
      await database.execAsync(
        `CREATE TABLE IF NOT EXISTS passwords (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          service TEXT, 
          username TEXT, 
          password TEXT
        );`
      );
      loadSQLitePasswords(database);
    } catch (error) {
      console.error("Помилка ініціалізації БД:", error);
    }
  };

  const loadSQLitePasswords = async (database = db) => {
    if (!database) return;
    try {
      const allRows = await database.getAllAsync('SELECT * FROM passwords');
      setPasswordsList(allRows);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generatedPassword = "";
    for (let i = 0; i < 12; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generatedPassword);
    setShowInputPassword(true);
  };

  const handleSave = async () => {
    if (!service || !username || !password) {
      if (isWeb) window.alert('Будь ласка, заповніть всі поля!');
      else Alert.alert('Помилка', 'Будь ласка, заповніть всі поля!');
      return;
    }

    try {
      if (editId) {
        await db.runAsync(
          'UPDATE passwords SET service = ?, username = ?, password = ? WHERE id = ?',
          [service, username, password, editId]
        );
        if (!isWeb) Alert.alert('Успіх', 'Дані оновлено!');
      } else {
        await db.runAsync(
          'INSERT INTO passwords (service, username, password) VALUES (?, ?, ?)',
          [service, username, password]
        );
      }
      resetForm();
      await loadSQLitePasswords();
    } catch (error) {
      console.error("Помилка збереження:", error);
    }
  };

  const handleEdit = (item) => {
    setService(item.service);
    setUsername(item.username);
    setPassword(item.password);
    setEditId(item.id);
    setShowInputPassword(true);
  };

  const handleDelete = async (id) => {
    // Логіка підтвердження для Web
    if (isWeb) {
      const confirmDelete = window.confirm('Ви впевнені, що хочете видалити цей пароль?');
      if (confirmDelete) {
        try {
          await db.runAsync('DELETE FROM passwords WHERE id = ?', [id]);
          await loadSQLitePasswords();
        } catch (error) {
          console.error("Помилка видалення:", error);
        }
      }
    } else {
      // Логіка підтвердження для Mobile
      Alert.alert(
        'Підтвердження',
        'Ви впевнені, що хочете видалити цей пароль?',
        [
          { text: 'Скасувати', style: 'cancel' },
          { 
            text: 'Видалити', 
            style: 'destructive',
            onPress: async () => {
              try {
                await db.runAsync('DELETE FROM passwords WHERE id = ?', [id]);
                await loadSQLitePasswords();
              } catch (error) {
                console.error("Помилка видалення:", error);
              }
            }
          }
        ]
      );
    }
  };

  const resetForm = () => {
    setService('');
    setUsername('');
    setPassword('');
    setEditId(null);
    setShowInputPassword(false);
  };

  const filteredPasswords = passwordsList.filter(item => 
    item.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.headerTitle}>Менеджер Паролів</Text>
      
      <Text style={styles.platformText}>
        База даних: {isWeb ? 'SQLite (WebAssembly)' : 'SQLite (Mobile)'}
      </Text>

      <View style={styles.formContainer}>
        {/* ... (Тут текстові поля залишились без змін) ... */}
        <TextInput style={styles.input} placeholder="Сервіс (напр. Google)" value={service} onChangeText={setService} />
        <TextInput style={styles.input} placeholder="Логін / Email" value={username} autoCapitalize="none" onChangeText={setUsername} />
        
        <View style={styles.passwordInputContainer}>
          <TextInput style={styles.passwordInput} placeholder="Пароль" value={password} secureTextEntry={!showInputPassword} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => setShowInputPassword(!showInputPassword)} style={styles.iconBtn}>
            <Text style={styles.iconText}>{showInputPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={generatePassword} style={styles.iconBtn}>
            <Text style={styles.iconText}>🎲</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{editId ? 'Оновити запис' : 'Додати запис'}</Text>
          </TouchableOpacity>
          {editId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.btnText}>Скасувати</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TextInput 
        style={styles.searchInput} 
        placeholder="🔍 Пошук за сервісом..." 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPasswords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PasswordCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {passwordsList.length === 0 ? 'Немає збережених паролів.' : 'Нічого не знайдено.'}
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#333' },
  platformText: { textAlign: 'center', color: '#888', marginBottom: 15, fontStyle: 'italic' },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fafafa' },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fafafa', marginBottom: 10 },
  passwordInput: { flex: 1, padding: 10 },
  iconBtn: { padding: 10 },
  iconText: { fontSize: 18 },
  searchInput: { borderWidth: 1, borderColor: '#007BFF', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#fff', fontSize: 16 },
  formActions: { flexDirection: 'row', justifyContent: 'space-between' },
  saveBtn: { flex: 1, backgroundColor: '#007BFF', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 5 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { flex: 0.4, backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center', marginLeft: 5 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  cardInfo: { flex: 1, marginRight: 10 },
  serviceText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  infoText: { fontSize: 14, color: '#555', marginBottom: 2 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  toggleVisibilityBtn: { marginLeft: 10, padding: 2 },
  toggleText: { fontSize: 16 },
  actionButtons: { justifyContent: 'space-around', alignItems: 'flex-end' },
  editBtn: { backgroundColor: '#ffc107', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5, marginBottom: 8, minWidth: 60, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#dc3545', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5, minWidth: 60, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20, fontSize: 16 }
});