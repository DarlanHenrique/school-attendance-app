import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { fetchFrequenciaTurma, FrequenciaTurmaResponse, AlunoFrequencia } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

const StatusCell = ({ status }: { status: 'Presente' | 'Falta' }) => (
  <View style={styles.cell}>
    <Icon 
      name={status === 'Presente' ? 'checkmark-circle' : 'close-circle'} 
      size={22} 
      color={status === 'Presente' ? '#27ae60' : '#c0392b'} 
    />
  </View>
);

const AlunoRow = ({ item, index }: { item: AlunoFrequencia; index: number }) => {
  const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

  return (
    <View style={[styles.row, rowStyle]}>
      <View style={styles.nameCell}>
        <Text style={styles.nameText} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.summaryText}>
          {`${item.resumo.presencas}/${item.resumo.totalAulas} (${item.resumo.percentual})`}
        </Text>
      </View>
      {item.frequencia.map((status, idx) => (
        <StatusCell key={idx} status={status} />
      ))}
    </View>
  );
};

export const TurmaHistoricoScreen = ({ route }: any) => {
  const { disciplina } = route.params;
  const [dadosTurma, setDadosTurma] = useState<FrequenciaTurmaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const data = await fetchFrequenciaTurma(disciplina);
        setDadosTurma(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, [disciplina]);

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error || !dadosTurma) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error || 'Dados não encontrados.'}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{dadosTurma.disciplina.replace(/_/g, ' ')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.nameCellHeader}><Text style={styles.headerText}>Aluno</Text></View>
            {dadosTurma.datas.map((data, index) => (
              <View key={index} style={styles.cell}><Text style={styles.headerText}>{data}</Text></View>
            ))}
          </View>
          <FlatList
            data={dadosTurma.alunos}
            keyExtractor={(item) => item.matricula}
            renderItem={({ item, index }) => <AlunoRow item={item} index={index} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, paddingHorizontal: 10 },
  table: { marginHorizontal: 10, paddingBottom: 20 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowEven: { backgroundColor: '#fff' },
  rowOdd: { backgroundColor: '#f9f9f9' },
  cell: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  nameCell: { width: 160, height: 60, justifyContent: 'center', paddingHorizontal: 10 },
  nameCellHeader: { width: 160, height: 60, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#f0f2f5' },
  headerText: { fontWeight: 'bold', color: '#333' },
  nameText: { fontWeight: 'bold', fontSize: 14 },
  summaryText: { fontSize: 12, color: '#666', marginTop: 4 },
});