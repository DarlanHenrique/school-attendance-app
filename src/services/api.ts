import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.106:3000/api', 
  timeout: 10000,
});

interface RegisterFrequencyPayload {
  matricula: string;
  qrCodeData: string;
}

export type HistoricoAula = {
  id: string;
  data: string;
  descricao: string;
  status: 'Presente' | 'Falta';
};

export type HistoricoSection = {
  title: string; 
  data: HistoricoAula[]; 
};

export interface AlunoFrequencia {
  nome: string;
  matricula: string;
  frequencia: ('Presente' | 'Falta')[];
  resumo: {
    presencas: number;
    totalAulas: number;
    percentual: string;
  };
}


export interface FrequenciaTurmaResponse {
  disciplina: string;
  datas: string[]; 
  alunos: AlunoFrequencia[];
}

export const registerFrequency = async (payload: RegisterFrequencyPayload): Promise<void> => {
  try {
    console.log('Enviando para o backend:', payload);
    const response = await api.post('/registrar', payload);

    if (response.status >= 200 && response.status < 300) {
      console.log('Resposta do backend:', response.data);
      return;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Erro de resposta do servidor:', error.response.data);
        throw new Error(error.response.data.message || 'O servidor retornou um erro.');
      } else if (error.request) {
        console.error('Erro de rede:', error.request);
        throw new Error('Não foi possível se conectar ao servidor.');
      }
    }
    console.error('Erro inesperado:', error);
    throw new Error('Ocorreu um erro inesperado.');
  }
};

export const fetchHistorico = async (matricula: string): Promise<HistoricoSection[]> => {
  try {
    console.log(`Buscando histórico REAL para a matrícula: ${matricula} no backend...`);
    const response = await api.get(`/historico?matricula=${matricula}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao buscar o histórico.');
      } else if (error.request) {
        throw new Error('Não foi possível se conectar ao servidor para buscar o histórico.');
      }
    }
    throw new Error('Ocorreu um erro inesperado ao carregar o histórico.');
  }
};

export const fetchMinhasDisciplinas = async (matricula: string): Promise<string[]> => {
  try {
    const response = await api.get(`/minhas-disciplinas?matricula=${matricula}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar disciplinas.');
    }
    throw new Error('Ocorreu um erro inesperado ao buscar suas disciplinas.');
  }
};

export const fetchFrequenciaTurma = async (disciplina: string): Promise<FrequenciaTurmaResponse> => {
  try {
    const response = await api.get(`/frequencia-turma?disciplina=${encodeURIComponent(disciplina)}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar frequência da turma.');
    }
    throw new Error('Ocorreu um erro inesperado ao buscar os dados da turma.');
  }
};