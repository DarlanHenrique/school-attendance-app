import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useMatricula } from '../hooks/useMatricula';
import { fetchMinhasDisciplinas } from '../services/api';

export const DisciplinasListScreen = ({ navigation }: any) => {
  const { matricula } = useMatricula();
  const [disciplinas, setDisciplinas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDisciplinas = async () => {
      if (!matricula) return; 

      try {
        const data = await fetchMinhasDisciplinas(matricula);
        setDisciplinas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDisciplinas();
  }, [matricula]); 

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <FlatList
      data={disciplinas}
      keyExtractor={(item) => item}
      ListHeaderComponent={<Text style={styles.header}>Selecione uma disciplina</Text>}
      ListEmptyComponent={<View style={styles.centered}><Text>Você não está matriculado em nenhuma disciplina.</Text></View>}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.itemContainer}
          onPress={() => navigation.navigate('TurmaHistorico', { disciplina: item })}
        >
          <Text style={styles.itemText}>{item.replace(/_/g, ' ')}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: 'red', fontSize: 16 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  itemContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
  },
});