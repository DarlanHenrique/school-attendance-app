import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { fetchHistorico, HistoricoEntry } from '../services/api';
import { HistoricoItem } from '../components/HistoricoItem';
import { useMatricula } from '../hooks/useMatricula';

export const HistoricoScreen = () => {
  const { matricula, isLoading: isMatriculaLoading } = useMatricula(); 
  
  const [historico, setHistorico] = useState<HistoricoEntry[]>([]);
  const [isFetching, setIsFetching] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (matricula) {
        try {
          const data = await fetchHistorico(matricula);
          setHistorico(data);
        } catch (err) {
          setError("Não foi possível carregar o histórico.");
        } finally {
          setIsFetching(false);
        }
      }
    };
    
    if (!isMatriculaLoading) {
      if (matricula) {
        carregarHistorico();
      } else {
        setError("Matrícula não encontrada.");
        setIsFetching(false);
      }
    }
  }, [matricula, isMatriculaLoading]); 

  if (isMatriculaLoading || isFetching) {
    return <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />;
  }

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