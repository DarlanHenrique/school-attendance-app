import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useMatricula } from './src/hooks/useMatricula';

const ScannerScreen = ({ matricula }: { matricula: string }) => {
    return <Text>Logado com a matrícula: {matricula}. Pronto para escanear!</Text>
}

const App = () => {
  const { matricula, saveMatricula, isLoading } = useMatricula();
  const [inputMatricula, setInputMatricula] = useState('');

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (matricula) {
    return <ScannerScreen matricula={matricula} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>
        Digite sua Matrícula
      </Text>
      <TextInput
        placeholder="Ex: 20241010"
        value={inputMatricula}
        onChangeText={setInputMatricula}
        style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
        keyboardType="numeric"
      />
      <Button
        title="Salvar e Entrar"
        onPress={() => {
            if(inputMatricula.trim()){
                saveMatricula(inputMatricula.trim());
            }
        }}
      />
    </View>
  );
};

export default App;