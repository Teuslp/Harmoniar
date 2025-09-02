// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TreinoPage from './pages/TreinoPage';
import AlimentacaoPage from './pages/AlimentacaoPage';
import SaudeMentalPage from './pages/SaudeMentalPage';
import EstudosPage from './pages/EstudosPage';
import PerfilPage from './pages/PerfilPage';
// 👇 1. IMPORTAR A NOVA PÁGINA 👇
import CreateWorkoutPage from './pages/CreateWorkoutPage'; 

/**
 * AppLayout: O nosso componente de layout principal.
 */
const AppLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


export default function App() {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>A carregar aplicação...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Rota Pública */}
                <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
                
                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/treino" element={<TreinoPage />} />
                        <Route path="/alimentacao" element={<AlimentacaoPage />} />
                        <Route path="/saude-mental" element={<SaudeMentalPage />} />
                        <Route path="/estudos" element={<EstudosPage />} />
                        <Route path="/perfil" element={<PerfilPage />} />
                        
                        {/* 👇 2. ADICIONAR A NOVA ROTA PARA A PÁGINA DE CRIAÇÃO 👇 */}
                        <Route path="/treino/criar" element={<CreateWorkoutPage />} />
                        
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>

                <Route path="*" element={<div>Página não encontrada</div>} />
            </Routes>
        </BrowserRouter>
    );
}