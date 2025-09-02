// backend/utils/exerciseCatalog.js

const exerciseCatalog = [
    {
        category: 'Peito (Pectorais)',
        subCategories: [
            {
                type: 'Com barra',
                exercises: [
                    { id: 'pec_bar_01', name: 'Supino reto', muscle: 'Peito' },
                    { id: 'pec_bar_02', name: 'Supino inclinado', muscle: 'Peito' },
                    { id: 'pec_bar_03', name: 'Supino declinado', muscle: 'Peito' },
                    { id: 'pec_bar_04', name: 'Supino fechado', muscle: 'Peito/Tríceps' },
                ],
            },
            {
                type: 'Com halteres',
                exercises: [
                    { id: 'pec_hal_01', name: 'Supino reto com halteres', muscle: 'Peito' },
                    { id: 'pec_hal_02', name: 'Supino inclinado com halteres', muscle: 'Peito' },
                    { id: 'pec_hal_03', name: 'Supino declinado com halteres', muscle: 'Peito' },
                    { id: 'pec_hal_04', name: 'Crucifixo reto', muscle: 'Peito' },
                    { id: 'pec_hal_05', name: 'Crucifixo inclinado', muscle: 'Peito' },
                    { id: 'pec_hal_06', name: 'Crucifixo declinado', muscle: 'Peito' },
                    { id: 'pec_hal_07', name: 'Pullover', muscle: 'Peito/Costas' },
                ],
            },
            {
                type: 'Na máquina/polia',
                exercises: [
                    { id: 'pec_maq_01', name: 'Peck Deck (voador)', muscle: 'Peito' },
                    { id: 'pec_maq_02', name: 'Cross-over (alto, médio e baixo)', muscle: 'Peito' },
                    { id: 'pec_maq_03', name: 'Supino máquina', muscle: 'Peito' },
                    { id: 'pec_maq_04', name: 'Crucifixo máquina', muscle: 'Peito' },
                ],
            },
            {
                type: 'Peso corporal',
                exercises: [
                    { id: 'pec_pes_01', name: 'Flexão tradicional', muscle: 'Peito' },
                    { id: 'pec_pes_02', name: 'Flexão inclinada/declinada', muscle: 'Peito' },
                    { id: 'pec_pes_03', name: 'Flexão diamante', muscle: 'Peito/Tríceps' },
                    { id: 'pec_pes_04', name: 'Flexão explosiva', muscle: 'Peito' },
                ],
            },
        ],
    },
    {
        category: 'Costas (Dorsais e Lombar)',
        subCategories: [
            {
                type: 'Com barra',
                exercises: [
                    { id: 'cos_bar_01', name: 'Remada curvada', muscle: 'Costas' },
                    { id: 'cos_bar_02', name: 'Remada cavalinho (T-bar row)', muscle: 'Costas' },
                    { id: 'cos_bar_03', name: 'Barra fixa (diferentes pegadas)', muscle: 'Costas' },
                    { id: 'cos_bar_04', name: 'Levantamento terra', muscle: 'Costas/Pernas' },
                ],
            },
            {
                type: 'Com halteres',
                exercises: [
                    { id: 'cos_hal_01', name: 'Remada unilateral (serrote)', muscle: 'Costas' },
                    { id: 'cos_hal_02', name: 'Pullover com halter', muscle: 'Costas/Peito' },
                ],
            },
            {
                type: 'Na máquina/polia',
                exercises: [
                    { id: 'cos_maq_01', name: 'Puxada alta (frente, trás, etc.)', muscle: 'Costas' },
                    { id: 'cos_maq_02', name: 'Remada baixa (diferentes pegadas)', muscle: 'Costas' },
                    { id: 'cos_maq_03', name: 'Remada unilateral máquina', muscle: 'Costas' },
                    { id: 'cos_maq_04', name: 'Pullover polia', muscle: 'Costas' },
                ],
            },
            {
                type: 'Peso corporal',
                exercises: [
                    { id: 'cos_pes_01', name: 'Barra fixa', muscle: 'Costas' },
                    { id: 'cos_pes_02', name: 'Remada invertida', muscle: 'Costas' },
                    { id: 'cos_pes_03', name: 'Hiperextensão lombar', muscle: 'Lombar' },
                ],
            },
        ],
    },
    {
        category: 'Ombros (Deltoides)',
        subCategories: [
            {
                type: 'Com barra',
                exercises: [
                    { id: 'omb_bar_01', name: 'Desenvolvimento militar', muscle: 'Ombros' },
                    { id: 'omb_bar_02', name: 'Desenvolvimento atrás da cabeça', muscle: 'Ombros' },
                    { id: 'omb_bar_03', name: 'Remada alta', muscle: 'Ombros/Trapézio' },
                ],
            },
            {
                type: 'Com halteres',
                exercises: [
                    { id: 'omb_hal_01', name: 'Desenvolvimento com halteres', muscle: 'Ombros' },
                    { id: 'omb_hal_02', name: 'Elevação lateral', muscle: 'Ombros' },
                    { id: 'omb_hal_03', name: 'Elevação frontal', muscle: 'Ombros' },
                    { id: 'omb_hal_04', name: 'Arnold press', muscle: 'Ombros' },
                    { id: 'omb_hal_05', name: 'Crucifixo inverso', muscle: 'Ombros/Costas' },
                ],
            },
            {
                type: 'Na máquina/polia',
                exercises: [
                    { id: 'omb_maq_01', name: 'Desenvolvimento máquina', muscle: 'Ombros' },
                    { id: 'omb_maq_02', name: 'Elevação lateral polia', muscle: 'Ombros' },
                    { id: 'omb_maq_03', name: 'Crucifixo inverso máquina', muscle: 'Ombros' },
                    { id: 'omb_maq_04', name: 'Remada alta polia', muscle: 'Ombros/Trapézio' },
                ],
            },
            {
                type: 'Peso corporal',
                exercises: [
                    { id: 'omb_pes_01', name: 'Pike push-up', muscle: 'Ombros' },
                    { id: 'omb_pes_02', name: 'Flexão de ombro em handstand', muscle: 'Ombros' },
                ],
            },
        ],
    },
    {
        category: 'Braços - Bíceps',
        subCategories: [
            {
                type: 'Com barra',
                exercises: [
                    { id: 'bic_bar_01', name: 'Rosca direta', muscle: 'Bíceps' },
                    { id: 'bic_bar_02', name: 'Rosca scott', muscle: 'Bíceps' },
                    { id: 'bic_bar_03', name: 'Rosca 21', muscle: 'Bíceps' },
                    { id: 'bic_bar_04', name: 'Rosca inversa', muscle: 'Bíceps/Antebraço' },
                ],
            },
            {
                type: 'Com halteres',
                exercises: [
                    { id: 'bic_hal_01', name: 'Rosca alternada', muscle: 'Bíceps' },
                    { id: 'bic_hal_02', name: 'Rosca concentrada', muscle: 'Bíceps' },
                    { id: 'bic_hal_03', name: 'Rosca martelo', muscle: 'Bíceps/Braquial' },
                    { id: 'bic_hal_04', name: 'Rosca inclinado banco', muscle: 'Bíceps' },
                ],
            },
            {
                type: 'Na máquina/polia',
                exercises: [
                    { id: 'bic_maq_01', name: 'Rosca cabo alta', muscle: 'Bíceps' },
                    { id: 'bic_maq_02', name: 'Rosca cabo baixa', muscle: 'Bíceps' },
                    { id: 'bic_maq_03', name: 'Rosca unilateral polia', muscle: 'Bíceps' },
                    { id: 'bic_maq_04', name: 'Rosca scott máquina', muscle: 'Bíceps' },
                ],
            },
        ],
    },
    {
        category: 'Braços - Tríceps',
        subCategories: [
            {
                type: 'Com barra/halteres',
                exercises: [
                    { id: 'tri_bar_01', name: 'Tríceps francês', muscle: 'Tríceps' },
                    { id: 'tri_bar_02', name: 'Tríceps testa', muscle: 'Tríceps' },
                    { id: 'tri_bar_03', name: 'Kickback', muscle: 'Tríceps' },
                ],
            },
            {
                type: 'Na máquina/polia',
                exercises: [
                    { id: 'tri_maq_01', name: 'Tríceps pulley (barra reta)', muscle: 'Tríceps' },
                    { id: 'tri_maq_02', name: 'Tríceps pulley corda', muscle: 'Tríceps' },
                    { id: 'tri_maq_03', name: 'Tríceps pulley V-bar', muscle: 'Tríceps' },
                    { id: 'tri_maq_04', name: 'Tríceps unilateral polia', muscle: 'Tríceps' },
                ],
            },
            {
                type: 'Peso corporal',
                exercises: [
                    { id: 'tri_pes_01', name: 'Mergulho em paralelas', muscle: 'Tríceps/Peito' },
                    { id: 'tri_pes_02', name: 'Mergulho banco', muscle: 'Tríceps' },
                    { id: 'tri_pes_03', name: 'Flexão diamante', muscle: 'Tríceps/Peito' },
                ],
            },
        ],
    },
    {
        category: 'Pernas',
        subCategories: [
            {
                type: 'Quadríceps',
                exercises: [
                    { id: 'per_quad_01', name: 'Agachamento livre', muscle: 'Quadríceps/Glúteos' },
                    { id: 'per_quad_02', name: 'Agachamento frontal', muscle: 'Quadríceps' },
                    { id: 'per_quad_03', name: 'Hack squat', muscle: 'Quadríceps' },
                    { id: 'per_quad_04', name: 'Leg press', muscle: 'Quadríceps/Glúteos' },
                    { id: 'per_quad_05', name: 'Afundo', muscle: 'Quadríceps/Glúteos' },
                    { id: 'per_quad_06', name: 'Cadeira extensora', muscle: 'Quadríceps' },
                ],
            },
            {
                type: 'Posterior de Coxa',
                exercises: [
                    { id: 'per_post_01', name: 'Mesa flexora', muscle: 'Isquiotibiais' },
                    { id: 'per_post_02', name: 'Stiff', muscle: 'Isquiotibiais/Glúteos' },
                    { id: 'per_post_03', name: 'Levantamento terra romeno', muscle: 'Isquiotibiais' },
                    { id: 'per_post_04', name: 'Good mornings', muscle: 'Isquiotibiais/Lombar' },
                    { id: 'per_post_05', name: 'Nordic curl', muscle: 'Isquiotibiais' },
                ],
            },
            {
                type: 'Glúteos',
                exercises: [
                    { id: 'per_glu_01', name: 'Elevação pélvica (Hip thrust)', muscle: 'Glúteos' },
                    { id: 'per_glu_02', name: 'Glute bridge', muscle: 'Glúteos' },
                    { id: 'per_glu_03', name: 'Cadeira abdutora', muscle: 'Glúteos' },
                    { id: 'per_glu_04', name: 'Glute kickback (cabo)', muscle: 'Glúteos' },
                    { id: 'per_glu_05', name: 'Afundo búlgaro', muscle: 'Quadríceps/Glúteos' },
                ],
            },
            {
                type: 'Panturrilhas',
                exercises: [
                    { id: 'per_pan_01', name: 'Elevação de panturrilha em pé', muscle: 'Panturrilhas' },
                    { id: 'per_pan_02', name: 'Elevação de panturrilha sentado', muscle: 'Panturrilhas' },
                    { id: 'per_pan_03', name: 'Panturrilha no leg press', muscle: 'Panturrilhas' },
                    { id: 'per_pan_04', name: 'Saltos pliométricos', muscle: 'Panturrilhas' },
                ],
            },
        ],
    },
    {
        category: 'Abdômen/Core',
        subCategories: [
            {
                type: 'Exercícios',
                exercises: [
                    { id: 'abd_01', name: 'Abdominal crunch', muscle: 'Abdômen' },
                    { id: 'abd_02', name: 'Abdominal infra', muscle: 'Abdômen inferior' },
                    { id: 'abd_03', name: 'Abdominal oblíquo', muscle: 'Abdômen oblíquo' },
                    { id: 'abd_04', name: 'Prancha frontal', muscle: 'Core' },
                    { id: 'abd_05', name: 'Prancha lateral', muscle: 'Core' },
                    { id: 'abd_06', name: 'Ab wheel (roda)', muscle: 'Core' },
                    { id: 'abd_07', name: 'Russian twist', muscle: 'Core/Oblíquos' },
                    { id: 'abd_08', name: 'Hanging leg raise', muscle: 'Abdômen inferior' },
                    { id: 'abd_09', name: 'Abdominal na polia', muscle: 'Abdômen' },
                ],
            },
        ],
    },
    {
        category: 'Cardio/Funcionais',
        subCategories: [
            {
                type: 'Exercícios',
                exercises: [
                    { id: 'car_01', name: 'Corrida na esteira', muscle: 'Cardio' },
                    { id: 'car_02', name: 'Bicicleta ergométrica', muscle: 'Cardio' },
                    { id: 'car_03', name: 'Elíptico', muscle: 'Cardio' },
                    { id: 'car_04', name: 'Remo ergométrico', muscle: 'Cardio' },
                    { id: 'car_05', name: 'Escada ergométrica', muscle: 'Cardio' },
                    { id: 'car_06', name: 'Corda naval', muscle: 'Funcional' },
                    { id: 'car_07', name: 'Kettlebell swings', muscle: 'Funcional/Core' },
                    { id: 'car_08', name: 'Burpees', muscle: 'Full body' },
                    { id: 'car_09', name: 'Box jump', muscle: 'Pernas/Explosão' },
                ],
            },
        ],
    },
];

module.exports = { exerciseCatalog };
