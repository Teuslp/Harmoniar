// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // NOVO ESTADO: Controla se o modal de humor deve ser mostrado
    const [needsMoodLog, setNeedsMoodLog] = useState(false);

    // Função atualizada para usar a rota /status
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // USA A NOVA ROTA /status
                const response = await api.get('/user/status');
                setUser(response.data.user);
                setNeedsMoodLog(response.data.needsMoodLog);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Sessão inválida:", error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const refetchUser = async () => {
        // setLoading(true) não é mais necessário aqui para evitar piscar a tela
        await fetchUserData();
    };

    // As funções de login e registo agora usam fetchUserData que já lida com o /status
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            await fetchUserData();
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.errors[0]?.msg || 'Erro ao fazer login.' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', response.data.token);
            await fetchUserData();
            return { success: true };
        } catch (error) {
             return { success: false, message: error.response?.data?.errors[0]?.msg || 'Erro ao fazer o registo.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setNeedsMoodLog(false);
    };

    // NOVA FUNÇÃO: Para o modal de humor avisar que o registo foi feito
    const completeMoodLog = () => {
        setNeedsMoodLog(false);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, needsMoodLog, login, logout, register, refetchUser, completeMoodLog }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};