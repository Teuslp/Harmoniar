// backend/routes/nutrition.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Os dados de sugestão que antes estavam no frontend, agora vivem no backend.
// O backend é a "fonte da verdade".
const mealSuggestions = {
    emagrecer: {
        dica: "Concentre-se em alimentos ricos em fibras e proteínas para aumentar a saciedade. Beba bastante água.",
        refeicoes: { "Café da Manhã": ["Ovos mexidos com espinafre", "Iogurte grego com frutas vermelhas"], "Almoço": ["Salada de frango grelhado com quinoa", "Sopa de lentilhas"], "Jantar": ["Salmão assado com brócolis", "Peito de peru com legumes no vapor"], "Lanches": ["Maçã com pasta de amendoim", "Mix de castanhas"], }
    },
    manter: {
        dica: "Equilibre carboidratos complexos, proteínas magras e gorduras saudáveis. Mantenha porções moderadas.",
        refeicoes: { "Café da Manhã": ["Aveia com banana e nozes", "Vitamina de frutas com whey protein"], "Almoço": ["Arroz integral, feijão, filé de frango e salada", "Macarrão integral com molho de tomate caseiro"], "Jantar": ["Omelete com queijo branco e tomate", "Carne moída com purê de batata doce"], "Lanches": ["Barra de proteína", "Frutas da estação"], }
    },
    ganharMassa: { // A chave deve corresponder ao enum no modelo User.js
        dica: "Aumente a ingestão calórica com alimentos nutritivos. Faça refeições mais frequentes ao longo do dia.",
        refeicoes: { "Café da Manhã": ["Panquecas de aveia com mel e frutas", "Sanduíche de pão integral com queijo e peito de peru"], "Almoço": ["Macarronada à bolonhesa com queijo parmesão", "Arroz, feijão, bife e batata frita (airfryer)"], "Jantar": ["Risoto de frango", "Lasanha de carne"], "Lanches": ["Vitamina de abacate com leite", "Iogurte com granola e mel"], }
    }
};

// @route   GET api/nutrition
// @desc    Obter os dados de alimentação do utilizador
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('dietFocus weightHistory');
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }

        res.json({
            userFocus: user.dietFocus,
            weightHistory: user.weightHistory,
            suggestions: mealSuggestions[user.dietFocus]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   PUT api/nutrition/focus
// @desc    Atualizar o foco de alimentação do utilizador
// @access  Privado
router.put('/focus', auth, async (req, res) => {
    const { focus } = req.body;
    const validFocuses = ['emagrecer', 'manter', 'ganharMassa'];

    if (!focus || !validFocuses.includes(focus)) {
        return res.status(400).json({ msg: 'Foco inválido.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { dietFocus: focus },
            { new: true }
        ).select('dietFocus');
        
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Nota: A rota para adicionar um novo peso (POST /api/user/weight) que criámos
// mentalmente para o WeightModal.jsx pode ser movida para aqui para melhor organização.
// Por exemplo: POST /api/nutrition/weight

module.exports = router;