// backend/routes/mentalHealth.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware para proteger a rota

// @route   POST api/mental-health/mood
// @desc    Registar um novo humor para o utilizador
// @access  Privado
router.post('/mood', auth, async (req, res) => {
    const { mood } = req.body;

    // Validação simples para começar
    if (!mood) {
        return res.status(400).json({ msg: 'O campo humor é obrigatório.' });
    }

    try {
        // AQUI virá a lógica para guardar no banco de dados.
        // Por agora, vamos apenas simular o sucesso.
        console.log(`Humor recebido do user ${req.user.id}: ${mood}`);

        // Envia uma resposta de sucesso
        res.status(201).json({ message: 'Humor guardado com sucesso!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;