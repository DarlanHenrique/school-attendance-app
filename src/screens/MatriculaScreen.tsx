import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useMatricula } from '../hooks/useMatricula'; // Importamos o hook aqui

export const MatriculaScreen = () => {
  const { saveMatricula } = useMatricula(); 
  const [inputMatricula, setInputMatricula] = useState('');

  const handleLogin = () => {
    if (inputMatricula.trim()) {
      saveMatricula(inputMatricula.trim());
    }
  };

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
        onPress={handleLogin}
      />
    </View>
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