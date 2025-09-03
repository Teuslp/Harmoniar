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

// 👇 ADICIONE ESTE BLOCO DE CÓDIGO NO FINAL DO FICHEIRO 👇

// @route   POST api/user/weight
// @desc    Adicionar um novo registo de peso para o utilizador
// @access  Privado
router.post('/weight', auth, async (req, res) => {
    const { value } = req.body;

    if (!value || isNaN(parseFloat(value)) || value <= 0) {
        return res.status(400).json({ msg: 'Por favor, forneça um valor de peso válido.' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }

        // Adiciona o novo registo ao histórico de peso
        user.weightHistory.push({ value: parseFloat(value) });

        await user.save();

        res.status(201).json(user.weightHistory);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// 👇 ROTA NOVA ADICIONADA AQUI 👇
// @route   GET api/user/status
// @desc    Obter os dados do utilizador e verificar se precisa de registar o humor
// @access  Privado
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }

        let needsMoodLog = true;
        if (user.lastMoodLogDate) {
            const lastLog = new Date(user.lastMoodLogDate);
            const today = new Date();
            
            // Compara se o último registo foi no mesmo dia, mês e ano de hoje
            if (
                lastLog.getDate() === today.getDate() &&
                lastLog.getMonth() === today.getMonth() &&
                lastLog.getFullYear() === today.getFullYear()
            ) {
                needsMoodLog = false;
            }
        }

        res.json({
            user,
            needsMoodLog,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;