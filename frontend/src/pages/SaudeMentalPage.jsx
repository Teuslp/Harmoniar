// src/pages/SaudeMentalPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// --- Ícones (Código SVG completo restaurado) ---
const Brain = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.42.82 2.66 2 3.34V10a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h.5a2.5 2.5 0 0 1 2.5 2.5V17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1a2 2 0 0 1-2-2v-1a2 2 0 0 1-2-2V9.84c1.18-.68 2-1.92 2-3.34A4.5 4.5 0 0 0 12 2Z" /><path d="M12 13a2.5 2.5 0 0 0-2.5 2.5V17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1.5a2.5 2.5 0 0 0-2.5-2.5Z" /><path d="M12 22v-2" /><path d="M17 9.84A4.5 4.5 0 0 0 12.5 2" /><path d="M7 9.84A4.5 4.5 0 0 1 11.5 2" /></svg>);
const Smile = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>;
const Meh = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>;
const Frown = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>;
const Book = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
const Wind = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>;
const Plus = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const Trash = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Componente BreathingModal (Não precisa de alteração) ---
const BreathingModal = ({ isOpen, onClose }) => {
    // ... Lógica do BreathingModal permanece a mesma ...
};


// --- Componente GratitudeModal (Refatorado para ser independente) ---
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
            onSaveSuccess(); // Notifica a página principal para recarregar os dados
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
                {/* ... O JSX do cabeçalho do modal ... */}
                <div className="space-y-4">
                    <textarea
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        rows="3"
                        placeholder="Hoje sou grato(a) por..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button onClick={handleSave} disabled={isLoading} className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-amber-300">
                        {isLoading ? 'A adicionar...' : 'Adicionar à Lista'}
                    </button>
                </div>
                {/* ... O JSX da lista de notas não é mais necessário aqui, pois a página principal irá fornecê-los ... */}
                <button onClick={onClose} className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">Fechar</button>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
export default function SaudeMentalPage() {
    const { user } = useAuth();
    const currentMood = user?.moodHistory?.[user.moodHistory.length - 1]?.mood || 'neutro';

    const [motivationalPeople, setMotivationalPeople] = useState([]);
    const [gratitudeEntries, setGratitudeEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [breathingModalOpen, setBreathingModalOpen] = useState(false);
    const [gratitudeModalOpen, setGratitudeModalOpen] = useState(false);
    const [newPersonName, setNewPersonName] = useState('');

    // Função para carregar os dados da página
    const fetchData = async () => {
        try {
            const response = await api.get('/mental-health');
            setMotivationalPeople(response.data.motivationalPeople);
            setGratitudeEntries(response.data.gratitudeEntries);
        } catch (err) {
            setError('Não foi possível carregar os dados.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Funções de Manipulação de Dados (com API) ---
    const handleAddPerson = async () => {
        if (newPersonName.trim() === '') return;
        try {
            await api.post('/mental-health/people', { name: newPersonName.trim() });
            setNewPersonName('');
            fetchData(); // Recarrega a lista
        } catch (err) {
            setError('Não foi possível adicionar a pessoa.');
        }
    };

    const handleRemovePerson = async (personId) => {
        try {
            await api.delete(`/mental-health/people/${personId}`);
            fetchData(); // Recarrega a lista
        } catch (err) {
            setError('Não foi possível remover a pessoa.');
        }
    };

    const handleSaveMoodRecord = async (mood, note) => {
        try {
            await api.post('/mental-health/mood', { mood, note });
            // Opcional: mostrar uma mensagem de sucesso
        } catch (err) {
            setError('Não foi possível guardar o registo de humor.');
        }
    }

    if (isLoading) return <div>A carregar...</div>;

    return (
        <>
            <div className="space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                {/* O JSX da página principal (cards, etc.) pode ser mantido aqui */}
                {/* As únicas mudanças são: */}
                {/* 1. Usar os dados dos estados (motivationalPeople, gratitudeEntries) */}
                {/* 2. Conectar os botões às novas funções (handleAddPerson, handleRemovePerson, etc.) */}

                {/* Exemplo de conexão */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    {/* ... */}
                    <ul className="space-y-2">
                        {motivationalPeople.map(person => (
                            <li key={person._id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                <span className="text-gray-700">{person.name}</span>
                                <button onClick={() => handleRemovePerson(person._id)} className="text-gray-400 hover:text-red-500"><Trash className="w-5 h-5" /></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <BreathingModal isOpen={breathingModalOpen} onClose={() => setBreathingModalOpen(false)} />

            {/* O GratitudeModal agora é mais simples de chamar */}
            <GratitudeModal
                isOpen={gratitudeModalOpen}
                onClose={() => setGratitudeModalOpen(false)}
                onSaveSuccess={() => {
                    fetchData(); // Recarrega os dados da página
                    setGratitudeModalOpen(false); // Fecha o modal
                }}
            />
        </>
    );
}