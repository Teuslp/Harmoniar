// src/components/AppInitializer.jsx

import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MoodModal from './MoodModal'; // Importa o seu modal de humor

const AppInitializer = () => {
    const { needsMoodLog, completeMoodLog } = useAuth();
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

    // useEffect para abrir o modal se o contexto disser que é necessário
    useEffect(() => {
        if (needsMoodLog) {
            setIsMoodModalOpen(true);
        }
    }, [needsMoodLog]);

    const handleMoodSaveSuccess = () => {
        // Quando o humor é guardado com sucesso:
        // 1. Avisa o contexto que a tarefa foi concluída
        completeMoodLog(); 
        // 2. Fecha o modal
        setIsMoodModalOpen(false);
    };

    // Se o modal de humor precisa de ser mostrado, mostramos APENAS o modal
    // num fundo simples. O resto da aplicação (Outlet) não é renderizado.
    if (needsMoodLog && isMoodModalOpen) {
        return (
            <div className="w-full h-screen bg-gray-100">
                <MoodModal 
                    isOpen={isMoodModalOpen}
                    // O onClose é desativado para obrigar o utilizador a registar
                    onClose={() => {}} 
                    onSaveSuccess={handleMoodSaveSuccess}
                />
            </div>
        );
    }
    
    // Se não precisa de registo de humor, renderiza o resto da aplicação
    return <Outlet />;
};

export default AppInitializer;