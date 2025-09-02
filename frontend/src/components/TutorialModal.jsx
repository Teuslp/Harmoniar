import React from 'react';

// Ícone X movido para dentro do componente para evitar erros de importação.
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function TutorialModal({ isOpen, onClose, exercise }) {
    // Não renderiza nada se não estiver aberto ou se não houver um exercício selecionado
    if (!isOpen || !exercise) return null;

    return (
        // Overlay de fundo
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            {/* Conteúdo do Modal */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg transform transition-all duration-300 scale-95 animate-scale-in">
                {/* Cabeçalho */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{exercise.nome}</h2>
                        <p className="text-gray-500">{exercise.series}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Imagem/GIF do Tutorial */}
                <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                        src={exercise.gifUrl || 'https://placehold.co/600x400/e2e8f0/a0aec0?text=Tutorial'} 
                        alt={`Tutorial para ${exercise.nome}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Descrição do Exercício */}
                <div>
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">Instruções</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                        {exercise.description}
                    </p>
                </div>

                {/* Botão de Fechar */}
                <button onClick={onClose} className="mt-6 w-full bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-violet-700 transition-colors">
                    Fechar
                </button>
            </div>
        </div>
    );
}