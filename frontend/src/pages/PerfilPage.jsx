import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// --- Ícones (Código SVG completo restaurado) ---
const Edit = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const Save = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const Sun = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const Moon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const LogOut = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;


// --- Subcomponentes (Código JSX completo restaurado) ---
const SettingsCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        {children}
    </div>
);

const EditableField = ({ label, value, isEditing, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        {isEditing ? (
            <input 
                type={type} 
                value={value}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            />
        ) : (
            <p className="mt-1 text-lg text-gray-900">{value}</p>
        )}
    </div>
);

const ToggleSwitch = ({ label, enabled, setEnabled }) => (
     <div className="flex items-center justify-between py-2">
        <span className="text-gray-700">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-violet-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);


export default function PerfilPage() {
    const { user, setUser, logout } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(user);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState({ training: true, diet: true, mood: false });
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setTempData(user);
    }, [user]);

    const handleEdit = () => {
        setTempData(user);
        setIsEditing(true);
    };
    
    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.put('/user/me', {
                name: tempData.name,
                email: tempData.email,
            });
            setUser(response.data); 
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.errors[0]?.msg || 'Erro ao guardar as alterações.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempData(user);
        setError('');
    };

    const handleInputChange = (e, field) => {
        setTempData({ ...tempData, [field]: e.target.value });
    };

    if (!user) {
        return <div>A carregar perfil...</div>;
    }
    
    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <img className="h-32 w-32 rounded-full object-cover shadow-lg" src={user.profilePic || `https://placehold.co/128x128/d8b4fe/334155?text=${user.name.charAt(0)}`} alt="Foto de Perfil" />
                    <button className="absolute bottom-1 right-1 bg-violet-600 p-2 rounded-full text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                        <Edit className="h-5 w-5"/>
                    </button>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            <SettingsCard title="Dados Pessoais">
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <div className="space-y-4">
                    <EditableField label="Nome" value={tempData.name} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'name')} />
                    <EditableField label="Email" value={tempData.email} isEditing={isEditing} onChange={(e) => handleInputChange(e, 'email')} type="email" />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="font-semibold text-sm bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={isLoading} className="flex items-center font-semibold text-sm bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 disabled:bg-violet-400">
                                {isLoading ? 'A guardar...' : <><Save className="w-4 h-4 mr-2" /> Salvar</>}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="flex items-center font-semibold text-sm bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                            <Edit className="w-4 h-4 mr-2" /> Editar Perfil
                        </button>
                    )}
                </div>
            </SettingsCard>

            <SettingsCard title="Configurações">
                 <div className="divide-y divide-gray-200">
                    <ToggleSwitch label="Notificações de Treino" enabled={notifications.training} setEnabled={(val) => setNotifications({...notifications, training: val})} />
                    <ToggleSwitch label="Notificações de Alimentação" enabled={notifications.diet} setEnabled={(val) => setNotifications({...notifications, diet: val})} />
                    <ToggleSwitch label="Lembrete de Humor Diário" enabled={notifications.mood} setEnabled={(val) => setNotifications({...notifications, mood: val})} />
                    
                    <div className="flex items-center justify-between pt-4 mt-2">
                        <span className="text-gray-700">Tema da Aplicação</span>
                         <div className="flex items-center rounded-lg bg-gray-100 p-1">
                            <button onClick={() => setTheme('light')} className={`p-2 rounded-md transition-colors ${theme === 'light' ? 'bg-white shadow' : ''}`}>
                                <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-violet-600' : 'text-gray-500'}`}/>
                            </button>
                            <button onClick={() => setTheme('dark')} className={`p-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-800 shadow' : ''}`}>
                               <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}/>
                            </button>
                        </div>
                    </div>
                </div>
            </SettingsCard>

            <SettingsCard title="Zona de Perigo">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Estas ações podem ter consequências permanentes.</p>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                         <button onClick={logout} className="w-full flex items-center justify-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            <LogOut className="w-4 h-4 mr-2" />
                            Terminar Sessão
                        </button>
                        <button className="w-full bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg hover:bg-red-200">
                            Eliminar Conta
                        </button>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
}