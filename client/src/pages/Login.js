import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Página de login com o Spotify
 * Exibe um botão para iniciar o fluxo de autenticação
 */
const Login = () => {
  const { user, loading, login } = useAuth();

  // Redireciona para a página de criação de playlist se o usuário já estiver autenticado
  if (user && !loading) {
    return <Navigate to="/create-playlist" replace />;
  }

  // Função para iniciar o fluxo de login
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-spotify-black p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">SpotiFinder</h1>
        <p className="text-spotify-lightgray text-lg">
          Descubra novas músicas e crie playlists personalizadas
        </p>
      </div>

      <div className="card max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Bem-vindo ao SpotiFinder
        </h2>
        
        <p className="text-spotify-lightgray mb-6 text-center">
          Faça login com sua conta do Spotify para começar a descobrir novas músicas
          e criar playlists personalizadas com base no seu perfil musical.
        </p>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          )}
          {loading ? 'Carregando...' : 'Login com Spotify'}
        </button>
      </div>

      <div className="mt-8 text-spotify-lightgray text-sm">
        <p>
          Ao fazer login, você concorda com os{' '}
          <a
            href="https://www.spotify.com/legal/end-user-agreement/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-spotify-green hover:underline"
          >
            Termos de Serviço
          </a>{' '}
          do Spotify.
        </p>
      </div>
    </div>
  );
};

export default Login; 