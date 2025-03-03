import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Renderiza o conteúdo da rota se o usuário estiver autenticado
  return children;
};

export default ProtectedRoute; 