// src/components/MoodModal.jsx

import React, { useState } from 'react';
import api from '../services/api'; // 1. Importámos o nosso serviço de API

// --- Ícones (Copiados do seu ficheiro original) ---
const Smile = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const Meh = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const Frown = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// 2. A prop 'onSave' foi substituída por 'onSaveSuccess'
export default function MoodModal({ isOpen, onClose, onSaveSuccess }) {
    if (!isOpen) return null;
    
    const [selectedMood, setSelectedMood] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para feedback de loading
    const [error, setError] = useState(''); // Estado para feedback de erro

    const moods = [
        { id: 'feliz', icon: Smile, label: 'Feliz', color: 'text-teal-400', ringColor: 'ring-teal-500' },
        { id: 'neutro', icon: Meh, label: 'Neutro', color: 'text-amber-400', ringColor: 'ring-amber-500' },
        { id: 'triste', icon: Frown, label: 'Triste', color: 'text-sky-500', ringColor: 'ring-sky-500' }
    ];

    // 3. A função handleSave agora comunica com o backend
    const handleSave = async () => {
        if (!selectedMood) return;

        setIsLoading(true);
        setError('');
        try {
            // Usamos a rota que definimos para guardar o humor
            await api.post('/mental-health/mood', { mood: selectedMood });
            onSaveSuccess(); // Avisa o Dashboard que o registo foi guardado
        } catch (err) {
            console.error(err);
            setError('Não foi possível guardar o humor. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Como se sente hoje?</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <p className="text-gray-600 mb-8">O seu humor define o tom do seu dia. Selecione como se sente para personalizarmos a sua experiência.</p>
                <div className="flex justify-around items-center mb-8">
                    {moods.map(mood => {
                        const Icon = mood.icon;
                        return (
                            <div key={mood.id} className="flex flex-col items-center">
                                <button 
                                    onClick={() => setSelectedMood(mood.id)} 
                                    className={`p-2 rounded-full transform transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedMood === mood.id ? `ring-2 ${mood.ringColor}` : ''}`}>
                                    <Icon className={`w-16 h-16 sm:w-20 sm:h-20 ${mood.color}`} />
                                </button>
                                <span className={`mt-2 font-medium text-gray-700 ${selectedMood === mood.id ? 'font-bold' : ''}`}>{mood.label}</span>
                            </div>
                        )
                    })}
                </div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button onClick={handleSave} disabled={!selectedMood || isLoading} className="w-full bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {isLoading ? 'A Guardar...' : 'Guardar'}
                </button>
            </div>
        </div>
    );
};