// src/components/AddExerciseModal.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../services/api';
import { X, CheckSquare, Square, ChevronDown, ChevronUp } from './Icons';

export default function AddExerciseModal({ isOpen, onClose, onAddExercises }) {
    const [exerciseCatalog, setExerciseCatalog] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Usamos um Set para controlar as categorias abertas, permitindo múltiplas abertas
    const [openCategories, setOpenCategories] = useState(new Set());

    const catalogFetchedRef = useRef(false); // Para controlar se o catálogo já foi carregado

    useEffect(() => {
        if (isOpen && !catalogFetchedRef.current) { // Apenas busca uma vez quando abre o modal pela primeira vez
            const fetchExercises = async () => {
                setIsLoading(true);
                setError('');
                try {
                    const response = await api.get('/exercises');
                    setExerciseCatalog(response.data);
                    catalogFetchedRef.current = true; // Marca como carregado
                    // Abre a primeira categoria por defeito, se houver
                    if (response.data.length > 0) {
                        setOpenCategories(prev => new Set(prev).add(response.data[0].category));
                    }
                } catch (err) {
                    console.error("Erro ao buscar exercícios:", err);
                    setError("Não foi possível carregar a lista de exercícios.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchExercises();
        } else if (!isOpen) {
            // Limpa o estado quando o modal é fechado
            setSearchTerm('');
            setSelectedExercises([]);
            setOpenCategories(new Set()); // Fecha todas as categorias
        }
    }, [isOpen]);

    const toggleCategory = (categoryName) => {
        setOpenCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryName)) {
                newSet.delete(categoryName);
            } else {
                newSet.add(categoryName);
            }
            return newSet;
        });
    };

    const handleSelectExercise = (exercise) => {
        setSelectedExercises(prevSelected => {
            const isSelected = prevSelected.some(ex => ex.id === exercise.id);
            if (isSelected) {
                return prevSelected.filter(ex => ex.id !== exercise.id);
            } else {
                return [...prevSelected, exercise];
            }
        });
    };
    
    const handleAddClick = () => {
        onAddExercises(selectedExercises);
        onClose();
    };

    // Lógica de filtro atualizada para a busca (melhoramos a reatividade ao search)
    const filteredCatalog = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        
        // Se houver termo de busca, abre todas as categorias que contenham resultados
        if (searchTerm) {
            setOpenCategories(new Set()); // Começa limpando, para não ter categorias abertas desnecessariamente
        }

        const filtered = exerciseCatalog.map(category => {
            const filteredSubCategories = category.subCategories.map(subCategory => {
                const filteredExercises = subCategory.exercises.filter(exercise => 
                    exercise.name.toLowerCase().includes(lowerCaseSearch) ||
                    exercise.muscle.toLowerCase().includes(lowerCaseSearch)
                );
                // Se houver exercícios filtrados nesta subcategoria E termo de busca, abre a categoria pai
                if (filteredExercises.length > 0 && searchTerm) {
                    setOpenCategories(prev => new Set(prev).add(category.category));
                }
                return { ...subCategory, exercises: filteredExercises };
            }).filter(subCategory => subCategory.exercises.length > 0);
            
            return { ...category, subCategories: filteredSubCategories };
        }).filter(category => category.subCategories.length > 0);

        return filtered;

    }, [searchTerm, exerciseCatalog]); // Dependências do useMemo

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl flex flex-col h-[90vh] animate-scale-in">
                <div className="flex justify-between items-center mb-4 flex-shrink-0 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Adicionar Exercício</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <input 
                    type="text"
                    placeholder="Pesquisar por nome ou músculo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 mb-4 flex-shrink-0"
                />

                <div className="flex-grow overflow-y-auto -mr-2 pr-2"> {/* Negative margin para barra de scroll */}
                    {isLoading && <p className="text-center text-gray-500">A carregar exercícios...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    {!isLoading && !error && (
                        <div className="space-y-3">
                            {filteredCatalog.length === 0 && searchTerm && (
                                <p className="text-center text-gray-500">Nenhum exercício encontrado para "{searchTerm}".</p>
                            )}
                            {filteredCatalog.map(category => {
                                // A categoria está aberta se estiver no set ou se houver um termo de busca (para mostrar resultados)
                                const isCategoryOpen = openCategories.has(category.category) || searchTerm;
                                const selectedCount = category.subCategories.reduce((count, sub) => 
                                    count + sub.exercises.filter(ex => selectedExercises.some(sel => sel.id === ex.id)).length, 0);

                                return (
                                    <div key={category.category} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                        <div 
                                            className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleCategory(category.category)}
                                        >
                                            <div className="flex items-center">
                                                <h3 className="font-bold text-lg text-gray-800">{category.category}</h3>
                                                {selectedCount > 0 && <span className="ml-3 bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{selectedCount} selecionado{selectedCount > 1 ? 's' : ''}</span>}
                                            </div>
                                            {isCategoryOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                                        </div>
                                        
                                        {/* Conteúdo do acordeão - usa display para transição CSS */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${isCategoryOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden"> {/* Para esconder o conteúdo ao fechar */}
                                                <div className="p-4 bg-white space-y-3">
                                                    {category.subCategories.map(subCategory => (
                                                        <div key={subCategory.type}>
                                                            <h4 className="font-semibold text-gray-700 text-base mb-2">{subCategory.type}</h4>
                                                            <ul className="space-y-1">
                                                                {subCategory.exercises.map(exercise => {
                                                                    const isSelected = selectedExercises.some(ex => ex.id === exercise.id);
                                                                    return (
                                                                        <li 
                                                                            key={exercise.id} 
                                                                            onClick={() => handleSelectExercise(exercise)}
                                                                            className={`p-2 rounded-md flex items-center cursor-pointer transition-colors 
                                                                                ${isSelected ? 'bg-violet-50 text-violet-800' : 'hover:bg-gray-100'}`}
                                                                        >
                                                                            {isSelected ? <CheckSquare className="w-5 h-5 text-violet-600 mr-3 flex-shrink-0" /> : <Square className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />}
                                                                            <span className={`text-base ${isSelected ? 'font-medium' : 'text-gray-800'}`}>{exercise.name}</span>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-6 border-t pt-4 flex-shrink-0">
                    <button 
                        onClick={handleAddClick} 
                        disabled={selectedExercises.length === 0}
                        className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Adicionar {selectedExercises.length > 0 ? `${selectedExercises.length} Exercício(s)` : 'Exercícios'}
                    </button>
                </div>
            </div>
        </div>
    );
}