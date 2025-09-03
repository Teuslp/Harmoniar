// backend/models/User.js

const mongoose = require('mongoose');

// --- SUBDOCUMENTOS ---

const WeightHistorySchema = new mongoose.Schema({
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { _id: false });

const MoodHistorySchema = new mongoose.Schema({
    mood: { 
        type: String, 
        required: true, 
        enum: ['feliz', 'neutro', 'triste', 'ansioso', 'motivado']
    },
    date: { type: Date, default: Date.now },
}, { _id: false });

const StudySubjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    weeklyGoal: { type: Number, default: 3, min: 1 },
    progress: { type: Number, default: 0, min: 0 },
    studyLog: { type: [Date], default: [] },
});

// 👇 NOVO SUBDOCUMENTO PARA AS NOTAS DE GRATIDÃO 👇
const GratitudeEntrySchema = new mongoose.Schema({
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

// --- SCHEMA PRINCIPAL DO UTILIZADOR ---

const UserSchema = new mongoose.Schema({
    // --- Dados de Autenticação ---
    name: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido.'],
    },
    password: {
        type: String,
        required: [true, 'A password é obrigatória.'],
        minlength: [6, 'A password deve ter no mínimo 6 caracteres.'],
    },
    
    // --- Dados do Perfil e Configurações ---
    profilePic: {
        type: String,
        default: '',
    },
    trainingLevel: {
        type: String,
        enum: ['iniciante', 'intermediario', 'avancado'],
        default: 'iniciante',
    },
    dietFocus: {
        type: String,
        enum: ['emagrecer', 'manter', 'ganharMassa'],
        default: 'manter',
    },
    lastMoodLogDate: {
        type: Date,
    },

    // --- Dados dos Módulos (usando os subdocumentos) ---
    motivationalPeople: {
        type: [String],
        default: [],
    },
    weightHistory: [WeightHistorySchema],
    moodHistory: [MoodHistorySchema],
    studySubjects: [StudySubjectSchema],

    // 👇 ADIÇÃO DO NOVO CAMPO DE GRATIDÃO 👇
    gratitudeEntries: [GratitudeEntrySchema],

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);