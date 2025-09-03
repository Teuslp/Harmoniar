// src/pages/SaudeMentalPage.jsx

import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// --- Ícones ---
// Alteração: 'Book' foi trocado por 'BookOpen' para corresponder ao seu Icons.jsx
import { Brain, Wind, Plus, Trash, X, BookOpen } from '../components/Icons';

// --- Subcomponente BreathingModal (Completo) ---
const BreathingModal = ({ isOpen, onClose }) => {
    const [instruction, setInstruction] = useState('Comece a relaxar...');
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setInstruction('Comece a relaxar...');
            setCycle(0);
            return;
        }
        const breathingCycle = [
            { text: 'Inspire lentamente...', duration: 4000 },
            { text: 'Segure a respiração...', duration: 4000 },
            { text: 'Expire suavemente...', duration: 6000 },
            { text: 'Pausa.', duration: 2000 },
        ];
        const timer = setTimeout(() => {
            setInstruction(breathingCycle[cycle].text);
            setCycle((prevCycle) => (prevCycle + 1) % breathingCycle.length);
        }, breathingCycle[cycle].duration);
        return () => clearTimeout(timer);
    }, [isOpen, cycle]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Respiração Guiada</h2>
                <p className="text-gray-600 mb-8">Siga as instruções e concentre-se no ritmo da sua respiração.</p>
                <div className="flex justify-center items-center h-48 mb-8">
                    <div className="w-40 h-40 bg-sky-100 rounded-full flex items-center justify-center animate-pulse-slow">
                        <div className="w-32 h-32 bg-sky-200 rounded-full"></div>
                    </div>
                </div>
                <p className="text-xl font-semibold text-sky-700 h-8 transition-opacity duration-500">{instruction}</p>
            </div>
        </div>
    );
};

// --- Subcomponente GratitudeModal (Completo) ---
const GratitudeModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const [newEntry, setNewEntry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (newEntry.trim() === '') return;
        setIsLoading(true);
        setError('');
        try {
            await api.post('/mental-health/gratitude', { text: newEntry.trim() });
            setNewEntry('');
            onSaveSuccess();
        } catch (err) {
            setError('Não foi possível guardar a nota.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Diário de Gratidão</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-4">
                    <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} rows="3" placeholder="Hoje sou grato(a) por..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"/>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button onClick={handleSave} disabled={isLoading} className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-amber-300">
                        {isLoading ? 'A Adicionar...' : 'Adicionar à Lista'}
                    </button>
                </div>
                <button onClick={onClose} className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Fechar</button>
            </div>
        </div>
    );
};

// --- Componente Principal da Página ---
export default function SaudeMentalPage() {
    const { user } = useAuth();
    
    const [motivationalPeople, setMotivationalPeople] = useState([]);
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [breathingModalOpen, setBreathingModalOpen] = useState(false);
    const [gratitudeModalOpen, setGratitudeModalOpen] = useState(false);
    const [newPersonName, setNewPersonName] = useState('');

    const fetchData = async () => {
        try {
            const response = await api.get('/mental-health');
            setMotivationalPeople(response.data.motivationalPeople);
            setGratitudeEntries(response.data.gratitudeEntries);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setMotivationalPeople([]);
                setGratitudeEntries([]);
            } else {
                setError("Não foi possível carregar os seus dados.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddPerson = async () => {
        if (newPersonName.trim() === '') return;
        try {
            await api.post('/mental-health/people', { name: newPersonName.trim() });
            setNewPersonName('');
            fetchData();
        } catch (err) {
             alert("Não foi possível adicionar a pessoa. (Função a ser implementada no backend)");
        }
    };
    const handleRemovePerson = async (personId) => {
        try {
            await api.delete(`/mental-health/people/${personId}`);
            fetchData();
        } catch (err) {
             alert("Não foi possível remover a pessoa. (Função a ser implementada no backend)");
        }
    };

    const getDailyMessage = () => {
        if (!user) return "Carregando...";
        const person = motivationalPeople.length > 0 ? motivationalPeople[Math.floor(Math.random() * motivationalPeople.length)] : user.name;
        const messages = [
            `Lembre-se da sua força. ${person} acredita em si.`,
            `Um pequeno passo de cada vez é tudo o que precisa. Continue firme.`,
            `Hoje é um bom dia para se orgulhar de quão longe já chegou. ${person} está a torcer por si.`
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };
    
    if (isLoading) return <div>A carregar...</div>;

    return (
        <>
            <div className="space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                     <p className="text-center text-lg text-gray-700 italic">"{getDailyMessage()}"</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Caixa de Ferramentas de Bem-Estar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => setBreathingModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"><Wind className="w-10 h-10 text-sky-500 mb-2" /><span className="font-semibold text-sky-800">Respiração</span></button>
                        <button onClick={() => setGratitudeModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                            <BookOpen className="w-10 h-10 text-amber-500 mb-2" />
                            <span className="font-semibold text-amber-800">Diário de Gratidão</span>
                        </button>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">A sua Rede de Apoio</h3>
                     <div className="flex space-x-2 mb-4">
                        <input type="text" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} placeholder="Nome de alguém importante" className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"/>
                        <button onClick={handleAddPerson} className="p-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"><Plus className="w-6 h-6"/></button>
                    </div>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {motivationalPeople.length > 0 ? motivationalPeople.map((person, index) => (
                            <li key={person._id || index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                <span className="text-gray-700">{person.name || person}</span>
                                <button onClick={() => handleRemovePerson(person._id)} className="text-gray-400 hover:text-red-500"><Trash className="w-5 h-5"/></button>
                            </li>
                        )) : <p className="text-center text-gray-500">Adicione pessoas que o inspiram.</p>}
                    </ul>
                </div>
            </div>
            
            <BreathingModal isOpen={breathingModalOpen} onClose={() => setBreathingModalOpen(false)} />
            <GratitudeModal 
                isOpen={gratitudeModalOpen} 
                onClose={() => setGratitudeModalOpen(false)}
                onSaveSuccess={() => {
                    fetchData();
                    setGratitudeModalOpen(false);
                }}
            />
        </>
    );
}