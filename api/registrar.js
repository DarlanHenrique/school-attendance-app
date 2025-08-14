const { promises: fs } = require('fs');
const path = require('path');

const LOG_FILE_PATH = path.join('/tmp', 'frequencia.log');
const TURMAS_FILE_PATH = path.join(process.cwd(), 'api', 'turmas.json');

const readLog = async () => {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, 'utf-8');
    return data.split('\n').filter(Boolean).map(JSON.parse);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const readTurmas = async () => {
  try {
    const data = await fs.readFile(TURMAS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler o arquivo de turmas:', error);
    throw new Error('Não foi possível carregar a lista de turmas.');
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { matricula, qrCodeData } = req.body;

    if (!matricula || !qrCodeData) {
      return res.status(400).json({ message: 'Matrícula e qrCodeData são obrigatórios.' });
    }

    console.log('--- DADOS DO QR CODE RECEBIDO ---');
    console.log(`String Bruta: "${qrCodeData}"`);
    console.log(`Tamanho da String: ${qrCodeData.length}`);
    console.log('------------------------------------');

    let dadosDoQrCode;
    try {
      dadosDoQrCode = JSON.parse(qrCodeData.trim());
    } catch (e) {
      console.error('Falha no JSON.parse:', e);
      return res.status(400).json({ message: 'QR Code não contém um JSON válido.' });
    }

    const { disciplina, dia, hora, token, sala } = dadosDoQrCode;

    if (!disciplina || !dia || !hora || !token) {
      return res.status(400).json({ message: 'JSON do QR Code com dados ausentes.' });
    }

    const turmas = await readTurmas();
    const alunosDaDisciplina = turmas[disciplina];

    if (!alunosDaDisciplina) {
      return res.status(400).json({ message: `A disciplina '${disciplina}' do QR Code não foi encontrada no sistema.` });
    }

    const alunoEstaMatriculado = alunosDaDisciplina.some(
      (aluno) => aluno.matricula === matricula
    );

    if (!alunoEstaMatriculado) {
      return res.status(403).json({ message: `Sua matrícula não consta na disciplina de ${disciplina}.` });
    }

    const allRecords = await readLog();
    const hoje = new Date().toISOString().split('T')[0];

    const jaRegistrou = allRecords.some(
      (record) =>
        record.matricula === matricula &&
        record.disciplina === disciplina &&
        record.timestamp.startsWith(hoje)
    );

    if (jaRegistrou) {
      return res.status(409).json({ message: `Presença já registrada para ${disciplina} hoje.` });
    }

    const newRecord = {
      id: Date.now().toString(),
      matricula,
      timestamp: new Date().toISOString(),
      status: 'Presente',
      disciplina,
      dia,
      hora,
      sala: sala || 'Não informada',
    };

    await fs.appendFile(LOG_FILE_PATH, JSON.stringify(newRecord) + '\n');
    return res.status(201).json({ message: 'Presença registrada com sucesso!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};