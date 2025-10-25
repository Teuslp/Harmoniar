// backend/routes/workout.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { WorkoutPlan, WorkoutSession } = require('../models/Workout');
const { generateNewWorkoutPlan } = require('../utils/workoutGenerator');

// --- ROTAS DO PLANO DE TREINO ---

// GET /api/workout/plan - Obter o plano de treino atual
router.get('/plan', auth, async (req, res) => {
    try {
        const plan = await WorkoutPlan.findOne({ user: req.user.id });
        if (!plan) {
            return res.status(404).json({ msg: 'Nenhum plano de treino encontrado.' });
        }
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// POST /api/workout/generate - Gerar um novo plano de treino
router.post('/generate', auth, async (req, res) => {
    const { level, focus } = req.body;
    try {
        const newWorkoutPlan = generateNewWorkoutPlan(level, focus);
        const updatedPlan = await WorkoutPlan.findOneAndUpdate(
            { user: req.user.id },
            { workoutPlan: newWorkoutPlan },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});


// --- ROTAS DE SESSÕES DE TREINO (HISTÓRICO) ---

// POST /api/workout/session - Salvar uma sessão de treino concluída
router.post('/session', auth, async (req, res) => {
    const { workoutName, exercises } = req.body; // `exercises` agora é um array de {name, weight}

    if (!exercises || exercises.length === 0) {
        return res.status(400).json({ msg: 'A sessão de treino precisa conter exercícios.' });
    }

    try {
        const newSession = new WorkoutSession({
            user: req.user.id,
            workoutName,
            exercises,
        });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// GET /api/workout/history/:exerciseName - Obter o histórico de um exercício
router.get('/history/:exerciseName', auth, async (req, res) => {
    try {
        const exerciseName = req.params.exerciseName;
        const sessions = await WorkoutSession.find({
            'user': req.user.id,
            'exercises.name': exerciseName
        }).sort({ date: 1 });

        const historyData = sessions.map(session => {
            const exerciseData = session.exercises.find(ex => ex.name === exerciseName);
            return {
                date: session.date,
                weight: exerciseData.weight, // Agora pegamos o peso principal diretamente
            };
        });

        res.json(historyData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// GET /api/workout/sessions - Obter todas as datas de treinos concluídos
router.get('/sessions', auth, async (req, res) => {
    try {
        const sessions = await WorkoutSession.find({ user: req.user.id }).select('date');
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;