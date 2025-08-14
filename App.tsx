import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useMatricula } from './src/hooks/useMatricula';
import { ScannerScreen } from './src/screens/ScannerScreen';

const LoginScreen = ({ onLogin }: { onLogin: (matricula: string) => void }) => {
  const [inputMatricula, setInputMatricula] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digite sua Matrícula</Text>
      <TextInput
        placeholder="Ex: 20241010"
        value={inputMatricula}
        onChangeText={setInputMatricula}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button
        title="Salvar e Entrar"
        onPress={() => {
          if (inputMatricula.trim()) {
            onLogin(inputMatricula.trim());
          }
        }}
      />
    </View>
  );
};

const App = () => {
  const { matricula, saveMatricula, isLoading } = useMatricula();

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <>
      {matricula ? (
        <ScannerScreen matricula={matricula} />
      ) : (
        <LoginScreen onLogin={saveMatricula} />
      )}
      
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20
  }
});

export default App;