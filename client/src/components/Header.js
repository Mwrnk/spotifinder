import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de cabeçalho
 * Exibe o logo do aplicativo e o botão de logout
 */
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#121212] py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          SpotiFinder
        </Link>
        
        {user && (
          <div className="flex items-center">
            {user.images && user.images.length > 0 && (
              <img
                src={user.images[0].url}
                alt={user.display_name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            
            <span className="text-white mr-4 hidden md:inline">
              {user.display_name}
            </span>
            
            <button
              onClick={logout}
              className="text-spotify-lightgray hover:text-white"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 