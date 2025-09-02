// src/pages/AlimentacaoPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Ícones (Completos) ---
const Target = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const Check = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>;
const TrendingUp = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;

// --- Subcomponentes ---

const RefeicaoCard = ({ titulo, opcoes }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">{titulo}</h4>
        <ul className="space-y-1">
            {opcoes.map((opcao, index) => (
                <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{opcao}</span>
                </li>
            ))}
        </ul>
    </div>
);

const WeightChart = ({ data }) => {
    if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-center text-gray-500">Dados insuficientes para exibir o gráfico.</div>;

    const width = 300;
    const height = 100;
    const padding = 20;

    const pesos = data.map(p => p.value); // Alterado de p.peso para p.value para corresponder ao modelo
    const minPeso = Math.min(...pesos) - 1;
    const maxPeso = Math.max(...pesos) + 1;

    const getX = (index) => padding + (index / (data.length - 1)) * (width - padding * 2);
    const getY = (peso) => height - padding - ((peso - minPeso) / (maxPeso - minPeso)) * (height - padding * 2);

    const linePoints = data.map((point, i) => `${getX(i)},${getY(point.value)}`).join(' ');

    return (
        <div className="flex justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-40">
                <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" points={linePoints} />
                {data.map((point, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(point.value)} r="3" fill="#8b5cf6" />
                ))}
            </svg>
        </div>
    );
};

// --- Componente Principal da Página ---

export default function AlimentacaoPage() {
    const [nutritionData, setNutritionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNutritionData = async () => {
        try {
            const response = await api.get('/nutrition');
            setNutritionData(response.data);
            setError('');
        } catch (err) {
            console.error("Erro ao buscar dados de alimentação:", err);
            if (err.response && err.response.status === 404) {
                setError("Ainda não há dados de alimentação. Defina um foco para começar.");
                setNutritionData(null); 
            } else {
                setError("Não foi possível carregar os seus dados de alimentação.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNutritionData();
    }, []);

    const handleFocusChange = async (newFocus) => {
        try {
            await api.put('/nutrition/focus', { focus: newFocus });
            fetchNutritionData(); // Recarrega todos os dados para refletir a nova sugestão
        } catch (err) {
            console.error("Erro ao atualizar foco:", err);
            setError("Não foi possível atualizar o seu foco. Tente novamente.");
        }
    };

    if (isLoading) {
        return <div>A carregar o seu plano de alimentação...</div>;
    }

    const focos = [
        { id: 'emagrecer', label: 'Emagrecer' },
        { id: 'manter', label: 'Manter Peso' },
        { id: 'ganharMassa', label: 'Ganhar Massa' }
    ];

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-violet-500 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">Qual é o seu foco atual?</h3>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    {focos.map(item => (
                        <button key={item.id} onClick={() => handleFocusChange(item.id)} className={`flex-1 p-3 rounded-lg text-center font-semibold transition-all duration-200 ${nutritionData?.userFocus === item.id ? 'bg-violet-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-violet-100'}`}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {nutritionData && (
                <>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center mb-4">
                            <TrendingUp className="w-6 h-6 text-violet-500 mr-3" />
                            <h3 className="text-xl font-bold text-gray-800">Evolução de Peso</h3>
                        </div>
                        <WeightChart data={nutritionData.weightHistory} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-gray-700 text-center italic mb-6">"{nutritionData.suggestions.dica}"</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <RefeicaoCard titulo="Café da Manhã" opcoes={nutritionData.suggestions.refeicoes["Café da Manhã"]} />
                            <RefeicaoCard titulo="Almoço" opcoes={nutritionData.suggestions.refeicoes["Almoço"]} />
                            <RefeicaoCard titulo="Jantar" opcoes={nutritionData.suggestions.refeicoes["Jantar"]} />
                            <RefeicaoCard titulo="Lanches" opcoes={nutritionData.suggestions.refeicoes["Lanches"]} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}