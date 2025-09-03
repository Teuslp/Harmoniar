// backend/routes/mentalHealth.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/mental-health
// @desc    Obter os dados de saúde mental do utilizador (gratidão, pessoas, etc.)
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('motivationalPeople gratitudeEntries');
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }
        res.json({
            motivationalPeople: user.motivationalPeople,
            gratitudeEntries: user.gratitudeEntries,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/mental-health/mood
// @desc    Registar um novo humor e atualizar a data do último registo
// @access  Privado
router.post('/mood', auth, async (req, res) => {
    const { mood } = req.body;
    if (!mood) {
        return res.status(400).json({ msg: 'O campo humor é obrigatório.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }

        user.moodHistory.push({ mood });
        user.lastMoodLogDate = new Date();
        await user.save();
        res.status(201).json({ message: 'Humor guardado com sucesso!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/mental-health/gratitude
// @desc    Adicionar uma nova nota de gratidão
// @access  Privado
router.post('/gratitude', auth, async (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ msg: 'O texto não pode estar vazio.' });
    }

    try {
        const user = await User.findById(req.user.id);
        user.gratitudeEntries.unshift({ text: text.trim() }); // unshift adiciona no início
        await user.save();
        res.status(201).json(user.gratitudeEntries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;