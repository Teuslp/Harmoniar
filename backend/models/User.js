const mongoose = require('mongoose');

// --- SUBDOCUMENTOS (para melhor organização) ---

const WeightHistorySchema = new mongoose.Schema({
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { _id: false }); // _id: false para não criar IDs para cada entrada do histórico

const MoodHistorySchema = new mongoose.Schema({
    mood: { 
        type: String, 
        required: true, 
        enum: ['feliz', 'neutro', 'triste', 'ansioso', 'motivado'] // Sugestão: expandir humores
    },
    date: { type: Date, default: Date.now },
}, { _id: false });

const StudySubjectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    weeklyGoal: { type: Number, default: 3, min: 1 }, // Meta deve ser pelo menos 1
    progress: { type: Number, default: 0, min: 0 },
    studyLog: { type: [Date], default: [] },
}); // Aqui mantemos o _id para poder identificar/editar matérias individualmente

// --- SCHEMA PRINCIPAL DO UTILIZADOR ---

const UserSchema = new mongoose.Schema({
    // --- Dados de Autenticação ---
    name: {
        type: String,
        required: [true, 'O nome é obrigatório.'], // Mensagem de erro personalizada
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório.'],
        unique: true,
        trim: true,
        lowercase: true, // Garante consistência para o índice 'unique'
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

    // --- Dados dos Módulos (usando os subdocumentos) ---
    motivationalPeople: {
        type: [String],
        default: [],
    },
    weightHistory: [WeightHistorySchema],
    moodHistory: [MoodHistorySchema],
    studySubjects: [StudySubjectSchema],

}, { timestamps: true }); // Adiciona createdAt e updatedAt

module.exports = mongoose.model('User', UserSchema);