import React, { useState, useEffect } from 'react';

// Ícone X movido para dentro do componente para evitar erros de importação.
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function BreathingModal({ isOpen, onClose }) {
    const [instruction, setInstruction] = useState('Comece a relaxar...');
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setInstruction('Comece a relaxar...');
            setCycle(0);
            return;
        }

        const breathingCycle = [
            { text: 'Inspire lentamente...', duration: 4000 },
            { text: 'Segure a respiração...', duration: 4000 },
            { text: 'Expire suavemente...', duration: 6000 },
            { text: 'Pausa.', duration: 2000 },
        ];
        
        // Define o próximo passo do ciclo de respiração
        const timer = setTimeout(() => {
            setInstruction(breathingCycle[cycle].text);
            setCycle((prevCycle) => (prevCycle + 1) % breathingCycle.length);
        }, breathingCycle[cycle].duration);

        // Limpa o timer quando o componente é desmontado ou o estado muda
        return () => clearTimeout(timer);
    }, [isOpen, cycle]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all duration-300 scale-95 animate-scale-in">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Respiração Guiada</h2>
                <p className="text-gray-600 mb-8">Siga as instruções e concentre-se no ritmo da sua respiração.</p>
                
                <div className="flex justify-center items-center h-48 mb-8">
                    <div className="w-40 h-40 bg-sky-100 rounded-full flex items-center justify-center animate-pulse-slow">
                        <div className="w-32 h-32 bg-sky-200 rounded-full"></div>
                    </div>
                </div>

                <p className="text-xl font-semibold text-sky-700 h-8 transition-opacity duration-500">{instruction}</p>
            </div>
        </div>
    );
}