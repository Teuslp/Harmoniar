import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import MoodModal from '../components/MoodModal';
import WeightModal from '../components/WeightModal';

// --- Ícones ---
const Dumbbell = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.828l-1.768 1.768a2 2 0 1 1-2.828-2.828l10.607-10.607a2 2 0 1 1 2.828 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828l-1.768 1.768a2 2 0 1 1 2.828 2.828z"/><path d="m21.5 21.5-1.4-1.4"/><path d="m15.8 15.8-1.4-1.4"/><path d="m10.2 10.2 8.8 8.8"/><path d="m4.5 4.5-1.4-1.4"/></svg> );
const Apple = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg> );
const Brain = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.42.82 2.66 2 3.34V10a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h.5a2.5 2.5 0 0 1 2.5 2.5V17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 1-2-2V9.84c1.18-.68 2-1.92 2-3.34A4.5 4.5 0 0 0 12 2Z"/><path d="M12 13a2.5 2.5 0 0 0-2.5 2.5V17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1.5a2.5 2.5 0 0 0-2.5-2.5Z"/><path d="M12 22v-2"/><path d="M17 9.84A4.5 4.5 0 0 0 12.5 2"/><path d="M7 9.84A4.5 4.5 0 0 1 11.5 2"/></svg> );
const BookOpen = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> );
const Wind = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>;
const Zap = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

// --- Subcomponentes do Dashboard ---

const Greeting = ({ name }) => {
    const [greeting, setGreeting] = React.useState('');
    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bom dia');
        else if (hour < 18) setGreeting('Boa tarde');
        else setGreeting('Boa noite');
    }, []);
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{greeting}, {name}!</h1>
            <p className="text-gray-500">Vamos tornar o dia de hoje produtivo e equilibrado.</p>
        </div>
    );
};

const QuickActions = ({ onMoodClick, onWeightClick }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/treino" className="p-4 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors flex flex-col items-center text-center"><Dumbbell className="w-8 h-8 mb-2" /> Iniciar Treino</Link>
            <button onClick={onMoodClick} className="p-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors flex flex-col items-center text-center"><Brain className="w-8 h-8 mb-2" /> Registar Humor</button>
            <button onClick={onWeightClick} className="p-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex flex-col items-center text-center"><Apple className="w-8 h-8 mb-2" /> Registar Peso</button>
        </div>
    </div>
);

const TodaysFocus = ({ mood }) => {
    const focusOptions = {
        feliz: { title: "Aproveite a Energia!", text: "É um ótimo dia para um treino intenso. Que tal começar agora?", icon: Dumbbell, buttonText: "Ir para o Treino", page: "treino", color: "violet" },
        neutro: { title: "Foco e Progresso", text: "Um momento perfeito para avançar nos seus objetivos. Vamos estudar?", icon: BookOpen, buttonText: "Ir para os Estudos", page: "estudos", color: "sky" },
        triste: { title: "Momento de Calma", text: "Seja gentil consigo mesmo. Um exercício de respiração pode ajudar.", icon: Wind, buttonText: "Ir para Saúde Mental", page: "saudemental", color: "teal" }
    };
    const focus = focusOptions[mood];
    const Icon = focus.icon;
    return (
        <div className={`bg-${focus.color}-500 p-8 rounded-2xl shadow-lg text-white col-span-1 md:col-span-2`}>
            <Icon className="w-12 h-12 mb-4 opacity-75" />
            <h3 className="text-2xl font-bold mb-2">{focus.title}</h3>
            <p className="mb-6">{focus.text}</p>
            <Link to={`/${focus.page}`} className="bg-white text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                {focus.buttonText}
            </Link>
        </div>
    );
};

const SparklineChart = ({ data }) => {
    const width = 120;
    const height = 40;
    if (data.length === 0) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12"><polyline points={points} fill="none" stroke="#a78bfa" strokeWidth="2" /></svg>;
};

const WeightProgress = ({ weightHistory }) => {
    const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].value : 0;
    const chartData = weightHistory.map(entry => entry.value).slice(-7);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Progresso de Peso</h3>
                <p className="text-4xl font-bold text-gray-800 mt-2">{latestWeight.toFixed(1)} kg</p>
            </div>
            <div className="mt-4">
                <SparklineChart data={chartData} />
                <p className="text-xs text-center text-gray-400 mt-1">Últimos registos</p>
            </div>
        </div>
    );
};

// 👇 COMPONENTE QUE ESTAVA EM FALTA 👇
const MotivationalQuote = () => {
    const quotes = [
        "Acredite em si mesmo e tudo será possível.",
        "O segredo do progresso é começar.",
        "A consistência é mais importante que a perfeição.",
        "Cada pequeno passo na direção certa conta."
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center justify-center">
             <Zap className="w-8 h-8 mb-3 text-amber-400" />
            <p className="font-semibold text-gray-700">{quote}</p>
        </div>
    );
};

// --- Componente Principal da Página ---

export default function DashboardPage() {
    const { user, refetchUser } = useAuth();
    
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

    if (!user) {
        return <div>A carregar dashboard...</div>;
    }

    const handleSaveSuccess = () => {
        if(refetchUser) refetchUser();
        setIsMoodModalOpen(false);
        setIsWeightModalOpen(false);
    };

    const latestMood = user.moodHistory?.length > 0 ? user.moodHistory[user.moodHistory.length - 1].mood : 'neutro';

    return (
        <>
            <div className="space-y-8">
                <Greeting name={user.name} />
                <QuickActions 
                    onMoodClick={() => setIsMoodModalOpen(true)}
                    onWeightClick={() => setIsWeightModalOpen(true)}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TodaysFocus mood={latestMood} />
                    <WeightProgress weightHistory={user.weightHistory || []} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MotivationalQuote />
                 </div>
            </div>

            <MoodModal 
                isOpen={isMoodModalOpen} 
                onClose={() => setIsMoodModalOpen(false)} 
                onSaveSuccess={handleSaveSuccess}
            />
            <WeightModal 
                isOpen={isWeightModalOpen} 
                onClose={() => setIsWeightModalOpen(false)} 
                onSaveSuccess={handleSaveSuccess} 
            />
        </>
    );
}