// backend/routes/exercises.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Importa o nosso novo catálogo estruturado
const { exerciseCatalog } = require('../utils/exerciseCatalog');

// @route   GET api/exercises
// @desc    Obter o catálogo completo e categorizado de exercícios
// @access  Privado
router.get('/', auth, (req, res) => {
    try {
        // Envia o catálogo completo
        res.json(exerciseCatalog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;