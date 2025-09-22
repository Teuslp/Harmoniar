// src/components/PomodoroModal.jsx

import React, { useState, useEffect } from 'react';
import { Play, Pause, X } from './Icons'; // Certifique-se de importar os ícones

export default function PomodoroModal({ isOpen, onClose, subjectName, onSessionComplete }) {
    const DURATION = 25 * 60; // 25 minutos
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [isRunning, setIsRunning] = useState(false);
    
    // Estado para a meta da sessão
    const [objective, setObjective] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reseta o modal quando ele é fechado
            setIsRunning(false);
            setTimeLeft(DURATION);
            setObjective('');
        }
    }, [isOpen]);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Sessão concluída!
            setIsRunning(false);
            handleComplete();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleComplete = () => {
        // Chama a função do componente pai com os dados da sessão
        onSessionComplete({
            duration: 25, // Duração em minutos
            objective: objective,
            completedObjective: true // Podemos adicionar um feedback para isso depois
        });
        onClose(); // Fecha o modal
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sessão de Foco</h2>
                <p className="text-gray-600 mb-6">Matéria: <span className="font-semibold text-violet-600">{subjectName}</span></p>

                {/* Campo para a Meta da Sessão */}
                <div className="mb-6">
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
                        Qual sua meta para esta sessão?
                    </label>
                    <input
                        type="text"
                        id="objective"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        placeholder="Ex: Ler o capítulo 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
                        disabled={isRunning} // Desabilita o campo quando o timer está rodando
                    />
                </div>

                <div className="text-7xl font-mono text-center mb-8 bg-gray-100 p-4 rounded-lg">
                    {formatTime(timeLeft)}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        disabled={!objective.trim()} // Desabilita o botão se não houver meta
                        className={`w-full flex items-center justify-center py-3 px-6 rounded-lg text-white font-bold transition ${
                            !objective.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : isRunning
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-violet-600 hover:bg-violet-700'
                        }`}
                    >
                        {isRunning ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
                        {isRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                </div>
            </div>
        </div>
    );
}