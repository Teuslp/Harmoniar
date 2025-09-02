// backend/models/Workout.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema para um único exercício dentro de um plano
const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    series: { type: String, required: true },
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
        ref: 'User', // Cria uma referência ao modelo User
        required: true,
        unique: true, // Cada utilizador tem apenas um plano de treino ativo
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
        type: [String], // ex: ['seg', 'qua']
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);