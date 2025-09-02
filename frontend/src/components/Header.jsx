// src/components/Header.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';

// Um "mapa" para associar a URL (pathname) ao título da página
const pageTitles = {
    '/dashboard': "Dashboard",
    '/treino': "Treino",
    '/alimentacao': "Alimentação",
    '/saude-mental': "Saúde Mental",
    '/estudos': "Estudos",
    '/perfil': "Perfil",
};

export default function Header() {
    // 1. Usamos o hook useLocation para obter informações sobre a URL atual
    const location = useLocation();

    // 2. Pegamos o caminho da URL (ex: "/dashboard") e encontramos o título correspondente no nosso mapa
    const pageTitle = pageTitles[location.pathname] || "Harmoniar";

    return (
        <header className="bg-white shadow-sm p-4 md:p-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
                {/* 3. Usamos o título que encontrámos */}
                {pageTitle}
            </h1>
            {/* No futuro, podemos adicionar aqui um botão de menu para mobile */}
        </header>
    );
}