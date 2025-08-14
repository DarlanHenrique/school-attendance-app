const { promises: fs } = require('fs');
const path = require('path');

// Caminhos para nossos "bancos de dados"
const LOG_FILE_PATH = path.join('/tmp', 'frequencia.log');
const TURMAS_FILE_PATH = path.join(process.cwd(), 'api', 'turmas.json');

// Funções auxiliares para leitura dos arquivos
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

    // 1. Filtrar apenas as presenças do aluno que está pedindo o histórico
    const presencasDoAluno = allRecords.filter((r) => r.matricula === matricula);

    // 2. Descobrir em quais disciplinas o aluno está matriculado
    const disciplinasDoAluno = Object.keys(turmas).filter(disciplina => 
      turmas[disciplina].some(aluno => aluno.matricula === matricula)
    );

    let historicoCompleto = [];

    // 3. Para cada disciplina que o aluno cursa...
    for (const disciplina of disciplinasDoAluno) {
      
      // 4. ...descobrimos todas as aulas que efetivamente aconteceram para essa disciplina
      // (olhando os registros de todos os alunos)
      const aulasDaDisciplina = allRecords
        .filter(r => r.disciplina === disciplina)
        .reduce((acc, r) => {
          const diaDaAula = r.timestamp.split('T')[0];
          // Adiciona a aula apenas se ela ainda não estiver na lista (para ter aulas únicas)
          if (!acc.some(aula => aula.data === diaDaAula)) {
            acc.push({
              data: diaDaAula,
              descricao: `${r.dia}, ${r.hora} - Sala: ${r.sala}`
            });
          }
          return acc;
        }, []);

      // 5. Para cada aula que aconteceu, verificamos se o aluno estava lá
      aulasDaDisciplina.forEach(aula => {
        const estevePresente = presencasDoAluno.some(p => 
          p.disciplina === disciplina && p.timestamp.startsWith(aula.data)
        );

        // 6. Adicionamos a aula ao histórico completo, com status 'Presente' ou 'Falta'
        historicoCompleto.push({
          id: `${matricula}-${disciplina}-${aula.data}`, // ID único para o registro
          disciplina: disciplina,
          data: aula.data,
          descricao: aula.descricao,
          status: estevePresente ? 'Presente' : 'Falta'
        });
      });
    }

    // 7. Agrupamos o histórico completo (com presenças e faltas) por disciplina
    const groupedHistory = historicoCompleto.reduce((acc, record) => {
      const { disciplina } = record;
      let group = acc.find(g => g.title === disciplina);

      if (!group) {
        group = { title: disciplina, data: [] };
        acc.push(group);
      }
      
      // Remove a propriedade 'disciplina' do objeto da aula, pois já está no título do grupo
      const { disciplina: _, ...aulaData } = record;
      group.data.push(aulaData);
      
      // Ordena as aulas dentro do grupo pela data mais recente
      group.data.sort((a, b) => new Date(b.data) - new Date(a.data));
      return acc;
    }, []);
    
    return res.status(200).json(groupedHistory);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};