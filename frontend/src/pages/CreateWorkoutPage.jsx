// src/pages/CreateWorkoutPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componentes e Ícones necessários
import AddExerciseModal from '../components/AddExerciseModal';
import { Plus, Trash, Save } from '../components/Icons';

// Um plano de treino base, com todos os dias definidos como descanso.
// É o nosso ponto de partida.
const blankWorkoutPlan = {
    seg: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    ter: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    qua: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    qui: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    sex: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    sab: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
    dom: { nome: 'Descanso', foco: ['Recuperação'], tempo: 0, exercicios: [] },
};

export default function CreateWorkoutPage() {
    const [workoutPlan, setWorkoutPlan] = useState(blankWorkoutPlan);
    const [selectedDay, setSelectedDay] = useState('seg');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleAddExercises = (exercisesToAdd) => {
        setWorkoutPlan(prevPlan => {
            const currentDay = prevPlan[selectedDay];
            const newExercises = exercisesToAdd.filter(newEx => 
                !currentDay.exercicios.some(existingEx => existingEx.id === newEx.id)
            );

            // Atualiza os detalhes do dia
            const updatedDay = {
                ...currentDay,
                nome: 'Treino Manual',
                foco: ['Personalizado'], // Pode ser melhorado no futuro
                tempo: 45, // Valor padrão
                exercicios: [...currentDay.exercicios, ...newExercises]
            };
            
            return { ...prevPlan, [selectedDay]: updatedDay };
        });
    };

    const handleRemoveExercise = (exerciseId) => {
        setWorkoutPlan(prevPlan => {
            const currentDay = prevPlan[selectedDay];
            const updatedExercises = currentDay.exercicios.filter(ex => ex.id !== exerciseId);

            const updatedDay = { ...currentDay, exercicios: updatedExercises };

            // Se for o último exercício, volta a ser dia de descanso
            if (updatedExercises.length === 0) {
                updatedDay.nome = 'Descanso';
                updatedDay.foco = ['Recuperação'];
                updatedDay.tempo = 0;
            }

            return { ...prevPlan, [selectedDay]: updatedDay };
        });
    };

    const handleSaveWorkout = async () => {
        setIsSaving(true);
        try {
            await api.post('/workout/manual', { workoutPlan });
            alert('Plano de treino guardado com sucesso!');
            navigate('/treino'); // Redireciona para a página de treino
        } catch (error) {
            console.error("Erro ao guardar o plano de treino:", error);
            alert("Não foi possível guardar o plano de treino.");
        } finally {
            setIsSaving(false);
        }
    };

    const dayKeys = Object.keys(workoutPlan);

    return (
        <>
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Crie o seu Treino Manual</h1>
                        <p className="text-gray-500">Monte o seu plano de treino, dia a dia.</p>
                    </div>
                    <button onClick={handleSaveWorkout} disabled={isSaving} className="flex items-center bg-violet-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-violet-700 disabled:bg-violet-400">
                        <Save className="w-5 h-5 mr-2" />
                        {isSaving ? 'A Guardar...' : 'Guardar Plano'}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="mb-4 border-b pb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Selecione o Dia</h3>
                        <div className="flex space-x-2 mt-2 overflow-x-auto">
                            {dayKeys.map(day => (
                                <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${selectedDay === day ? 'bg-violet-600 text-white' : 'bg-gray-100 hover:bg-violet-100'}`}>
                                    {day.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 capitalize">{selectedDay} - {workoutPlan[selectedDay].nome}</h3>
                            <button onClick={() => setIsModalOpen(true)} className="flex items-center text-sm font-semibold text-violet-600 hover:text-violet-800">
                                <Plus className="w-5 h-5 mr-1" />
                                Adicionar Exercício
                            </button>
                        </div>
                        
                        <ul className="space-y-2">
                            {workoutPlan[selectedDay].exercicios.length > 0 ? (
                                workoutPlan[selectedDay].exercicios.map(ex => (
                                    <li key={ex.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <span className="font-semibold text-gray-700">{ex.name}</span>
                                        <button onClick={() => handleRemoveExercise(ex.id)} className="text-gray-400 hover:text-red-500">
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Dia de descanso. Adicione exercícios para montar o seu treino.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <AddExerciseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddExercises={handleAddExercises}
            />
        </>
    );
}