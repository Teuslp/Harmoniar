// backend/utils/workoutGenerator.js

const { exerciseCatalog } = require('./exerciseCatalog');

// --- Funções Auxiliares ---

// 1. Função para buscar todos os exercícios de um músculo específico no catálogo
const getExercisesByMuscle = (muscle) => {
    const allExercises = [];
    for (const category of exerciseCatalog) {
        if (category.category.toLowerCase().includes(muscle.toLowerCase())) {
            for (const subCategory of category.subCategories) {
                allExercises.push(...subCategory.exercises);
            }
        }
    }
    return allExercises;
};

// 2. Função para pegar uma quantidade aleatória de exercícios de uma lista
const getRandomExercises = (list, count) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// 3. Função para definir o volume (séries x reps) com base no foco
const getVolume = (focus) => {
    switch (focus) {
        case 'ganharMassa':
            return '4x8-12';
        case 'emagrecer':
            return '3x15-20';
        case 'manter':
        default:
            return '3x12-15';
    }
};


// --- Função Principal de Geração de Treino ---

const generateNewWorkoutPlan = (level, focus) => {
    const volume = getVolume(focus);
    let workoutPlan = {};

    // Mapeamento de músculos para categorias do catálogo
    const peitoEx = getExercisesByMuscle('peito');
    const costasEx = getExercisesByMuscle('costas');
    const ombrosEx = getExercisesByMuscle('ombros');
    const bicepsEx = getExercisesByMuscle('bíceps');
    const tricepsEx = getExercisesByMuscle('tríceps');
    const pernasEx = getExercisesByMuscle('pernas');
    const cardioEx = getExercisesByMuscle('cardio');

    switch (level) {
        case 'iniciante':
            // Split: Full Body A / Descanso / Full Body B / Descanso / Full Body A
            const treinoA = [
                ...getRandomExercises(peitoEx, 2),
                ...getRandomExercises(costasEx, 2),
                ...getRandomExercises(pernasEx, 2),
            ].map(ex => ({ ...ex, series: volume }));

            const treinoB = [
                ...getRandomExercises(ombrosEx, 2),
                ...getRandomExercises(bicepsEx, 1),
                ...getRandomExercises(tricepsEx, 1),
                ...getRandomExercises(pernasEx, 1),
            ].map(ex => ({ ...ex, series: volume }));

            workoutPlan = {
                seg: { nome: 'Full Body A', foco: ['Geral'], tempo: 50, exercicios: treinoA },
                ter: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
                qua: { nome: 'Full Body B', foco: ['Geral'], tempo: 50, exercicios: treinoB },
                qui: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
                sex: { nome: 'Full Body A', foco: ['Geral'], tempo: 50, exercicios: treinoA }, // Repete o A
                sab: { nome: 'Cardio Leve', foco: ['Cardio'], tempo: 30, exercicios: getRandomExercises(cardioEx, 1) },
                dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
            };
            break;

        case 'intermediario':
            // Split: Superior A / Inferior A / Descanso / Superior B / Inferior B
            const superiorA = [
                ...getRandomExercises(peitoEx, 2),
                ...getRandomExercises(ombrosEx, 2),
                ...getRandomExercises(tricepsEx, 2),
            ].map(ex => ({ ...ex, series: volume }));

            const inferiorA = [
                ...getRandomExercises(getExercisesByMuscle('quadríceps'), 2),
                ...getRandomExercises(getExercisesByMuscle('posterior'), 2),
                ...getRandomExercises(getExercisesByMuscle('panturrilhas'), 1),
            ].map(ex => ({ ...ex, series: volume }));

             const superiorB = [
                ...getRandomExercises(costasEx, 3),
                ...getRandomExercises(bicepsEx, 2),
            ].map(ex => ({ ...ex, series: volume }));

            const inferiorB = [
                ...getRandomExercises(getExercisesByMuscle('glúteos'), 2),
                ...getRandomExercises(pernasEx, 2),
                ...getRandomExercises(getExercisesByMuscle('panturrilhas'), 1),
            ].map(ex => ({ ...ex, series: volume }));

            workoutPlan = {
                seg: { nome: 'Superior (Peito/Ombro)', foco: ['Peito', 'Ombros'], tempo: 60, exercicios: superiorA },
                ter: { nome: 'Inferior (Quadríceps)', foco: ['Pernas'], tempo: 60, exercicios: inferiorA },
                qua: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
                qui: { nome: 'Superior (Costas/Bíceps)', foco: ['Costas', 'Bíceps'], tempo: 60, exercicios: superiorB },
                sex: { nome: 'Inferior (Glúteos)', foco: ['Pernas', 'Glúteos'], tempo: 60, exercicios: inferiorB },
                sab: { nome: 'Cardio Opcional', foco: ['Cardio'], tempo: 30, exercicios: getRandomExercises(cardioEx, 1) },
                dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
            };
            break;
            
        case 'avancado':
        default:
            // Split: Push (Empurrar) / Pull (Puxar) / Legs (Pernas)
            const push = [
                ...getRandomExercises(peitoEx, 3),
                ...getRandomExercises(ombrosEx, 2),
                ...getRandomExercises(tricepsEx, 2),
            ].map(ex => ({ ...ex, series: volume }));
            
            const pull = [
                ...getRandomExercises(costasEx, 3),
                ...getRandomExercises(bicepsEx, 2),
            ].map(ex => ({ ...ex, series: volume }));

            const legs = [
                ...getRandomExercises(getExercisesByMuscle('quadríceps'), 2),
                ...getRandomExercises(getExercisesByMuscle('posterior'), 2),
                ...getRandomExercises(getExercisesByMuscle('glúteos'), 1),
                ...getRandomExercises(getExercisesByMuscle('panturrilhas'), 1),
            ].map(ex => ({ ...ex, series: volume }));

            workoutPlan = {
                seg: { nome: 'Push (Empurrar)', foco: ['Peito', 'Ombros', 'Tríceps'], tempo: 75, exercicios: push },
                ter: { nome: 'Pull (Puxar)', foco: ['Costas', 'Bíceps'], tempo: 75, exercicios: pull },
                qua: { nome: 'Legs (Pernas)', foco: ['Pernas', 'Glúteos'], tempo: 75, exercicios: legs },
                qui: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
                sex: { nome: 'Push (Foco Ombros)', foco: ['Ombros', 'Peito'], tempo: 60, exercicios: getRandomExercises(push, 5) },
                sab: { nome: 'Pull (Foco Costas)', foco: ['Costas'], tempo: 60, exercicios: getRandomExercises(pull, 5) },
                dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
            };
            break;
    }
    return workoutPlan;
};

module.exports = { generateNewWorkoutPlan };