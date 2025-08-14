// src/screens/HistoricoScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
// MUDANÇA: Importamos os novos tipos e o novo item de lista
import { fetchHistorico, HistoricoSection } from '../services/api';
import { HistoricoItemAula } from '../components/HistoricoItemAula'; // Verifique se o nome do arquivo corresponde
import { useMatricula } from '../hooks/useMatricula';

export const HistoricoScreen = () => {
  const { matricula, isLoading: isMatriculaLoading } = useMatricula(); 
  
  // MUDANÇA: O estado agora espera um array do tipo HistoricoSection
  const [historico, setHistorico] = useState<HistoricoSection[]>([]);
  const [isFetching, setIsFetching] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (matricula) {
        try {
          const data = await fetchHistorico(matricula);
          setHistorico(data);
        } catch (err: any) {
          setError(err.message || "Não foi possível carregar o histórico.");
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
      {/* MUDANÇA GIGANTE: Substituímos FlatList por SectionList */}
      <SectionList
        sections={historico}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <HistoricoItemAula item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.replace(/_/g, ' ')}</Text>
        )}
        ListHeaderComponent={<Text style={styles.header}>Meu Histórico de Frequência</Text>}
        ListEmptyComponent={<View style={styles.centered}><Text>Nenhum registro encontrado.</Text></View>}
        stickySectionHeadersEnabled // Faz o cabeçalho da seção "grudar" no topo ao rolar
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
    marginVertical: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  }
});