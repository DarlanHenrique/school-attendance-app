// server.js
const express = require('express');
const path = require('path');

// Importamos a lógica dos nossos arquivos da API
const registrarHandler = require('./api/registrar');
const historicoHandler = require('./api/historico');
const minhasDisciplinasHandler = require('./api/minhas-disciplinas');
const frequenciaTurmaHandler = require('./api/frequencia-turma');

const app = express();
const PORT = 3000;

app.use(express.json());

// --- DEFINIÇÃO DAS NOSSAS ROTAS ---

app.post('/api/registrar', (req, res) => {
  registrarHandler(req, res);
});

app.get('/api/historico', (req, res) => {
  historicoHandler(req, res);
});

// MUDANÇA: Adicionamos a nova rota GET para as disciplinas
app.get('/api/minhas-disciplinas', (req, res) => {
  minhasDisciplinasHandler(req, res);
});

app.get('/api/frequencia-turma', (req, res) => {
  frequenciaTurmaHandler(req, res);
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log(`  POST http://localhost:${PORT}/api/registrar`);
  console.log(`  GET  http://localhost:${PORT}/api/historico`);
  // MUDANÇA: Mostra o novo endpoint no log
  console.log(`  GET  http://localhost:${PORT}/api/minhas-disciplinas`);
});