// backend/models/Workout.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- SCHEMA PARA O PLANO DE TREINO (O QUE O USUÁRIO DEVE FAZER) ---

const PlannedExerciseSchema = new Schema({
    id: { type: String },
    name: { type: String, required: true },
    series: { type: String, required: true },
    muscle: { type: String },
    description: { type: String },
    gifUrl: { type: String },
}, { _id: false });

const DailyWorkoutPlanSchema = new Schema({
    nome: { type: String, required: true },
    foco: { type: [String] },
    exercicios: [PlannedExerciseSchema],
}, { _id: false });

const WorkoutPlanSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    workoutPlan: {
        seg: DailyWorkoutPlanSchema,
        ter: DailyWorkoutPlanSchema,
        qua: DailyWorkoutPlanSchema,
        qui: DailyWorkoutPlanSchema,
        sex: DailyWorkoutPlanSchema,
        sab: DailyWorkoutPlanSchema,
        dom: DailyWorkoutPlanSchema,
    },
}, { timestamps: true });


// --- SCHEMA PARA A SESSÃO DE TREINO (O QUE O USUÁRIO REALMENTE FEZ) ---

const PerformedExerciseSchema = new Schema({
    name: { type: String, required: true },
    // A mudança principal: em vez de um array de séries, guardamos apenas o peso principal
    weight: { type: Number, required: true }, 
}, { _id: false });

const WorkoutSessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: { type: Date, default: Date.now },
    workoutName: { type: String }, // Ex: "Peito e Tríceps"
    exercises: [PerformedExerciseSchema],
});

// Exportamos os dois modelos em um objeto para uso nas rotas
module.exports = {
    WorkoutPlan: mongoose.model('WorkoutPlan', WorkoutPlanSchema),
    WorkoutSession: mongoose.model('WorkoutSession', WorkoutSessionSchema),
};