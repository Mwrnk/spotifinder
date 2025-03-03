import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

// Cria o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para verificar se o usuário está autenticado
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
      
      setError(null);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setUser(null);
      setError('Erro ao verificar autenticação');
    } finally {
      setLoading(false);
    }
  };

  // Função para iniciar o fluxo de login
  const login = async () => {
    try {
      const response = await api.get('/auth/login');
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Erro ao iniciar login:', error);
      setError('Erro ao iniciar login');
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setError('Erro ao fazer logout');
    }
  };

  // Verifica a autenticação ao carregar o componente
  useEffect(() => {
    checkAuth();
  }, []);

  // Valores e funções expostos pelo contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 