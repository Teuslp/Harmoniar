import React from 'react';
// A LINHA DE IMPORTAÇÃO DOS ÍCONES FOI REMOVIDA

export default function StudyHistory({ logs }) {
    
    if (!logs || logs.length === 0) {
        return <p className="text-sm text-gray-500 mt-4 px-4">Nenhuma sessão registrada para esta matéria ainda.</p>;
    }

    // Ordena os logs da data mais recente para a mais antiga
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="mt-4 border-t border-gray-200 pt-4 px-4">
            <h4 className="text-sm font-bold text-gray-600 mb-3">Histórico de Sessões</h4>
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {sortedLogs.map((log, index) => {
                    const logDate = new Date(log.date);
                    const formattedDate = logDate.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                    });
                    const formattedTime = logDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <li key={index} className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md">
                            <div className="flex justify-between items-center font-semibold">
                                <span>{formattedDate} às {formattedTime}</span>
                                <span className="text-violet-600">{log.duration} min</span>
                            </div>
                            {log.objective && (
                                <p className="mt-1 text-xs text-gray-500 truncate">
                                    Meta: {log.objective}
                                </p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}