// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Procurar o header 'Authorization'
    const authHeader = req.header('Authorization');

    // 2. Verificar se o header existe e se tem o formato correto ('Bearer token')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Acesso negado: token ausente ou mal formatado.' });
    }

    try {
        // 3. Extrair o token da string "Bearer eyJhbGci..."
        const token = authHeader.split(' ')[1];

        // 4. Verificar o token da mesma forma que antes
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido.' });
    }
};