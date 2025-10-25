import React, { useState, useEffect } from 'react';
import { Save, X } from './Icons';

export default function WorkoutSummaryModal({ isOpen, onClose, workoutPlan, onSave }) {
    const [weights, setWeights] = useState({});

    useEffect(() => {
        if (isOpen) {
            setWeights({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleWeightChange = (exerciseName, value) => {
        setWeights(prev => ({ ...prev, [exerciseName]: value }));
    };

    const handleSave = () => {
        // 👇 Verificação de segurança adicionada aqui também 👇
        if (!workoutPlan || !workoutPlan.exercises) return;

        const exercisesWithWeight = workoutPlan.exercises.map(ex => ({
            name: ex.name,
            weight: Number(weights[ex.name]) || 0,
        }));
        onSave(exercisesWithWeight);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Resumo do Treino: {workoutPlan?.nome || ''}</h3>
                <p className="text-gray-600 mb-6">Ótimo trabalho! Registre o peso principal que você usou em cada exercício.</p>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    
                    {/* 👇 ESTA É A MUDANÇA PRINCIPAL 👇 */}
                    {/* Adicionamos uma verificação para garantir que workoutPlan e workoutPlan.exercises existem antes de chamar .map() */}
                    {workoutPlan && workoutPlan.exercises ? (
                        workoutPlan.exercises.map(ex => (
                            <div key={ex.name} className="flex items-center justify-between gap-4 p-2 bg-gray-50 rounded-lg">
                                <label className="font-semibold text-gray-700 flex-1">{ex.name}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => handleWeightChange(ex.name, e.target.value)}
                                        className="w-24 p-2 border border-gray-300 rounded-md text-center focus:ring-violet-500 focus:border-violet-500"
                                    />
                                    <span className="font-medium text-gray-500">kg</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum exercício para exibir.</p>
                    )}
                </div>
                <div className="mt-8 border-t pt-6">
                    <button onClick={handleSave} className="w-full flex items-center justify-center bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">
                        <Save className="w-5 h-5 mr-2" /> Salvar Sessão
                    </button>
                </div>
            </div>
        </div>
    );
}