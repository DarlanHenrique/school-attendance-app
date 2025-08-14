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
    const { matricula } = req.query;

    if (!matricula) {
      return res.status(400).json({ message: 'A matrícula é obrigatória.' });
    }
    
    const allRecords = await readLog();
    const turmas = await readTurmas();

    const presencasDoAluno = allRecords.filter((r) => r.matricula === matricula);

    const disciplinasDoAluno = Object.keys(turmas).filter(disciplina => 
      turmas[disciplina].some(aluno => aluno.matricula === matricula)
    );

    let historicoCompleto = [];

    for (const disciplina of disciplinasDoAluno) {
      
      const aulasDaDisciplina = allRecords
        .filter(r => r.disciplina === disciplina)
        .reduce((acc, r) => {
          const diaDaAula = r.timestamp.split('T')[0];
          if (!acc.some(aula => aula.data === diaDaAula)) {
            acc.push({
              data: diaDaAula,
              descricao: `${r.dia}, ${r.hora} - Sala: ${r.sala}`
            });
          }
          return acc;
        }, []);

      aulasDaDisciplina.forEach(aula => {
        const estevePresente = presencasDoAluno.some(p => 
          p.disciplina === disciplina && p.timestamp.startsWith(aula.data)
        );

        historicoCompleto.push({
          id: `${matricula}-${disciplina}-${aula.data}`,
          disciplina: disciplina,
          data: aula.data,
          descricao: aula.descricao,
          status: estevePresente ? 'Presente' : 'Falta'
        });
      });
    }

    const groupedHistory = historicoCompleto.reduce((acc, record) => {
      const { disciplina } = record;
      let group = acc.find(g => g.title === disciplina);

      if (!group) {
        group = { title: disciplina, data: [] };
        acc.push(group);
      }
      
      const { disciplina: _, ...aulaData } = record;
      group.data.push(aulaData);
      
      group.data.sort((a, b) => new Date(b.data) - new Date(a.data));
      return acc;
    }, []);
    
    return res.status(200).json(groupedHistory);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};