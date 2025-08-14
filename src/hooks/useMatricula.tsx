import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATRICULA_STORAGE_KEY = '@frequencia_app:matricula';

interface MatriculaContextData {
  matricula: string | null;
  isLoading: boolean;
  saveMatricula: (matricula: string) => Promise<void>;
  clearMatricula: () => Promise<void>;
}

const MatriculaContext = createContext<MatriculaContextData>({} as MatriculaContextData);

export const MatriculaProvider = ({ children }: { children: ReactNode }) => {
  const [matricula, setMatricula] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatricula = async () => {
      try {
        const storedMatricula = await AsyncStorage.getItem(MATRICULA_STORAGE_KEY);
        setMatricula(storedMatricula);
      } catch (e) {
        console.error('Falha ao carregar a matrícula.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatricula();
  }, []);

  const saveMatricula = async (newMatricula: string) => {
    try {
      await AsyncStorage.setItem(MATRICULA_STORAGE_KEY, newMatricula);
      setMatricula(newMatricula);
    } catch (e) {
      console.error('Falha ao salvar a matrícula.', e);
    }
  };

  const clearMatricula = async () => {
    try {
      await AsyncStorage.removeItem(MATRICULA_STORAGE_KEY);
      setMatricula(null);
    } catch (e) {
      console.error('Falha ao limpar a matrícula.', e);
    }
  };

  return (
    <MatriculaContext.Provider value={{ matricula, isLoading, saveMatricula, clearMatricula }}>
      {children}
    </MatriculaContext.Provider>
  );
};

export const useMatricula = () => {
  const context = useContext(MatriculaContext);
  if (!context) {
    throw new Error('useMatricula deve ser usado dentro de um MatriculaProvider');
  }
  return context;
};