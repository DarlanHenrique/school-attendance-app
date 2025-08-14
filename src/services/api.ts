import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.106:3000', 
  timeout: 10000,
});

interface RegisterFrequencyPayload {
  matricula: string;
  qrCodeData: string;
}

export type HistoricoEntry = {
  id: string;
  data: string;
  disciplina: string;
  status: 'Presente' | 'Falta';
};

const mockHistoricoData: HistoricoEntry[] = [
  { id: '1', data: '2025-08-14', disciplina: 'Desenvolvimento Mobile', status: 'Presente' },
  { id: '2', data: '2025-08-12', disciplina: 'Desenvolvimento Mobile', status: 'Presente' },
  { id: '3', data: '2025-08-07', disciplina: 'Desenvolvimento Mobile', status: 'Falta' },
  { id: '4', data: '2025-08-05', disciplina: 'Desenvolvimento Mobile', status: 'Presente' },
  { id: '5', data: '2025-07-31', disciplina: 'Desenvolvimento Mobile', status: 'Presente' },
  { id: '6', data: '2025-07-29', disciplina: 'Desenvolvimento Mobile', status: 'Presente' },
];

/**
 * Função para registrar a frequência de um aluno.
 * Ela encapsula a chamada de API e o tratamento de erros.
 * @param payload - Os dados contendo matrícula e o código do QR Code.
 * @returns Retorna uma promessa que resolve em caso de sucesso.
 * @throws Lança um erro com uma mensagem amigável em caso de falha.
 */
export const registerFrequency = async (payload: RegisterFrequencyPayload): Promise<void> => {
  try {
    console.log('Enviando para o backend:', payload);
    // Faz a requisição POST para o endpoint '/frequencia'
    const response = await api.post('/frequencias', payload);

    // Verifica se o backend respondeu com sucesso (código 2xx)
    if (response.status >= 200 && response.status < 300) {
      console.log('Resposta do backend:', response.data);
      return;
    }
  } catch (error) {
    // Tratamento de erros
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // O servidor respondeu com um código de erro (400, 401, 404, 500, etc.)
        console.error('Erro de resposta do servidor:', error.response.data);
        throw new Error('O servidor retornou um erro. Verifique os dados e tente novamente.');
      } else if (error.request) {
        // A requisição foi feita, mas não houve resposta (sem conexão, por exemplo)
        console.error('Erro de rede:', error.request);
        throw new Error('Não foi possível se conectar ao servidor. Verifique sua internet.');
      }
    }
    // Erro inesperado
    console.error('Erro inesperado:', error);
    throw new Error('Ocorreu um erro inesperado. Tente novamente mais tarde.');
  }
};

export const fetchHistorico = (matricula: string): Promise<HistoricoEntry[]> => {
  console.log(`Buscando histórico para a matrícula: ${matricula}...`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Dados mockados retornados com sucesso!');
      resolve(mockHistoricoData);
    }, 1500);
  });
};