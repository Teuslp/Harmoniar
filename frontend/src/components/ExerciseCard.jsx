// src/components/ExerciseCard.jsx

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, BarChart2 } from './Icons'; // Verifique se tem o BarChart2 em Icons.jsx

const RestTimer = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    return (
        <div className="text-sm font-bold text-orange-500">
            Descanso: 0:{timeLeft.toString().padStart(2, '0')}
        </div>
    );
};

export default function ExerciseCard({ exercise, onSetChange, onHistoryClick }) {
    const [setsData, setSetsData] = useState([]);
    const [isResting, setIsResting] = useState(false);

    // Inicializa o estado dos sets quando o componente é montado
    useEffect(() => {
        const [numSets] = exercise.series.split('x').map(Number);
        setSetsData(Array(numSets).fill({ weight: '', reps: '', completed: false }));
    }, [exercise]);

    const handleInputChange = (index, field, value) => {
        const newSetsData = [...setsData];
        newSetsData[index] = { ...newSetsData[index], [field]: value };
        setSetsData(newSetsData);
        onSetChange(exercise.name, newSetsData);
    };

    const handleCompleteSet = (index) => {
        const newSetsData = [...setsData];
        const isCompleted = !newSetsData[index].completed;
        newSetsData[index] = { ...newSetsData[index], completed: isCompleted };
        setSetsData(newSetsData);
        onSetChange(exercise.name, newSetsData);

        if (isCompleted) {
            setIsResting(true);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
                <button onClick={() => onHistoryClick(exercise.name)} className="p-2 text-gray-500 hover:text-violet-600">
                    <BarChart2 className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-3">
                {setsData.map((set, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                        <button onClick={() => handleCompleteSet(index)}>
                            {set.completed ? <CheckSquare className="w-6 h-6 text-violet-600" /> : <Square className="w-6 h-6 text-gray-400" />}
                        </button>
                        <span className="font-semibold text-gray-600">Série {index + 1}</span>
                        <input
                            type="number"
                            placeholder="kg"
                            value={set.weight}
                            onChange={(e) => handleInputChange(index, 'weight', e.target.value)}
                            className="w-20 p-2 border rounded-md text-center"
                        />
                        <input
                            type="number"
                            placeholder="reps"
                            value={set.reps}
                            onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                            className="w-20 p-2 border rounded-md text-center"
                        />
                    </div>
                ))}
            </div>
            {isResting && (
                <div className="mt-4 text-center">
                    <RestTimer duration={60} onComplete={() => setIsResting(false)} />
                </div>
            )}
        </div>
    );
}