const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); // Importa as ferramentas de validação
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Registar um novo utilizador
// @access  Público
router.post(
    '/register',
    // --- Camada de Validação ---
    [
        check('name', 'O nome é obrigatório.').not().isEmpty().trim(),
        check('email', 'Por favor, inclua um email válido.').isEmail().normalizeEmail(),
        check('password', 'A password deve ter no mínimo 6 caracteres.').isLength({ min: 6 }),
    ],
    async (req, res) => {
        // Verifica se houve erros na validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Retorna os erros encontrados
        }

        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'Este email já está em uso.' }] });
            }

            user = new User({ name, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5h' },
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({ token, message: 'Utilizador registado com sucesso!' });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
);

// @route   POST api/auth/login
// @desc    Autenticar utilizador e obter token
// @access  Público
router.post(
    '/login',
    // --- Camada de Validação ---
    [
        check('email', 'Por favor, inclua um email válido.').isEmail().normalizeEmail(),
        check('password', 'A password é obrigatória.').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas.' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas.' }] });
            }

            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, message: 'Login bem-sucedido!' });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    }
);

module.exports = router;