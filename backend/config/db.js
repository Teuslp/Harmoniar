// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Usa a variável de ambiente para a conexão
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado à MongoDB com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar à MongoDB:', err.message);
        // Se não conseguir conectar, encerra a aplicação. É um erro fatal.
        process.exit(1);
    }
};

module.exports = connectDB;