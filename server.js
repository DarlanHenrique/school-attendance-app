// server.js
const express = require('express');
const path = require('path');

// Importamos a lógica dos nossos arquivos da API
const registrarHandler = require('./api/registrar');
const historicoHandler = require('./api/historico');

const app = express();
const PORT = 3000;

// Middleware para o Express entender requisições com corpo em JSON
app.use(express.json());

// --- DEFINIÇÃO DAS NOSSAS ROTAS ---

// Quando uma requisição POST chegar em '/api/registrar'...
app.post('/api/registrar', (req, res) => {
  // ...execute a lógica do nosso arquivo registrar.js
  registrarHandler(req, res);
});

// Quando uma requisição GET chegar em '/api/historico'...
app.get('/api/historico', (req, res) => {
  // ...execute a lógica do nosso arquivo historico.js
  historicoHandler(req, res);
});


// Inicia o servidor e fica escutando na porta 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log(`  POST http://localhost:${PORT}/api/registrar`);
  console.log(`  GET  http://localhost:${PORT}/api/historico`);
});