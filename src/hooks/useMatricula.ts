import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATRICULA_STORAGE_KEY = '@frequencia_app:matricula';

export const useMatricula = () => {
  const [matricula, setMatricula] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função para carregar a matrícula do storage ao iniciar o app
    const loadMatricula = async () => {
      try {
        const storedMatricula = await AsyncStorage.getItem(MATRICULA_STORAGE_KEY);
        if (storedMatricula !== null) {
          setMatricula(storedMatricula);
        }
      } catch (e) {
        console.error('Falha ao carregar a matrícula.', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatricula();
  }, []);

  // Função para salvar uma nova matrícula
  const saveMatricula = async (newMatricula: string) => {
    try {
      await AsyncStorage.setItem(MATRICULA_STORAGE_KEY, newMatricula);
      setMatricula(newMatricula);
    } catch (e) {
      console.error('Falha ao salvar a matrícula.', e);
    }
  };

  // Função para limpar a matrícula
  const clearMatricula = async () => {
    try {
      await AsyncStorage.removeItem(MATRICULA_STORAGE_KEY);
      setMatricula(null);
    } catch (e) {
        console.error('Falha ao limpar a matrícula.', e);
    }
  }

  return { matricula, saveMatricula, clearMatricula, isLoading };
};