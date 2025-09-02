import React from 'react';

// Componente Genérico para o Container das Páginas
const PageContainer = ({ title, children }) => (
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50/50">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        {children}
    </div>
);

export const AlimentacaoPage = () => <PageContainer title="Módulo de Alimentação"><p className="text-gray-600">Dicas de alimentação, receitas e o seu progresso de peso.</p></PageContainer>;
export const SaudeMentalPage = () => <PageContainer title="Módulo de Saúde Mental"><p className="text-gray-600">Registe o seu humor, aceda ao seu diário de gratidão e exercícios de respiração.</p></PageContainer>;
export const EstudosPage = () => <PageContainer title="Módulo de Estudos"><p className="text-gray-600">Acompanhe os seus estudos, metas e use a técnica Pomodoro.</p></PageContainer>;
export const PerfilPage = () => <PageContainer title="Perfil e Progresso"><p className="text-gray-600">As suas configurações, conquistas e progresso geral.</p></PageContainer>;
