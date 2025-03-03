import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Página de erro
 * Exibe mensagens de erro e permite que o usuário volte para a página inicial
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtém a mensagem de erro da query string
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('message') || 'Ocorreu um erro inesperado.';

  // Função para voltar para a página inicial
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-spotify-black p-4">
      <div className="max-w-md w-full text-center">
        <svg
          className="w-20 h-20 mx-auto mb-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h1 className="text-3xl font-bold text-white mb-4">Oops!</h1>
        
        <div className="card mb-6">
          <p className="text-spotify-lightgray mb-4">{errorMessage}</p>
          
          <button
            onClick={goToHome}
            className="btn btn-primary w-full"
          >
            Voltar para o Início
          </button>
        </div>
        
        <p className="text-spotify-lightgray text-sm">
          Se o problema persistir, verifique sua conexão com a internet ou tente novamente mais tarde.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage; 