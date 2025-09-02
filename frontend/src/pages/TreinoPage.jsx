// src/pages/TreinoPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

import {
    CheckCircle, X, Dumbbell, Clock, Target, Wand, Edit, FireIcon
} from '../components/Icons';

// --- Subcomponentes ---

const StreakCounter = ({ streak }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Sequência Atual</h3>
        <div className={`flex items-center justify-center text-5xl font-bold ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
            <FireIcon className="w-12 h-12 mr-2" />
            <span>{streak}</span>
        </div>
        <p className="text-gray-500 mt-2">{streak > 1 ? 'dias de treino!' : (streak === 1 ? 'dia de treino!' : 'Comece uma sequência!')}</p>
    </div>
);

const WorkoutCalendar = ({ completedDays, selectedDate, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

    useEffect(() => {
        setCurrentMonth(selectedDate.getMonth());
        setCurrentYear(selectedDate.getFullYear());
    }, [selectedDate]);

    const completedSet = new Set(completedDays.map(d => new Date(d).toISOString().slice(0, 10)));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthName = new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long' });

    let calendarDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} className="w-10 h-10"></div>);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().slice(0, 10);
        const isCompleted = completedSet.has(dateString);
        const isSelected = selectedDate.toISOString().slice(0, 10) === dateString;
        const isToday = today.toISOString().slice(0, 10) === dateString;

        calendarDays.push(
            <div key={day} className="flex flex-col items-center">
                <button 
                    onClick={() => onDateSelect(date)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                        ${isSelected ? 'bg-violet-600 text-white' : ''}
                        ${!isSelected && isToday ? 'bg-violet-100 text-violet-700' : ''}
                        ${!isSelected && !isToday ? 'hover:bg-gray-200' : ''}
                    `}
                >
                    {day}
                </button>
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 mt-1" />}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">{monthName} {currentYear}</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => <div key={index}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {calendarDays}
            </div>
        </div>
    );
};

const TutorialModal = ({ isOpen, onClose, exercise }) => {
    if (!isOpen || !exercise) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{exercise.name}</h3>
                <div className="w-full h-56 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img src={exercise.gifUrl || 'https://placehold.co/400x300/e2e8f0/a0aec0?text=Tutorial'} alt={`Animação para ${exercise.name}`} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-600">{exercise.description}</p>
            </div>
        </div>
    );
};

const WorkoutGeneratorModal = ({ isOpen, onClose, onGenerate }) => {
    // Hooks movidos para o topo, ANTES da condição de retorno
    const [level, setLevel] = useState('iniciante');
    const [focus, setFocus] = useState('manter');

    if (!isOpen) return null;

    const handleGenerateClick = () => { onGenerate(level, focus); };
    const OptionButton = ({ value, state, setState, children }) => (
        <button onClick={() => setState(value)} className={`flex-1 p-3 text-sm font-semibold rounded-lg transition-colors ${state === value ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Gerador de Treino</h3>
                <p className="text-gray-600 mb-6">Selecione as suas preferências para gerarmos um treino personalizado para si.</p>
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Qual é o seu nível?</label>
                        <div className="flex space-x-2">
                            <OptionButton value="iniciante" state={level} setState={setLevel}>Iniciante</OptionButton>
                            <OptionButton value="intermediario" state={level} setState={setLevel}>Intermediário</OptionButton>
                            <OptionButton value="avancado" state={level} setState={setLevel}>Avançado</OptionButton>
                        </div>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Qual é o seu foco?</label>
                        <div className="flex space-x-2">
                            <OptionButton value="emagrecer" state={focus} setState={setFocus}>Emagrecer</OptionButton>
                            <OptionButton value="manter" state={focus} setState={setFocus}>Manter</OptionButton>
                            <OptionButton value="ganharMassa" state={focus} setState={setFocus}>Ganhar Massa</OptionButton>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6">
                    <button onClick={handleGenerateClick} className="w-full flex items-center justify-center bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors">
                        <Wand className="w-5 h-5 mr-2" />
                        Gerar Treino Automático
                    </button>
                    <Link 
                        to="/treino/criar" 
                        onClick={onClose}
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
    const [streak, setStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isGeneratorOpen, setGeneratorOpen] = useState(false);
    const [isTutorialModalOpen, setTutorialModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const fetchWorkoutData = async () => {
        try {
            const response = await api.get('/workout');
            setActiveWorkout(response.data.workoutPlan);
            setCompletedDays(response.data.completedDays);
            setStreak(response.data.streak);
            setError('');
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setActiveWorkout(null);
                setStreak(0);
                setCompletedDays([]);
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
        setGeneratorOpen(false);
        setIsLoading(true);
        try {
            await api.post('/workout/generate', { level, focus });
            await fetchWorkoutData();
        } catch (err) {
            setError("Não foi possível gerar um novo treino.");
        }
        setIsLoading(false);
    };

    const handleToggleCompleteToday = async () => {
        try {
            await api.post(`/workout/complete/today`);
            await fetchWorkoutData();
        } catch (err) {
            setError("Ocorreu um erro ao atualizar o seu progresso.");
        }
    };

    const handleOpenTutorial = (exercise) => {
        setSelectedExercise(exercise);
        setTutorialModalOpen(true);
    };

    if (isLoading) {
        return <div className="p-8 text-center">A carregar o seu plano de treino...</div>;
    }
    
    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
    }

    const dayMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const selectedDayKey = dayMap[selectedDate.getDay()];
    const currentWorkoutForSelectedDay = activeWorkout ? activeWorkout[selectedDayKey] : null;
    const todayString = new Date().toISOString().slice(0, 10);
    const isTodaySelected = selectedDate.toISOString().slice(0, 10) === todayString;
    const isTodayCompleted = completedDays.some(d => new Date(d).toISOString().slice(0, 10) === todayString);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg-col-span-1 space-y-6">
                    <StreakCounter streak={streak} />
                    <WorkoutCalendar 
                        completedDays={completedDays} 
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Opções</h3>
                        <button onClick={() => setGeneratorOpen(true)} className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors">
                            <Wand className="w-5 h-5 mr-2" />
                            Gerar Novo Treino
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    {!activeWorkout ? (
                         <div className="text-center p-8">
                            <p className="mb-4 text-gray-600">Nenhum plano de treino encontrado.</p>
                            <button onClick={() => setGeneratorOpen(true)} className="mt-4 bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-700">
                                Gerar Primeiro Treino
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Treino de {currentWorkoutForSelectedDay.nome}</h2>
                            <p className="text-gray-500 mb-6">Foco em {currentWorkoutForSelectedDay.foco.join(' e ')}</p>
                            <div className="space-y-4">
                                {currentWorkoutForSelectedDay.exercicios.length > 0 ? (
                                    currentWorkoutForSelectedDay.exercicios.map((exercise, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-violet-50 transition-colors">
                                            <div>
                                                <p className="font-bold text-gray-800">{exercise.name}</p>
                                                <p className="text-sm text-gray-500">{exercise.series}</p>
                                            </div>
                                            <button onClick={() => handleOpenTutorial(exercise)} className="text-sm font-semibold text-violet-600 hover:text-violet-800">Ver Tutorial</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Hoje é dia de descanso.</div>
                                )}
                            </div>
                            {isTodaySelected && currentWorkoutForSelectedDay.exercicios.length > 0 && (
                                <button onClick={handleToggleCompleteToday} className={`w-full mt-6 font-semibold py-3 px-4 rounded-lg transition-colors ${isTodayCompleted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-violet-500 hover:bg-violet-600 text-white'}`}>
                                    {isTodayCompleted ? 'Treino de Hoje Concluído!' : 'Marcar Treino de Hoje como Concluído'}
                                </button>
                            )}
                        </>
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