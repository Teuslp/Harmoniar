import React, { useState } from 'react';

// Ícone
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function WeightModal({ isOpen, onClose, setWeightData }) {
    if (!isOpen) return null;

    const [currentWeight, setCurrentWeight] = useState("");

    const handleSave = () => {
        const newWeight = parseFloat(currentWeight);
        if (!isNaN(newWeight) && newWeight > 0) {
            setWeightData(prevData => {
                const change = newWeight - prevData.current;
                return { current: newWeight, change: change };
            });
            onClose();
        } else {
            alert("Por favor, insira um peso válido.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm transform transition-all duration-300 scale-95 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Registar novo peso</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <p className="text-gray-600 mb-6">Insira o seu peso atual abaixo. O progresso será atualizado no dashboard.</p>
                <div className="relative mb-6">
                    <input 
                        type="number" 
                        step="0.1" 
                        placeholder="Ex: 75.4" 
                        value={currentWeight} 
                        onChange={(e) => setCurrentWeight(e.target.value)} 
                        className="w-full p-4 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400">kg</span>
                </div>
                <button onClick={handleSave} disabled={!currentWeight} className="w-full bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Guardar</button>
            </div>
        </div>
    );
};