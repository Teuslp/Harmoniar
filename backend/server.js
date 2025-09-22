// server.js
require('dotenv').config(); // Carrega as variáveis de ambiente primeiro
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Importa o helmet para segurança
const connectDB = require('./config/db'); // Importa a nossa função de conexão

// --- VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE ---
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missingEnv = requiredEnv.filter(varName => !process.env[varName]);
if (missingEnv.length > 0) {
    console.error(`Erro: Variáveis de ambiente em falta: ${missingEnv.join(', ')}`);
    process.exit(1);
}

// --- INICIALIZAÇÃO DA APP E CONEXÃO À DB ---
const app = express();
connectDB(); // Executa a conexão com a base de dados

// --- MIDDLEWARES ESSENCIAIS ---
app.use(helmet()); // Adiciona uma camada de segurança nos headers HTTP
app.use(cors()); // Permite requisições de diferentes origens (ex: o seu frontend)
app.use(express.json()); // Permite ao servidor processar JSON

// --- ROTAS DA API ---
// Rota de "saúde" para verificar se a API está online
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'API do Harmoniar está a funcionar!' });
});

// Importação e utilização das rotas da aplicação
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); 
app.use('/api/mental-health', require('./routes/mentalHealth'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/nutrition', require('./routes/nutrition'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/study', require('./routes/study')); 

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});