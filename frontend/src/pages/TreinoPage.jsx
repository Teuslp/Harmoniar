// src/pages/TreinoPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. IMPORTAR O LINK PARA NAVEGAÇÃO
import api from '../services/api';

import {
    CheckCircle,
    X,
    Dumbbell,
    Clock,
    Target,
    Wand,
    Edit
} from '../components/Icons';

// --- Componente TutorialModal (Completo) ---
const TutorialModal = ({ isOpen, onClose, exercise }) => {
    // ... (código do TutorialModal sem alterações)
};

// --- Componente WorkoutGeneratorModal (Lógica Corrigida) ---
const WorkoutGeneratorModal = ({ isOpen, onClose, onGenerate }) => {
    const [level, setLevel] = useState('iniciante');
    const [focus, setFocus] = useState('manter');

    if (!isOpen) return null;

    const handleGenerateClick = () => {
        onGenerate(level, focus);
    };

    const OptionButton = ({ value, state, setState, children }) => (
        <button
            onClick={() => setState(value)}
            className={`flex-1 p-3 text-sm font-semibold rounded-lg transition-colors ${state === value ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Gerador de Treino</h3>
                <p className="text-gray-600 mb-6">Selecione as suas preferências para gerarmos um treino personalizado para si.</p>
                <div className="space-y-6">
                    {/* ... opções de nível e foco ... */}
                </div>
                <div className="mt-8 border-t pt-6">
                    <button onClick={handleGenerateClick} className="w-full flex items-center justify-center bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors">
                        <Wand className="w-5 h-5 mr-2" />
                        Gerar Treino Automático
                    </button>
                    
                    {/* 👇 2. BOTÃO ATUALIZADO AQUI 👇 */}
                    {/* Trocámos <button disabled> por <Link> */}
                    <Link 
                        to="/treino/criar" 
                        onClick={onClose} // Fecha o modal ao navegar
                        className="w-full flex items-center justify-center mt-3 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        <Edit className="w-5 h-5 mr-2" />
                        Criar Treino Manual
                    </Link>
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal da Página ---
export default function TreinoPage() {
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [completedDays, setCompletedDays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGeneratorOpen, setGeneratorOpen] = useState(false);
    const [isTutorialModalOpen, setTutorialModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const getDayKey = () => {
        const dayIndex = new Date().getDay();
        const dayMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        return dayMap[dayIndex];
    };
    const [selectedDay, setSelectedDay] = useState(getDayKey());

    const fetchWorkoutData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/workout');
            setActiveWorkout(response.data.workoutPlan);
            setCompletedDays(response.data.completedDays);
            setError(''); 
        } catch (err) {
            console.error("Erro ao buscar dados do treino:", err);
            if (err.response && err.response.status === 404) {
                setActiveWorkout(null); 
                setError(null); 
            } else {
                setError("Não foi possível carregar o seu plano de treino.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkoutData();
    }, []);

    const handleGenerate = async (level, focus) => {
        try {
            setGeneratorOpen(false);
            setIsLoading(true);
            setError('');
            await api.post('/workout/generate', { level, focus });
            await fetchWorkoutData();
        } catch (err) {
            console.error("Erro ao gerar novo treino:", err);
            setError("Não foi possível gerar um novo treino. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleToggleComplete = async () => {
        try {
            await api.post(`/workout/complete/${selectedDay}`);
            fetchWorkoutData();
        } catch (err) {
            console.error("Erro ao marcar treino como concluído:", err);
            setError("Ocorreu um erro ao atualizar o seu progresso.");
        }
    };

    const handleOpenTutorial = (exercise) => {
        setSelectedExercise(exercise);
        setTutorialModalOpen(true);
    };

    if (isLoading) {
        return <div className="text-center p-8">A carregar o seu plano de treino...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    if (!activeWorkout) {
        return (
            <>
                <div className="text-center p-8">
                    <p className="mb-4 text-gray-600">Nenhum plano de treino encontrado.</p>
                    <button onClick={() => setGeneratorOpen(true)} className="mt-4 bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-700">
                        Gerar Novo Treino
                    </button>
                </div>
                <WorkoutGeneratorModal
                    isOpen={isGeneratorOpen}
                    onClose={() => setGeneratorOpen(false)}
                    onGenerate={handleGenerate}
                />
            </>
        );
    }

    const currentWorkout = activeWorkout[selectedDay];
    const isDayCompleted = completedDays.includes(selectedDay);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">A sua Semana</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-2">
                            {Object.keys(activeWorkout).map(day => (
                                <button key={day} onClick={() => setSelectedDay(day)} className={`p-2 rounded-lg text-center transition-all duration-200 ${selectedDay === day ? 'bg-violet-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-violet-100'}`}>
                                    <span className="font-bold text-sm uppercase">{day}</span>
                                    {completedDays.includes(day) && <CheckCircle className="w-4 h-4 mx-auto mt-1 text-green-500" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Opções de Treino</h3>
                        <button onClick={() => setGeneratorOpen(true)} className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors">
                            <Wand className="w-5 h-5 mr-2" />
                            Gerar Novo Treino
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Resumo do Treino</h3>
                        <div className="space-y-3 text-gray-600">
                            <div className="flex items-center"><Target className="w-5 h-5 mr-3 text-violet-500" /><span>Foco: {currentWorkout.foco.join(', ')}</span></div>
                            <div className="flex items-center"><Dumbbell className="w-5 h-5 mr-3 text-violet-500" /><span>{currentWorkout.exercicios.length} exercícios</span></div>
                            <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-violet-500" /><span>~{currentWorkout.tempo} min</span></div>
                        </div>
                        <button onClick={handleToggleComplete} className={`w-full mt-6 font-semibold py-3 px-4 rounded-lg transition-colors ${isDayCompleted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-violet-500 hover:bg-violet-600 text-white'}`}>
                            {isDayCompleted ? 'Treino Concluído!' : 'Marcar como Concluído'}
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Treino de {currentWorkout.nome}</h2>
                    <p className="text-gray-500 mb-6">Foco em {currentWorkout.foco.join(' e ')}</p>
                    {currentWorkout.exercicios.length > 0 ? (
                        <div className="space-y-4">
                            {currentWorkout.exercicios.map((exercise, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-violet-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">{exercise.name}</p>
                                        <p className="text-sm text-gray-500">{exercise.series}</p>
                                    </div>
                                    <button onClick={() => handleOpenTutorial(exercise)} className="text-sm font-semibold text-violet-600 hover:text-violet-800">Ver Tutorial</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="font-bold text-gray-700">Hoje é dia de descanso!</p>
                            <p className="text-gray-500">Aproveite para recuperar.</p>
                        </div>
                    )}
                </div>
            </div>

            <TutorialModal
                isOpen={isTutorialModalOpen}
                onClose={() => setTutorialModalOpen(false)}
                exercise={selectedExercise}
            />
            <WorkoutGeneratorModal
                isOpen={isGeneratorOpen}
                onClose={() => setGeneratorOpen(false)}
                onGenerate={handleGenerate}
            />
        </>
    );
}