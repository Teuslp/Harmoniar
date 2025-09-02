// backend/models/Workout.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema para um único exercício dentro de um plano (CORRIGIDO)
const ExerciseSchema = new Schema({
    id: { type: String }, // ALTERADO de Number para String
    name: { type: String, required: true },
    series: { type: String, required: true },
    muscle: { type: String, default: '' }, // ADICIONADO
    description: { type: String, default: '' },
    gifUrl: { type: String, default: '' },
}, { _id: false });

// Schema para o treino de um dia específico
const DailyWorkoutSchema = new Schema({
    nome: { type: String, required: true },
    foco: { type: [String], default: [] },
    tempo: { type: Number, default: 0 },
    exercicios: [ExerciseSchema],
}, { _id: false });

const WorkoutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    workoutPlan: {
        seg: DailyWorkoutSchema,
        ter: DailyWorkoutSchema,
        qua: DailyWorkoutSchema,
        qui: DailyWorkoutSchema,
        sex: DailyWorkoutSchema,
        sab: DailyWorkoutSchema,
        dom: DailyWorkoutSchema,
    },
    completedDays: {
        type: [Date],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);