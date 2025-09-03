// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppInitializer from './components/AppInitializer'; // 1. IMPORTAR O NOSSO NOVO "PORTEIRO"

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TreinoPage from './pages/TreinoPage';
import AlimentacaoPage from './pages/AlimentacaoPage';
import SaudeMentalPage from './pages/SaudeMentalPage';
import EstudosPage from './pages/EstudosPage';
import PerfilPage from './pages/PerfilPage';
import CreateWorkoutPage from './pages/CreateWorkoutPage'; 

/**
 * AppLayout: O nosso componente de layout principal.
 */
const AppLayout = () => {
    // O estado do sidebar mobile pode viver aqui para ser partilhado entre o Header (botão) e o Sidebar
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Podemos passar a função para o Header no futuro para um botão de menu */}
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
        return <div className="flex h-screen items-center justify-center">A carregar aplicação...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Rota Pública */}
                <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
                
                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    {/* 👇 2. O "PORTEIRO" AGORA ENVOLVE O LAYOUT PRINCIPAL 👇 */}
                    {/* Ele verifica se precisa de mostrar o modal de humor ANTES de mostrar o AppLayout */}
                    <Route element={<AppInitializer />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/treino" element={<TreinoPage />} />
                            <Route path="/alimentacao" element={<AlimentacaoPage />} />
                            <Route path="/saude-mental" element={<SaudeMentalPage />} />
                            <Route path="/estudos" element={<EstudosPage />} />
                            <Route path="/perfil" element={<PerfilPage />} />
                            <Route path="/treino/criar" element={<CreateWorkoutPage />} />
                            
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<div>Página não encontrada</div>} />
            </Routes>
        </BrowserRouter>
    );
}