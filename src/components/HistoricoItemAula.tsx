// src/components/HistoricoItemAula.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HistoricoAula } from '../services/api';

type Props = {
  item: HistoricoAula;
};

// Função para formatar a data (AAAA-MM-DD -> DD/MM/AAAA)
const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

export const HistoricoItemAula = ({ item }: Props) => {
  const isPresente = item.status === 'Presente';
  
  return (
    <View style={styles.container}>
      <View style={[styles.statusIndicator, { backgroundColor: isPresente ? '#2ecc71' : '#e74c3c' }]} />
      <View style={styles.infoContainer}>
        {/* MUDANÇA: Exibe a data da presença e, abaixo, a descrição completa da aula */}
        <Text style={styles.dataText}>Data: {formatDate(item.data)}</Text>
        <Text style={styles.descricaoText}>{item.descricao}</Text>
      </View>
      <Text style={[styles.statusText, { color: isPresente ? '#2ecc71' : '#e74c3c' }]}>
        {item.status.toUpperCase()}
      </Text>
    </View>
  );
};

// Estilos levemente ajustados para a nova estrutura de texto
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  statusIndicator: {
    width: 10,
    height: '100%',
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  dataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descricaoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});