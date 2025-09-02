import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Ícones (AGORA COM O CÓDIGO SVG COMPLETO) ---
const Mail = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const Lock = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const User = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const HarmoniarLogo = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M12 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/></svg>;


// --- SUB-COMPONENTES ---

const InputField = ({ icon, type, placeholder, value, onChange }) => {
    const Icon = icon;
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
            />
        </div>
    );
};

const AuthForm = ({ isLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = isLogin 
                ? await login(email, password) 
                : await register(name, email, password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error(err);
            setError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && <InputField icon={User} type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />}
            <InputField icon={Mail} type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField icon={Lock} type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-400">
                {isLoading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
        </form>
    );
};


// --- Componente Principal da Página ---
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Lado Esquerdo - Apresentação */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center text-center p-12 bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                <HarmoniarLogo className="w-20 h-20 mb-6" />
                <h1 className="text-5xl font-bold mb-4">Bem-vindo ao Harmoniar</h1>
                <p className="text-lg max-w-md">O seu espaço para encontrar equilíbrio entre corpo, mente e hábitos.</p>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <HarmoniarLogo className="w-12 h-12 mb-4 text-violet-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Harmoniar</h1>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}</h2>
                    <p className="text-gray-500 mb-8">
                        {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                        <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-violet-600 hover:underline ml-1">
                            {isLogin ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>

                    <AuthForm isLogin={isLogin} />
                </div>
            </div>
        </div>
    );
}