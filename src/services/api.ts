import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.106:3000', 
  timeout: 10000,
});

interface RegisterFrequencyPayload {
  matricula: string;
  qrCodeData: string;
}

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