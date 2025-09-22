// src/components/AddEditSubjectModal.jsx

import React, { useState, useEffect } from 'react';
import { X, Save } from './Icons'; // Importando ícones que talvez você use

export default function AddEditSubjectModal({ isOpen, onClose, onSave, subject }) {
    const [name, setName] = useState('');
    const [weeklyGoal, setWeeklyGoal] = useState(3);
    const [error, setError] = useState('');

    // Este `useEffect` é o truque para o modo "Editar".
    // Ele preenche o formulário com os dados da matéria quando ela é passada como prop.
    useEffect(() => {
        if (subject) {
            // Modo Edição
            setName(subject.name);
            setWeeklyGoal(subject.weeklyGoal);
        } else {
            // Modo Adicionar (reseta o formulário)
            setName('');
            setWeeklyGoal(3);
        }
    }, [subject, isOpen]); // Roda sempre que o modal abre ou a matéria a ser editada muda

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('O nome da matéria é obrigatório.');
            return;
        }

        const subjectData = {
            name,
            weeklyGoal: Number(weeklyGoal),
        };

        // Se estivermos editando, incluímos o ID
        if (subject) {
            subjectData._id = subject._id;
        }

        onSave(subjectData);
        onClose(); // Fecha o modal após salvar
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    {subject ? 'Editar Matéria' : 'Adicionar Nova Matéria'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="subject-name" className="block text-lg font-semibold text-gray-700 mb-2">
                            Nome da Matéria
                        </label>
                        <input
                            id="subject-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Cálculo I"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="weekly-goal" className="block text-lg font-semibold text-gray-700 mb-2">
                            Meta Semanal (sessões)
                        </label>
                        <input
                            id="weekly-goal"
                            type="number"
                            value={weeklyGoal}
                            min="1"
                            onChange={(e) => setWeeklyGoal(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="border-t pt-6 mt-4">
                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {subject ? 'Salvar Alterações' : 'Adicionar Matéria'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}