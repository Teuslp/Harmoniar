// backend/routes/workout.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');
const { generateNewWorkoutPlan } = require('../utils/workoutGenerator');

// --- Nova Lógica para Calcular a Sequência ---
const calculateStreak = (completedDates, workoutPlan) => {
    if (!completedDates || completedDates.length === 0) return 0;

    const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => b - a);
    const completedSet = new Set(sortedDates.map(d => {
        d.setHours(0, 0, 0, 0);
        return d.toISOString().slice(0, 10);
    }));

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayString = today.toISOString().slice(0, 10);
    if (completedSet.has(todayString)) {
        streak = 1;
    }

    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - 1);

    for (let i = 0; i < 365; i++) {
        const dateString = currentDate.toISOString().slice(0, 10);
        const dayKey = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'][currentDate.getDay()];
        const isRestDay = !workoutPlan[dayKey] || workoutPlan[dayKey].exercicios.length === 0;

        if (completedSet.has(dateString)) {
            if (streak === 0 && i > 0) break;
            streak++;
        } else if (!isRestDay) {
            if (i === 0 && streak === 1) continue;
            break;
        }

        if (streak === 0 && i > 0) break;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
};

// @route   GET api/workout
// @desc    Obter o plano de treino do utilizador e a sequência
router.get('/', auth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ user: req.user.id });
        if (!workout) {
            return res.status(404).json({ msg: 'Nenhum plano de treino encontrado.' });
        }
        const streak = calculateStreak(workout.completedDays, workout.workoutPlan);
        res.json({
            workoutPlan: workout.workoutPlan,
            completedDays: workout.completedDays,
            streak: streak,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/workout/complete/today
// @desc    Marcar/Desmarcar o treino de HOJE como concluído
router.post('/complete/today', auth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ user: req.user.id });
        if (!workout) return res.status(404).json({ msg: 'Plano de treino não encontrado.' });
        
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedTodayIndex = workout.completedDays.findIndex(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        if (completedTodayIndex > -1) {
            workout.completedDays.splice(completedTodayIndex, 1);
        } else {
            workout.completedDays.push(today);
        }
        
        await workout.save();
        res.json(workout.completedDays);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/workout/generate
// @desc    Gerar um novo plano de treino
router.post('/generate', auth, async (req, res) => {
    const { level, focus } = req.body;
    try {
        const newWorkoutPlan = generateNewWorkoutPlan(level, focus);
        const updatedWorkout = await Workout.findOneAndUpdate(
            { user: req.user.id },
            { workoutPlan: newWorkoutPlan, completedDays: [] },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(updatedWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// @route   POST api/workout/manual
// @desc    Guardar um plano de treino criado manualmente
router.post('/manual', auth, async (req, res) => {
    const { workoutPlan } = req.body;
    if (!workoutPlan || Object.keys(workoutPlan).length !== 7) {
        return res.status(400).json({ msg: 'Plano de treino inválido ou incompleto.' });
    }
    try {
        const updatedWorkout = await Workout.findOneAndUpdate(
            { user: req.user.id },
            { workoutPlan: workoutPlan, completedDays: [] },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(201).json(updatedWorkout);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;