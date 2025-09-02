// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Função interna para buscar dados do utilizador se houver um token
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/user/me');
                setUser(response.data);
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

    // Executa a verificação inicial quando a aplicação carrega
    useEffect(() => {
        fetchUserData();
    }, []);

    // Função para recarregar os dados do utilizador a pedido
    const refetchUser = async () => {
        setLoading(true);
        await fetchUserData();
    };

    // --- LÓGICA COMPLETA DE LOGIN ---
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            await fetchUserData(); // Busca os dados do user após login
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.errors[0]?.msg || 'Erro ao fazer login.' };
        }
    };

    // --- LÓGICA COMPLETA DE REGISTO ---
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            await fetchUserData(); // Busca os dados do user após registo
            return { success: true };
        } catch (error) {
             return { success: false, message: error.response?.data?.errors[0]?.msg || 'Erro ao fazer o registo.' };
        }
    };

    // --- LÓGICA COMPLETA DE LOGOUT ---
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, logout, register, refetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para facilitar o uso do contexto
export const useAuth = () => {
    return useContext(AuthContext);
};