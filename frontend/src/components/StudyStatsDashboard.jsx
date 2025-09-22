// src/components/StudyStatsDashboard.jsx

import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function StudyStatsDashboard({ stats }) {
    const pieData = {
        labels: Object.keys(stats.timePerSubject || {}),
        datasets: [{
            data: Object.values(stats.timePerSubject || {}),
            backgroundColor: ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    const barData = {
        labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [{
            label: 'Minutos Estudados',
            data: Array.from({ length: 7 }, (_, i) => stats.dailySummary?.[i] || 0),
            backgroundColor: '#a78bfa',
            borderRadius: 5,
        }],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Tempo de Estudo por Dia (minutos)' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    const hasData = Object.keys(stats.timePerSubject || {}).length > 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Dashboard de Estudos da Semana</h3>
            {hasData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="lg:max-h-64 flex justify-center">
                        <Pie data={pieData} options={{ responsive: true, plugins: { title: { display: true, text: 'Distribuição por Matéria' } } }} />
                    </div>
                    <div>
                        <Bar options={barOptions} data={barData} />
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p>Ainda não há dados de estudo para esta semana.</p>
                    <p className="text-sm">Complete uma sessão para começar a ver suas estatísticas!</p>
                </div>
            )}
        </div>
    );
}