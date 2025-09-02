// src/services/api.js
import axios from 'axios';

// Cria uma instância do Axios com configurações pré-definidas
const api = axios.create({
    // Lê a URL base do nosso ficheiro .env do frontend
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor: Uma função mágica que é executada ANTES de cada requisição.
 * O nosso vai verificar se temos um token no localStorage e, se tivermos,
 * vai adicioná-lo automaticamente ao cabeçalho de todas as requisições.
 * Isto resolve o problema de autenticação para TODA a aplicação.
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // A forma padrão de enviar tokens JWT é com o prefixo "Bearer"
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;