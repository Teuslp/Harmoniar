// src/components/ExerciseHistoryModal.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import { X } from './Icons';

export default function ExerciseHistoryModal({ isOpen, onClose, exerciseName }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && exerciseName) {
            const fetchHistory = async () => {
                setIsLoading(true);
                try {
                    const res = await api.get(`/workout/history/${exerciseName}`);
                    setHistory(res.data);
                } catch (err) {
                    console.error("Erro ao buscar histórico do exercício:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHistory();
        }
    }, [isOpen, exerciseName]);

    if (!isOpen) return null;

    const chartData = {
        labels: history.map(h => new Date(h.date).toLocaleDateString('pt-BR')),
        datasets: [{
            label: `Carga Máxima (kg) para ${exerciseName}`,
            data: history.map(h => h.maxWeight),
            fill: false,
            borderColor: '#8b5cf6',
            tension: 0.1,
        }],
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Progressão de Carga</h3>
                
                {isLoading ? (
                    <p>A carregar histórico...</p>
                ) : history.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>Nenhum histórico encontrado para este exercício.</p>
                )}
            </div>
        </div>
    );
}