// backend/routes/workout.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const User = require('../models/User');

const { generateNewWorkoutPlan } = require('../utils/workoutGenerator'); 

// @route   GET api/workout
// @desc    Obter o plano de treino do utilizador
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ user: req.user.id });

        if (!workout) {
            return res.status(404).json({ msg: 'Nenhum plano de treino encontrado para este utilizador.' });
        }

        res.json({
            workoutPlan: workout.workoutPlan,
            completedDays: workout.completedDays,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/workout/generate
// @desc    Gerar um novo plano de treino
// @access  Privado
router.post('/generate', auth, async (req, res) => {
    const { level, focus } = req.body;
    try {
        const newWorkoutPlan = generateNewWorkoutPlan(level, focus);
        
        const updatedWorkout = await Workout.findOneAndUpdate(
            { user: req.user.id },
            {
                workoutPlan: newWorkoutPlan,
                completedDays: [],
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(updatedWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/workout/complete/:dayKey
// @desc    Marcar/Desmarcar um dia de treino como concluído
// @access  Privado
router.post('/complete/:dayKey', auth, async (req, res) => {
    // ... (código da rota /complete/:dayKey permanece o mesmo)
});


// 👇 ROTA NOVA ADICIONADA AQUI 👇

// @route   POST api/workout/manual
// @desc    Guardar um plano de treino criado manualmente
// @access  Privado
router.post('/manual', auth, async (req, res) => {
    const { workoutPlan } = req.body;

    // Validação básica para garantir que o plano foi enviado
    if (!workoutPlan || Object.keys(workoutPlan).length !== 7) {
        return res.status(400).json({ msg: 'Plano de treino inválido ou incompleto.' });
    }

    try {
        // Usa findOneAndUpdate com 'upsert' para criar ou atualizar o plano do utilizador
        const updatedWorkout = await Workout.findOneAndUpdate(
            { user: req.user.id },
            {
                workoutPlan: workoutPlan,
                completedDays: [], // Limpa os dias concluídos ao guardar um novo plano
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(updatedWorkout);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;