const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/user/me
// @desc    Obter os dados do utilizador autenticado
// @access  Privado
router.get('/me', auth, async (req, res) => {
    try {
        // Esta rota não precisa de validação de entrada, pois não recebe corpo (body)
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// @route   PUT api/user/me
// @desc    Atualizar os dados do utilizador autenticado
// @access  Privado
router.put(
    '/me',
    [
        auth, // O middleware de autenticação primeiro
        // --- Camada de Validação (opcional, só valida se o campo existir) ---
        check('name', 'O nome não pode estar vazio.').optional().not().isEmpty().trim(),
        check('email', 'Por favor, inclua um email válido.').optional().isEmail().normalizeEmail(),
        check('trainingLevel', 'Nível de treino inválido.')
            .optional()
            .isIn(['iniciante', 'intermediario', 'avancado']),
        check('dietFocus', 'Foco de dieta inválido.')
            .optional()
            .isIn(['emagrecer', 'manter', 'ganharMassa']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, trainingLevel, dietFocus } = req.body;

        const profileFields = {};
        if (name) profileFields.name = name;
        if (email) profileFields.email = email;
        if (trainingLevel) profileFields.trainingLevel = trainingLevel;
        if (dietFocus) profileFields.dietFocus = dietFocus;

        try {
            let user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: profileFields },
                { new: true, runValidators: true } // runValidators garante que as regras do Schema são aplicadas
            ).select('-password');

            res.json(user);
        } catch (err) {
            console.error(err.message);
            // Verifica se o erro é de email duplicado
            if (err.codeName === 'DuplicateKey') {
                return res.status(400).json({ errors: [{ msg: 'Este email já está em uso.' }] });
            }
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
);

module.exports = router;