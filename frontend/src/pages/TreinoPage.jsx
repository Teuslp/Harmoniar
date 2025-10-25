// src/pages/TreinoPage.jsx (Versão com Resumo Pós-Treino)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Ícones
import { CheckCircle, X, Wand, Edit, FireIcon, CheckSquare, Square, BarChart2 } from '../components/Icons';

// Componentes
import WorkoutSummaryModal from '../components/WorkoutSummaryModal';
import ExerciseHistoryModal from '../components/ExerciseHistoryModal';


// --- SUBCOMPONENTES DA PÁGINA ---

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
    // (O código do seu WorkoutCalendar continua exatamente o mesmo aqui)
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
    const monthName = new Date(currentYear, currentMonth).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

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
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${isSelected ? 'bg-violet-600 text-white' : ''} ${!isSelected && isToday ? 'bg-violet-100 text-violet-700' : ''} ${!isSelected && !isToday ? 'hover:bg-gray-200' : ''}`}
                >
                    {day}
                </button>
                {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 mt-1" />}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">{monthName}</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => <div key={index}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
                {calendarDays}
            </div>
        </div>
    );
};

const WorkoutGeneratorModal = ({ isOpen, onClose, onGenerate }) => {
    // (O código do seu WorkoutGeneratorModal continua exatamente o mesmo aqui)
    const [level, setLevel] = useState('iniciante');
    const [focus, setFocus] = useState('manter');
    if (!isOpen) return null;
    const handleGenerateClick = () => { onGenerate(level, focus); };
    const OptionButton = ({ value, state, setState, children }) => (
        <button onClick={() => setState(value)} className={`flex-1 p-3 text-sm font-semibold rounded-lg transition-colors ${state === value ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{children}</button>
    );
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Gerador de Treino</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Seu nível?</label>
                        <div className="flex space-x-2"><OptionButton value="iniciante" state={level} setState={setLevel}>Iniciante</OptionButton><OptionButton value="intermediario" state={level} setState={setLevel}>Intermediário</OptionButton><OptionButton value="avancado" state={level} setState={setLevel}>Avançado</OptionButton></div>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Seu foco?</label>
                        <div className="flex space-x-2"><OptionButton value="emagrecer" state={focus} setState={setFocus}>Emagrecer</OptionButton><OptionButton value="manter" state={focus} setState={setFocus}>Manter</OptionButton><OptionButton value="ganharMassa" state={focus} setState={setFocus}>Ganhar Massa</OptionButton></div>
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

const SimpleExerciseItem = ({ exercise, isDone, onToggle }) => (
    <div
        onClick={onToggle}
        className={`p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 ${isDone ? 'bg-green-100 text-gray-500' : 'bg-gray-50 hover:bg-violet-50'}`}
    >
        {isDone ? <CheckSquare className="w-6 h-6 text-green-500 flex-shrink-0" /> : <Square className="w-6 h-6 text-gray-400 flex-shrink-0" />}
        <div className="flex-grow">
            <p className={`font-bold text-gray-800 ${isDone && 'line-through'}`}>{exercise.name}</p>
            <p className={`text-sm text-gray-500 ${isDone && 'line-through'}`}>{exercise.series}</p>
        </div>
    </div>
);


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function TreinoPage() {
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [completedSessions, setCompletedSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isGeneratorOpen, setGeneratorOpen] = useState(false);

    // Estado do fluxo "Resumo Pós-Treino"
    const [isWorkoutActive, setIsWorkoutActive] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [doneExercises, setDoneExercises] = useState(new Set());
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyExerciseName, setHistoryExerciseName] = useState(null);

    const dayMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const todayKey = dayMap[new Date().getDay()];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [planRes, sessionsRes] = await Promise.all([
                api.get('/workout/plan'),
                api.get('/workout/sessions')
            ]);
            setWorkoutPlan(planRes.data.workoutPlan);
            setCompletedSessions(sessionsRes.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setWorkoutPlan(null);
                setCompletedSessions([]);
            } else {
                console.error("Erro ao buscar dados de treino:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStartWorkout = () => {
        setDoneExercises(new Set());
        setIsWorkoutActive(true);
    };

    const handleOpenHistory = (exerciseName) => {
        setHistoryExerciseName(exerciseName);
        setHistoryModalOpen(true);
    };

    const handleToggleExercise = (exerciseName) => {
        const newSet = new Set(doneExercises);
        if (newSet.has(exerciseName)) {
            newSet.delete(exerciseName);
        } else {
            newSet.add(exerciseName);
        }
        setDoneExercises(newSet);
    };

    const handleFinishWorkout = () => {
        setIsWorkoutActive(false);
        // Só abre o resumo se pelo menos um exercício foi feito
        if (doneExercises.size > 0) {
            setIsSummaryOpen(true);
        }
    };

    const handleSaveSession = async (exercisesWithWeight) => {
        const sessionData = {
            workoutName: workoutPlan[todayKey].nome,
            exercises: exercisesWithWeight.filter(ex => doneExercises.has(ex.name)),
        };

        if (sessionData.exercises.length === 0) {
            setIsSummaryOpen(false);
            return;
        };

        try {
            await api.post('/workout/session', sessionData);
            setIsSummaryOpen(false);
            fetchData(); // Atualiza calendário e streak
        } catch (err) {
            console.error("Erro ao guardar a sessão:", err);
        }
    };

    const handleGenerate = async (level, focus) => {
        setGeneratorOpen(false);
        setIsLoading(true);
        try {
            await api.post('/workout/generate', { level, focus });
            fetchData();
        } catch (err) {
            console.error("Erro ao gerar novo treino:", err);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">A carregar o seu plano de treino...</div>;
    }

    // TELA DE TREINO ATIVO
    if (isWorkoutActive) {
        const activeWorkout = workoutPlan[todayKey];
        return (
            <>
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">Treino em Andamento: {activeWorkout.nome}</h2>
                    <p className="text-gray-600">Marque os exercícios que concluir.</p>
                    <div className="space-y-3 pt-4">
                        {activeWorkout.exercicios.map((ex, index) => (
                            <SimpleExerciseItem
                                key={index}
                                exercise={ex}
                                isDone={doneExercises.has(ex.name)}
                                onToggle={() => handleToggleExercise(ex.name)}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={handleFinishWorkout} className="flex-1 bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700">Finalizar e Resumir</button>
                        <button onClick={() => setIsWorkoutActive(false)} className="flex-1 bg-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-400">Descartar</button>
                    </div>
                </div>
            </>
        );
    }

    const todaysPlan = workoutPlan ? workoutPlan[todayKey] : null;

    // TELA PRINCIPAL (VISÃO GERAL)
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <StreakCounter streak={completedSessions.length} />
                    <WorkoutCalendar
                        completedDays={completedSessions.map(s => s.date)}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Opções</h3>
                        <button onClick={() => setGeneratorOpen(true)} className="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors">
                            <Wand className="w-5 h-5 mr-2" />
                            Gerar/Editar Plano
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    {!workoutPlan ? (
                        <div className="text-center p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Bem-vindo ao seu diário de treinos!</h3>
                            <p className="mb-6 text-gray-600">Parece que você ainda não tem um plano. Gere um para começar.</p>
                            <button onClick={() => setGeneratorOpen(true)} className="bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-violet-700">
                                Gerar Primeiro Treino
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Treino de {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}</h2>
                            <p className="text-gray-500 mb-6">Foco em {workoutPlan[dayMap[selectedDate.getDay()]]?.foco.join(' e ') || 'Descanso'}</p>
                            <div className="space-y-4">
                                {todaysPlan && todaysPlan.exercicios.length > 0 ? (
                                    <>
                                        {todaysPlan.exercicios.map((ex, i) => (
                                            <div key={i} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                                <div><p className="font-bold text-gray-800">{ex.name}</p><p className="text-sm text-gray-500">{ex.series}</p></div>
                                                <button onClick={() => handleOpenHistory(ex.name)} className="p-2 text-gray-500 hover:text-violet-600 transition-colors">
                                                    <BarChart2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {new Date().toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10) && (
                                            <button onClick={handleStartWorkout} className="w-full mt-6 bg-violet-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-violet-700">
                                                Começar Treino de Hoje
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Hoje é dia de descanso. Aproveite para recuperar!</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <WorkoutGeneratorModal
                isOpen={isGeneratorOpen}
                onClose={() => setGeneratorOpen(false)}
                onGenerate={handleGenerate}
            />
            <WorkoutSummaryModal
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                workoutPlan={todaysPlan}
                onSave={handleSaveSession}
            />
            <ExerciseHistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                exerciseName={historyExerciseName}
            />
        </>
    );
}