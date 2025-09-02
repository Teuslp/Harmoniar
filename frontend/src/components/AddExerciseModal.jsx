// src/components/AddExerciseModal.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, CheckSquare, Square } from './Icons'; // Certifique-se de que CheckSquare e Square existem em Icons.jsx

export default function AddExerciseModal({ isOpen, onClose, onAddExercises }) {
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Busca a lista de exercícios da API quando o modal é aberto
        if (isOpen) {
            const fetchExercises = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const response = await api.get('/exercises');
                    setAllExercises(response.data);
                } catch (err) {
                    console.error("Erro ao buscar exercícios:", err);
                    setError("Não foi possível carregar a lista de exercícios.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchExercises();
        }
    }, [isOpen]); // Dependência: executa sempre que 'isOpen' muda

    const handleSelectExercise = (exercise) => {
        setSelectedExercises(prevSelected => {
            // Verifica se o exercício já está selecionado pelo ID
            const isSelected = prevSelected.some(ex => ex.id === exercise.id);
            if (isSelected) {
                // Se já estiver selecionado, remove-o
                return prevSelected.filter(ex => ex.id !== exercise.id);
            } else {
                // Se não, adiciona-o
                return [...prevSelected, exercise];
            }
        });
    };
    
    const handleAddClick = () => {
        onAddExercises(selectedExercises); // Envia os exercícios selecionados para a página pai
        onClose(); // Fecha o modal
        setSelectedExercises([]); // Limpa a seleção para a próxima vez
    };

    const filteredExercises = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Adicionar Exercício</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>

                <input 
                    type="text"
                    placeholder="Pesquisar por nome ou músculo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />

                <div className="flex-grow overflow-y-auto pr-2">
                    {isLoading && <p>A carregar exercícios...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!isLoading && !error && (
                        <ul className="space-y-2">
                            {filteredExercises.map(exercise => {
                                const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
                                return (
                                    <li 
                                        key={exercise.id} 
                                        onClick={() => handleSelectExercise(exercise)}
                                        className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${isSelected ? 'bg-violet-100' : 'hover:bg-gray-50'}`}
                                    >
                                        {isSelected ? <CheckSquare className="w-6 h-6 text-violet-600 mr-3" /> : <Square className="w-6 h-6 text-gray-400 mr-3" />}
                                        <div>
                                            <p className="font-semibold text-gray-800">{exercise.name}</p>
                                            <p className="text-sm text-gray-500">{exercise.muscle}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="mt-6 border-t pt-4">
                    <button 
                        onClick={handleAddClick} 
                        disabled={selectedExercises.length === 0}
                        className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 disabled:bg-gray-300"
                    >
                        Adicionar {selectedExercises.length > 0 ? `${selectedExercises.length} Exercício(s)` : 'Exercícios Selecionados'}
                    </button>
                </div>
            </div>
        </div>
    );
}