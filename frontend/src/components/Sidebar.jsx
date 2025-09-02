// src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Dumbbell, Apple, Brain, BookOpen, UserCircle, LogOut } from './Icons';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'treino', label: 'Treino', icon: Dumbbell, path: '/treino' },
    { id: 'alimentacao', label: 'Alimentação', icon: Apple, path: '/alimentacao' },
    { id: 'saudemental', label: 'Saúde Mental', icon: Brain, path: '/saude-mental' },
    { id: 'estudos', label: 'Estudos', icon: BookOpen, path: '/estudos' },
    { id: 'perfil', label: 'Perfil', icon: UserCircle, path: '/perfil' },
];

export default function Sidebar({ isSidebarOpen, setSidebarOpen }) {
    const { user, logout } = useAuth();

    const SidebarContent = () => {
        if (!user) {
            return <div>A carregar...</div>;
        }

        return (
            <div className="flex flex-col h-full">
                {/* Secção Superior: Logo e Perfil */}
                <div>
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-violet-500 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M12 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Harmoniar</h2>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 mb-6 border-y border-violet-200/50">
                        <img className="h-20 w-20 rounded-full object-cover mb-3" src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=d8b4fe&color=334155`} alt="Foto de Perfil" />
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
                
                {/* Secção Central: Navegação */}
                <nav className="flex-grow">
                    <ul>
                        {navItems.map(item => (
                             <li key={item.id} className="relative">
                                <NavLink
                                    to={item.path}
                                    onClick={() => { if (isSidebarOpen) setSidebarOpen(false); }}
                                    className={({ isActive }) => 
                                        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                                            isActive
                                                ? 'bg-violet-600 text-white shadow-md'
                                                : 'text-gray-600 hover:bg-violet-100 hover:text-violet-800'
                                        }`
                                    }
                                >
                                    {/* 👇 AQUI ESTÁ A CORREÇÃO PRINCIPAL 👇 */}
                                    {/* Todo o conteúdo do link agora está dentro de um Fragment <>...</> 
                                        retornado pela função ({ isActive }) => ... */}
                                    {({ isActive }) => (
                                        <>
                                            {isActive && <span className="absolute -left-4 h-6 w-1 bg-violet-600 rounded-r-full"></span>}
                                            <item.icon className={`w-6 h-6 mr-4`} />
                                            <span className="font-medium">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Secção Inferior: Logout */}
                <div className="mt-auto">
                    <button onClick={logout} className="w-full flex items-center justify-center bg-violet-100/80 text-violet-800 font-semibold py-2 px-3 rounded-lg hover:bg-violet-200 transition-colors text-sm">
                        <LogOut className="w-4 h-4 mr-2" />
                        Terminar Sessão
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Sidebar para Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-violet-50 via-gray-50 to-white border-r border-gray-200 p-4">
                <SidebarContent />
            </aside>
            
            {/* Sidebar para Mobile (com overlay) */}
            <div className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)}>
                <aside className={`absolute top-0 left-0 h-full w-64 bg-gradient-to-b from-violet-50 via-gray-50 to-white border-r border-gray-200 p-4 z-40 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
                    <SidebarContent />
                </aside>
            </div>
        </>
    );
}