import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlaylist } from '../contexts/PlaylistContext';

// Imagens pré-definidas para capas de playlist
const COVER_IMAGES = [
  { id: 1, url: 'https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320', name: 'Abstract 1' },
  { id: 2, url: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e', name: 'Abstract 2' },
  { id: 3, url: 'https://i.scdn.co/image/ab67706f000000035337e18dc47ba1c893f1e569', name: 'Abstract 3' },
  { id: 4, url: 'https://i.scdn.co/image/ab67706f00000003e4eadd417a05b2546e866934', name: 'Abstract 4' },
  { id: 5, url: 'https://i.scdn.co/image/ab67706f000000031df3151ca1e2b845e9d4e8c0', name: 'Abstract 5' },
  { id: 6, url: 'https://i.scdn.co/image/ab67706f000000036b1a51a0a57b5f7e4f56c2d8', name: 'Abstract 6' },
];

/**
 * Página de criação de playlist
 * Permite que o usuário digite o nome da playlist e selecione uma capa
 */
const CreatePlaylist = () => {
  const { user } = useAuth();
  const { createPlaylist, loading, error } = usePlaylist();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [formError, setFormError] = useState('');

  // Função para lidar com a criação da playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    // Validação do formulário
    if (!name.trim()) {
      setFormError('O nome da playlist é obrigatório');
      return;
    }
    
    try {
      // Cria a playlist
      const playlist = await createPlaylist(name, description);
      
      // Redireciona para a página de seleção de músicas
      navigate(`/swipe/${playlist.id}`);
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      setFormError('Erro ao criar playlist. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Criar Nova Playlist</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {formError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleCreatePlaylist} className="card">
          <div className="mb-4">
            <label htmlFor="name" className="block text-white mb-2">
              Nome da Playlist *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Minha Playlist Incrível"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-white mb-2">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full h-24 resize-none"
              placeholder="Descreva sua playlist..."
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-white mb-2">
              Selecione uma capa (opcional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COVER_IMAGES.map((cover) => (
                <div
                  key={cover.id}
                  className={`relative cursor-pointer rounded-md overflow-hidden transition-all duration-200 ${
                    selectedCover === cover.id ? 'ring-2 ring-spotify-green' : ''
                  }`}
                  onClick={() => setSelectedCover(cover.id)}
                >
                  <img
                    src={cover.url}
                    alt={cover.name}
                    className="w-full h-auto"
                  />
                  {selectedCover === cover.id && (
                    <div className="absolute inset-0 bg-spotify-green bg-opacity-30 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                'Criar Playlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist; 