import axios from 'axios';

const api = axios.create({
  // O seu baseURL está perfeito para testes locais
  baseURL: 'http://192.168.0.106:3000/api', 
  timeout: 10000,
});

// Tipos que definem nosso contrato com a API
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
  title: string; // O nome da disciplina
  data: HistoricoAula[]; // O array de aulas daquela disciplina
};


export const registerFrequency = async (payload: RegisterFrequencyPayload): Promise<void> => {
  try {
    console.log('Enviando para o backend:', payload);
    // MUDANÇA: Ajustei o endpoint para '/registrar' para bater com o nome do nosso arquivo na pasta /api
    const response = await api.post('/registrar', payload);

    if (response.status >= 200 && response.status < 300) {
      console.log('Resposta do backend:', response.data);
      return;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Erro de resposta do servidor:', error.response.data);
        // Agora podemos pegar a mensagem de erro específica do backend!
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

// MUDANÇA PRINCIPAL: Esta função agora busca os dados reais e agrupados!
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