// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Se estivermos a verificar a autenticação, mostramos uma mensagem de carregamento.
    // Isto evita um "piscar" para a página de login enquanto o token é verificado.
    if (loading) {
        return <div>A carregar aplicação...</div>;
    }

    // Se estiver autenticado, permite o acesso à rota filha (usando <Outlet />).
    // Se não, redireciona para a página de login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;