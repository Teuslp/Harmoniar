// backend/utils/workoutGenerator.js

// 1. A sua base de dados de exercícios, agora a viver no backend.
const exerciseDB = {
    peito: { id: 1, name: 'Supino Reto', series: '4x10', muscle: 'Peito', description: 'Deite-se no banco, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Supino+Reto' },
    costas: { id: 4, name: 'Puxada Alta', series: '4x10', muscle: 'Costas', description: 'Sente-se na máquina de puxada, segure a barra com uma pegada aberta.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Puxada+Alta' },
    pernas: { id: 6, name: 'Agachamento Livre', series: '4x10', muscle: 'Pernas', description: 'Com a barra apoiada nos ombros, agache como se fosse sentar numa cadeira.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Agachamento' },
    biceps: { id: 5, name: 'Rosca Direta', series: '3x12', muscle: 'Bíceps', description: 'Em pé, segure a barra com as palmas das mãos para cima.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Rosca+Direta' },
    triceps: { id: 3, name: 'Tríceps Pulley', series: '4x10', muscle: 'Tríceps', description: 'Em pé, de frente para a polia alta, segure a barra com as mãos próximas.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Pulley' },
    ombros: { id: 8, name: 'Desenvolvimento Militar', series: '4x10', muscle: 'Ombros', description: 'Sentado ou em pé, segure a barra na altura dos ombros.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Desenvolvimento' },
    cardio: { id: 9, name: 'Corrida na Esteira', series: '25 min', muscle: 'Cardio', description: 'Corra em um ritmo constante que desafie sua resistência cardiovascular.', gifUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Corrida' },
};

const initialWorkout = {
    seg: { nome: 'Peito e Tríceps', foco: ['Peito', 'Tríceps'], tempo: 50, exercicios: [exerciseDB.peito, exerciseDB.triceps] },
    ter: { nome: 'Costas e Bíceps', foco: ['Costas', 'Bíceps'], tempo: 45, exercicios: [exerciseDB.costas, exerciseDB.biceps] },
    qua: { nome: 'Pernas', foco: ['Quadríceps', 'Posteriores'], tempo: 60, exercicios: [exerciseDB.pernas] },
    qui: { nome: 'Descanso Ativo', foco: ['Recuperação'], tempo: 30, exercicios: [{...exerciseDB.cardio, series: '30 min'}] },
    sex: { nome: 'Ombros e Abdómen', foco: ['Ombros', 'Abdómen'], tempo: 45, exercicios: [exerciseDB.ombros] },
    sab: { nome: 'Cardio e Mobilidade', foco: ['Cardio', 'Flexibilidade'], tempo: 40, exercicios: [exerciseDB.cardio] },
    dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: []},
};

// 2. A função que monta o plano de treino, agora com os dados que precisa.
const generateNewWorkoutPlan = (level, focus) => {
    // Lógica super simplificada para demonstração
    if (level === 'iniciante') {
        return {
            seg: { nome: 'Full Body A', foco: ['Geral'], tempo: 45, exercicios: [exerciseDB.peito, exerciseDB.costas, exerciseDB.pernas] },
            ter: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
            qua: { nome: 'Full Body B', foco: ['Geral'], tempo: 45, exercicios: [exerciseDB.ombros, exerciseDB.biceps, exerciseDB.triceps] },
            qui: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
            sex: { nome: 'Full Body C', foco: ['Geral'], tempo: 45, exercicios: [exerciseDB.peito, exerciseDB.costas, exerciseDB.pernas] },
            sab: { nome: 'Cardio', foco: ['Cardio'], tempo: 30, exercicios: [exerciseDB.cardio] },
            dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
        };
    }
    // Para intermediário e avançado, retorna o treino padrão por enquanto
    return initialWorkout; 
};

module.exports = { 
    generateNewWorkoutPlan,
    exerciseDB 
};