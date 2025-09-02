// backend/routes/exercises.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importa a nossa lista de exercícios do ficheiro de utils
const { exerciseDB } = require('../utils/workoutGenerator');

// @route   GET api/exercises
// @desc    Obter a lista de todos os exercícios disponíveis
// @access  Privado
router.get('/', auth, (req, res) => {
    try {
        // Converte o objeto de exercícios num array para ser mais fácil de usar no frontend
        const exerciseList = Object.values(exerciseDB);
        res.json(exerciseList);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;