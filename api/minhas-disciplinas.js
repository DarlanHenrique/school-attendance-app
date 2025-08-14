const { promises: fs } = require('fs');
const path = require('path');

const TURMAS_FILE_PATH = path.join(process.cwd(), 'api', 'turmas.json');

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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { matricula } = req.query;

    if (!matricula) {
      return res.status(400).json({ message: 'A matrícula é obrigatória.' });
    }

    const turmas = await readTurmas();

    const disciplinasDoAluno = Object.keys(turmas).filter(disciplina => 
      turmas[disciplina].some(aluno => aluno.matricula === matricula)
    );

    return res.status(200).json(disciplinasDoAluno);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};