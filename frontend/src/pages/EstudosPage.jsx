import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash, ChevronDown  } from '../components/Icons';
import PomodoroModal from '../components/PomodoroModal';
import StudyStatsDashboard from '../components/StudyStatsDashboard';
import AddEditSubjectModal from '../components/AddEditSubjectModal';
import StudyHistory from '../components/StudyHistory';

export default function EstudosPage() {

    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState({}); // NOVO ESTADO PARA AS ESTATÍSTICAS
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [pomodoroModalOpen, setPomodoroModalOpen] = useState(false);
    const [addEditModalOpen, setAddEditModalOpen] = useState(false); // Para adicionar/editar matéria
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    const [expandedSubjectId, setExpandedSubjectId] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Buscamos os dados em paralelo para mais performance
            const [subjectsRes, statsRes] = await Promise.all([
                api.get('/study'),
                api.get('/study/stats')
            ]);

            setSubjects(subjectsRes.data.subjects);
            setStats(statsRes.data);

        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar os dados de estudo.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSubject = async (subjectData) => {
        // Esta função continua igual, pois a API de CRUD não mudou
        try {
            if (subjectData._id) {
                await api.put(`/study/subjects/${subjectData._id}`, subjectData);
            } else {
                await api.post('/study/subjects', subjectData);
            }
            fetchData(); // Re-busca todos os dados para manter tudo atualizado
            setAddEditModalOpen(false);
        } catch (err) {
            console.error("Erro ao guardar matéria:", err);
            setError("Não foi possível guardar a matéria.");
        }
    };

    const handleDeleteSubject = async (id) => {
        // Esta função também continua igual
        try {
            await api.delete(`/study/subjects/${id}`);
            fetchData();
        } catch (err) {
            console.error("Erro ao apagar matéria:", err);
            setError("Não foi possível apagar a matéria.");
        }
    };

    const handleOpenPomodoro = (subject) => {
        setSelectedSubject(subject);
        setPomodoroModalOpen(true);
    };

    const handleToggleHistory = (subjectId) => {
        if (expandedSubjectId === subjectId) {
            setExpandedSubjectId(null); // Se já estiver aberto, fecha
        } else {
            setExpandedSubjectId(subjectId); // Abre o clicado
        }
    };

    // FUNÇÃO ATUALIZADA PARA A NOVA API
    const handleSessionComplete = async (sessionData) => {
        if (!selectedSubject) return;
        try {
            await api.post('/study/log-session', {
                subjectId: selectedSubject._id,
                duration: sessionData.duration,
                objective: sessionData.objective,
                completedObjective: sessionData.completedObjective,
            });
            fetchData(); // Re-busca todos os dados para atualizar o dashboard
        } catch (err) {
            console.error("Erro ao registar sessão:", err);
            setError("Não foi possível registar a sessão de estudo.");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">A carregar dados de estudo...</div>;
    }

    // A lógica de sugestão de humor continua a mesma aqui...

    return (
        <>
            <div className="space-y-8">
                {/* O seu componente de sugestão de humor vem aqui... */}

                {/* NOSSO NOVO DASHBOARD */}
                <StudyStatsDashboard stats={stats} />

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Matérias e Metas</h3>
                        <button
                            onClick={() => { setSubjectToEdit(null); setAddEditModalOpen(true); }}
                            className="flex items-center text-sm font-semibold text-violet-600 hover:text-violet-800">
                            <Plus className="w-5 h-5 mr-1" /> Adicionar Matéria
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {subjects.length > 0 ? subjects.map(subject => {
                            const progress = subject.studyLog ? subject.studyLog.length : 0;
                            const goal = subject.weeklyGoal;
                            const progressPercentage = goal > 0 ? (progress / goal) * 100 : 0;
                            const isExpanded = expandedSubjectId === subject._id;

                            return (
                                <li key={subject._id} className="bg-gray-50 rounded-lg transition-shadow duration-300 hover:shadow-md">
                                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <span className="font-bold text-gray-800">{subject.name}</span>
                                        <div className="w-full sm:w-auto flex items-center space-x-2">
                                            <div className="w-full sm:w-32">
                                                <p className="text-xs text-gray-500 text-right mb-1">{progress}/{goal} sessões</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleOpenPomodoro(subject)} className="bg-sky-500 text-white font-semibold py-1 px-3 rounded-lg text-sm hover:bg-sky-600">Estudar</button>
                                            <button onClick={() => { setSubjectToEdit(subject); setAddEditModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteSubject(subject._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash className="w-4 h-4" /></button>

                                            {/* BOTÃO PARA EXPANDIR O HISTÓRICO */}
                                            <button onClick={() => handleToggleHistory(subject._id)} className="p-2 text-gray-500 hover:text-violet-600">
                                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* ÁREA DO HISTÓRICO EXPANSÍVEL */}
                                    {isExpanded && (
                                        <StudyHistory logs={subject.studyLog} />
                                    )}
                                </li>
                            );
                        }) : (
                            <p className="text-center text-gray-500 py-4">Nenhuma matéria adicionada ainda.</p>
                        )}
                    </ul>
                </div>
            </div>

            {/* O modal de adicionar/editar matéria continua o mesmo */}
            <AddEditSubjectModal isOpen={addEditModalOpen} onClose={() => setAddEditModalOpen(false)} onSave={handleSaveSubject} subject={subjectToEdit} />

            <PomodoroModal
                isOpen={pomodoroModalOpen}
                onClose={() => setPomodoroModalOpen(false)}
                subjectName={selectedSubject ? selectedSubject.name : ''}
                onSessionComplete={handleSessionComplete}
            />
        </>
    );
}