import React, { useState, useCallback } from 'react';
import { View, Text, SectionList, ActivityIndicator, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchHistorico, HistoricoSection } from '../services/api';
import { HistoricoItemAula } from '../components/HistoricoItemAula';
import { useMatricula } from '../hooks/useMatricula'; 

export const HistoricoScreen = () => {
  const { matricula, isLoading: isMatriculaLoading, clearMatricula } = useMatricula(); 
  
  const [historico, setHistorico] = useState<HistoricoSection[]>([]);
  const [isFetching, setIsFetching] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const carregarHistorico = async () => {
        if (!matricula) {
          setIsFetching(false);
          return;
        }

        setIsFetching(true);
        try {
          const data = await fetchHistorico(matricula);
          setHistorico(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Não foi possível carregar o histórico.");
        } finally {
          setIsFetching(false);
        }
      };
     
      if (!isMatriculaLoading) {
        carregarHistorico();
      }
    }, [matricula, isMatriculaLoading])
  );

  if (isMatriculaLoading || isFetching) {
    return <ActivityIndicator style={styles.centered} size="large" color="#0000ff" />;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={historico}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <HistoricoItemAula item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.replace(/_/g, ' ')}</Text>
        )}
        ListHeaderComponent={<Text style={styles.header}>Meu Histórico de Frequência</Text>}
        ListEmptyComponent={<View style={styles.centered}><Text>Nenhum registro encontrado.</Text></View>}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Button
              title="Sair (Logout)"
              onPress={clearMatricula}
              color="#e74c3c"
            />
          </View>
        }
        stickySectionHeadersEnabled
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
  },
  footerContainer: {
    margin: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  }
});