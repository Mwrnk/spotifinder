import axios from 'axios';

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Importante para enviar cookies com as requisições
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se o erro for 401 (não autorizado), redireciona para a página de login
    if (error.response && error.response.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api; 