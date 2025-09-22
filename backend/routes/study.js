// backend/routes/study.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   GET api/study
// @desc    Obter todas as matérias de estudo do utilizador
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('studySubjects');
        if (!user) {
            return res.status(404).json({ msg: 'Utilizador não encontrado.' });
        }
        
        // Vamos retornar os dados num formato similar ao que o frontend espera
        const studiedDates = user.studySubjects.flatMap(subject => 
            subject.studyLog.map(log => log.date.toISOString().slice(0, 10))
        );
        const uniqueStudiedDates = [...new Set(studiedDates)];

        res.json({
            subjects: user.studySubjects,
            studiedDates: uniqueStudiedDates,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/study/subjects
// @desc    Adicionar uma nova matéria de estudo
// @access  Privado
router.post(
    '/subjects',
    [
        auth,
        check('name', 'O nome da matéria é obrigatório.').not().isEmpty().trim(),
        check('weeklyGoal', 'A meta semanal deve ser um número maior que 0.').isInt({ min: 1 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { name, weeklyGoal } = req.body;
        const newSubject = { name, weeklyGoal };

        try {
            const user = await User.findById(req.user.id);
            user.studySubjects.push(newSubject);
            await user.save();
            res.status(201).json(user.studySubjects);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
        }
    }
);

// @route   PUT api/study/subjects/:id
// @desc    Atualizar uma matéria de estudo
// @access  Privado
router.put('/subjects/:id', auth, async (req, res) => {
    const { name, weeklyGoal } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const subject = user.studySubjects.id(req.params.id);

        if (!subject) {
            return res.status(404).json({ msg: 'Matéria não encontrada.' });
        }
        if (name) subject.name = name;
        if (weeklyGoal) subject.weeklyGoal = weeklyGoal;
        
        await user.save();
        res.json(user.studySubjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   DELETE api/study/subjects/:id
// @desc    Apagar uma matéria de estudo
// @access  Privado
router.delete('/subjects/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.studySubjects.pull({ _id: req.params.id }); // Remove a matéria do array
        await user.save();
        res.json({ msg: 'Matéria removida com sucesso.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


// --- ROTAS NOVAS E MELHORADAS ---

// @route   POST api/study/log-session
// @desc    Regista uma sessão de estudo detalhada
// @access  Privado
router.post('/log-session', auth, async (req, res) => {
    const { subjectId, duration, objective, completedObjective } = req.body;
    
    if (!subjectId || !duration) {
        return res.status(400).json({ msg: 'ID da matéria e duração são obrigatórios.' });
    }

    try {
        const user = await User.findById(req.user.id);
        const subject = user.studySubjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({ msg: 'Matéria não encontrada.' });
        }

        const newLogEntry = { duration, objective, completedObjective };
        subject.studyLog.push(newLogEntry);
        await user.save();
        res.status(201).json(subject);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   GET api/study/stats
// @desc    Obter estatísticas de estudo para o dashboard
// @access  Privado
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('studySubjects');
        if (!user || !user.studySubjects) {
            return res.json({ timePerSubject: {}, dailySummary: {} });
        }

        const stats = {
            timePerSubject: {}, // Para o gráfico de pizza
            dailySummary: {},   // Para o gráfico de barras
        };

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Inicia na Segunda
        startOfWeek.setHours(0, 0, 0, 0);

        user.studySubjects.forEach(subject => {
            // Inicializa o tempo para cada matéria para que todas apareçam no gráfico
            if (!stats.timePerSubject[subject.name]) {
                stats.timePerSubject[subject.name] = 0;
            }

            subject.studyLog.forEach(log => {
                if (log.date >= startOfWeek) {
                    stats.timePerSubject[subject.name] += log.duration;
                    
                    const dayOfWeek = log.date.getDay(); // 0=Dom, 1=Seg, ...
                    stats.dailySummary[dayOfWeek] = (stats.dailySummary[dayOfWeek] || 0) + log.duration;
                }
            });
        });

        res.json(stats);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;