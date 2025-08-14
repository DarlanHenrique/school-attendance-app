// src/screens/HistoricoScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { fetchHistorico, HistoricoEntry } from '../services/api';
import { HistoricoItem } from '../components/HistoricoItem';
import { useMatricula } from '../hooks/useMatricula';

export const HistoricoScreen = () => {
  // MUDANÇA 1: Capturamos o isLoading que vem do hook. Vamos chamá-lo de isMatriculaLoading para ser claro.
  const { matricula, isLoading: isMatriculaLoading } = useMatricula(); 
  
  const [historico, setHistorico] = useState<HistoricoEntry[]>([]);
  // MUDANÇA 2: Este é o nosso loading LOCAL, para a busca do histórico.
  const [isFetching, setIsFetching] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      // MUDANÇA 3: Só tentamos carregar o histórico se a matrícula JÁ ESTIVER disponível.
      if (matricula) {
        try {
          const data = await fetchHistorico(matricula);
          setHistorico(data);
        } catch (err) {
          setError("Não foi possível carregar o histórico.");
        } finally {
          // Independente de sucesso ou erro, a busca do histórico terminou.
          setIsFetching(false);
        }
      }
    };
    
    // MUDANÇA 4: A condição para executar a função mudou.
    // Só executamos se o carregamento da matrícula JÁ TERMINOU (isMatriculaLoading é false).
    if (!isMatriculaLoading) {
      if (matricula) {
        carregarHistorico();
      } else {
        // Se o carregamento da matrícula terminou e ela veio nula, aí sim é um erro.
        setError("Matrícula não encontrada.");
        setIsFetching(false);
      }
    }
  // A dependência agora observa tanto o fim do carregamento da matrícula quanto a própria matrícula.
  }, [matricula, isMatriculaLoading]); 

  // MUDANÇA 5: O indicador de loading principal agora obedece aos DOIS carregamentos.
  if (isMatriculaLoading || isFetching) {
    return <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />;
  }

  // O resto do código permanece igual.
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historico}
        renderItem={({ item }) => <HistoricoItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Meu Histórico de Frequência</Text>}
        ListEmptyComponent={<View style={styles.centered}><Text>Nenhum registro encontrado.</Text></View>}
      />
    </SafeAreaView>
  );
};

// Adicionei um estilo para o texto de erro para melhor visualização.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  }
});