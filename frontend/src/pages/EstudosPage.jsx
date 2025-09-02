// src/pages/EstudosPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// --- Ícones ---
import { Plus, Edit, Trash, X, CheckCircle, Play, Pause, Coffee, Volume2, VolumeX, Wind, Users } from '../components/Icons';

// --- Componente para Gerar Áudio ---
const useAudio = () => {
    // ... (O seu código completo do hook useAudio vai aqui)
};


// --- Componente PomodoroModal (Completo) ---
const PomodoroModal = ({ isOpen, onClose, subjectName, onSessionComplete }) => {
    // ... (O seu código completo do PomodoroModal vai aqui)
};

// --- Componente AddEditSubjectModal (Completo) ---
const AddEditSubjectModal = ({ isOpen, onClose, onSave, subject }) => {
    // ... (O seu código completo do AddEditSubjectModal vai aqui)
};

// --- Componente CalendarView (Completo) ---
const CalendarView = ({ studiedDates }) => {
    // ... (O seu código completo do CalendarView vai aqui)
};

// --- Componente Principal da Página de Estudos ---
export default function EstudosPage() {
    const { user } = useAuth();
    const currentMood = user?.moodHistory?.slice(-1)[0]?.mood || 'neutro';

    const [subjects, setSubjects] = useState([]);
    const [studiedDates, setStudiedDates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [pomodoroModalOpen, setPomodoroModalOpen] = useState(false);
    const [addEditModalOpen, setAddEditModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjectToEdit, setSubjectToEdit] = useState(null);

    const fetchStudyData = async () => {
        try {
            const response = await api.get('/study');
            setSubjects(response.data.subjects);
            setStudiedDates(response.data.studiedDates.map(d => new Date(d).toISOString().slice(0, 10)));
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setSubjects([]);
                setStudiedDates([]);
            } else {
                setError('Não foi possível carregar os dados de estudo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyData();
    }, []);

    const handleSaveSubject = async (subjectData) => {
        try {
            if (subjectData._id) {
                await api.put(`/study/subjects/${subjectData._id}`, subjectData);
            } else {
                await api.post('/study/subjects', subjectData);
            }
            fetchStudyData();
        } catch (err) {
            console.error("Erro ao guardar matéria:", err);
            setError("Não foi possível guardar a matéria.");
        }
    };

    const handleDeleteSubject = async (id) => {
        try {
            await api.delete(`/study/subjects/${id}`);
            fetchStudyData();
        } catch (err) {
            console.error("Erro ao apagar matéria:", err);
            setError("Não foi possível apagar la matéria.");
        }
    };

    const handleOpenPomodoro = (subject) => {
        setSelectedSubject(subject);
        setPomodoroModalOpen(true);
    };

    const handleSessionComplete = async () => {
        if (!selectedSubject) return;
        try {
            await api.post('/study/log', { subjectId: selectedSubject._id });
            fetchStudyData();
        } catch (err) {
            console.error("Erro ao registar sessão:", err);
            setError("Não foi possível registar a sessão de estudo.");
        }
    };

    if (isLoading) {
        return <div>A carregar dados de estudo...</div>;
    }

    const moodSuggestions = {
        feliz: { title: "Ótimo dia para aprender!", text: "A sua energia está alta. É um momento perfeito para mergulhar numa sessão de estudos focada.", color: "bg-teal-50 border-teal-200 text-teal-800" },
        neutro: { title: "Pronto para progredir?", text: "Um passo de cada vez constrói o caminho. Que tal uma sessão Pomodoro para avançar nas suas metas?", color: "bg-amber-50 border-amber-200 text-amber-800" },
        triste: { title: "Seja gentil consigo mesmo.", text: "Hoje, talvez seja melhor descansar ou fazer uma atividade leve. Respeite o seu ritmo. O aprendizado pode esperar.", color: "bg-sky-50 border-sky-200 text-sky-800" }
    };
    const suggestion = moodSuggestions[currentMood];

    return (
        <>
            <div className="space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                <div className={`p-6 rounded-2xl shadow-sm border-l-4 ${suggestion.color}`}>
                    <h3 className="text-xl font-bold mb-2">{suggestion.title}</h3>
                    <p>{suggestion.text}</p>
                    {currentMood === 'triste' && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <Link to="/saude-mental" className="flex-1 flex items-center justify-center bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">
                                <Wind className="w-5 h-5 mr-2" />
                                Fazer Exercício de Respiração
                            </Link>
                             <Link to="/saude-mental" className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                                <Users className="w-5 h-5 mr-2" />
                                Ver Pessoas que me Motivam
                            </Link>
                        </div>
                    )}
                </div>

                {currentMood !== 'triste' && (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Matérias e Metas</h3>
                                <button onClick={() => { setSubjectToEdit(null); setAddEditModalOpen(true); }} className="flex items-center text-sm font-semibold text-violet-600 hover:text-violet-800"><Plus className="w-5 h-5 mr-1"/> Adicionar</button>
                            </div>
                            <ul className="space-y-4">
                                {subjects.map(subject => (
                                    <li key={subject._id} className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <span className="font-bold text-gray-800 mb-2 sm:mb-0">{subject.name}</span>
                                        <div className="w-full sm:w-auto flex items-center space-x-2">
                                            <div className="w-full sm:w-32"><p className="text-xs text-gray-500 text-right mb-1">{subject.progress}/{subject.weeklyGoal} sessões</p><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${(subject.progress / subject.weeklyGoal) * 100}%` }}></div></div></div>
                                            <button onClick={() => handleOpenPomodoro(subject)} className="bg-sky-500 text-white font-semibold py-1 px-3 rounded-lg text-sm hover:bg-sky-600">Estudar</button>
                                            <button onClick={() => { setSubjectToEdit(subject); setAddEditModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteSubject(subject._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash className="w-4 h-4"/></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <CalendarView studiedDates={studiedDates} />
                    </>
                )}
            </div>
            
            <AddEditSubjectModal isOpen={addEditModalOpen} onClose={() => setAddEditModalOpen(false)} onSave={handleSaveSubject} subject={subjectToEdit} />
            {selectedSubject && <PomodoroModal isOpen={pomodoroModalOpen} onClose={() => setPomodoroModalOpen(false)} subjectName={selectedSubject.name} onSessionComplete={handleSessionComplete} />}
        </>
    );
}