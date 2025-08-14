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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { disciplina } = req.query;

    if (!disciplina) {
      return res.status(400).json({ message: 'O nome da disciplina é obrigatório.' });
    }

    const turmas = await readTurmas();
    const allRecords = await readLog();

    const alunosDaTurma = turmas[disciplina];
    if (!alunosDaTurma) {
      return res.status(404).json({ message: 'Disciplina não encontrada.' });
    }

    const datasDasAulas = allRecords
      .filter(r => r.disciplina === disciplina)
      .map(r => r.timestamp.split('T')[0])
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();

    const frequenciaDaTurma = alunosDaTurma.map(aluno => {
      let presencas = 0;

      const frequenciaDoAluno = datasDasAulas.map(data => {
        const registro = allRecords.find(r => 
          r.matricula === aluno.matricula &&
          r.disciplina === disciplina &&
          r.timestamp.startsWith(data)
        );
        
        if (registro) {
          presencas++;
          return 'Presente';
        }
        return 'Falta';
      });

      const totalDeAulas = datasDasAulas.length;
      const percentual = totalDeAulas > 0 ? Math.round((presencas / totalDeAulas) * 100) : 0;

      return {
        nome: aluno.nome,
        matricula: aluno.matricula,
        frequencia: frequenciaDoAluno,
        resumo: {
          presencas: presencas,
          totalAulas: totalDeAulas,
          percentual: `${percentual}%`
        }
      };
    });
    
    const resposta = {
      disciplina: disciplina,
      datas: datasDasAulas.map(d => d.split('-').slice(1).join('/')),
      alunos: frequenciaDaTurma,
    };

    return res.status(200).json(resposta);

  } catch (error) {
    console.error('Erro no endpoint /api/frequencia-turma:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};