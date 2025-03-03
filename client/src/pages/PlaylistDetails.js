import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylist } from '../contexts/PlaylistContext';

/**
 * Página de detalhes da playlist
 * Exibe as informações da playlist e as músicas adicionadas
 */
const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { getPlaylistDetails, loading, error } = usePlaylist();
  const [playlist, setPlaylist] = useState(null);

  // Carrega os detalhes da playlist
  useEffect(() => {
    const loadPlaylistDetails = async () => {
      try {
        const playlistData = await getPlaylistDetails(playlistId);
        setPlaylist(playlistData);
      } catch (error) {
        console.error('Erro ao carregar detalhes da playlist:', error);
      }
    };
    
    loadPlaylistDetails();
  }, [playlistId, getPlaylistDetails]);

  // Função para abrir a playlist no Spotify
  const openInSpotify = () => {
    if (playlist && playlist.external_urls && playlist.external_urls.spotify) {
      window.open(playlist.external_urls.spotify, '_blank');
    }
  };

  // Função para voltar para a página inicial
  const goToHome = () => {
    navigate('/create-playlist');
  };

  // Renderiza o indicador de carregamento
  if (loading && !playlist) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // Renderiza a mensagem de erro
  if (error && !playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-spotify-black p-4">
        <div className="bg-red-500 text-white p-4 rounded-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <button
            onClick={goToHome}
            className="mt-4 btn btn-secondary"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black p-4">
      <div className="max-w-4xl mx-auto">
        {playlist && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
              {playlist.images && playlist.images.length > 0 && (
                <div className="w-48 h-48 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-full object-cover rounded-md shadow-lg"
                  />
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{playlist.name}</h1>
                {playlist.description && (
                  <p className="text-spotify-lightgray mb-4">{playlist.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={openInSpotify}
                    className="btn btn-primary"
                  >
                    Abrir no Spotify
                  </button>
                  <button
                    onClick={goToHome}
                    className="btn btn-secondary"
                  >
                    Criar Nova Playlist
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">Músicas ({playlist.tracks?.length || 0})</h2>
              
              {playlist.tracks && playlist.tracks.length > 0 ? (
                <div className="divide-y divide-spotify-gray">
                  {playlist.tracks.map((track, index) => (
                    <div key={`${track.id}-${index}`} className="py-3 flex items-center">
                      <div className="w-10 text-spotify-lightgray text-right mr-4">
                        {index + 1}
                      </div>
                      
                      {track.image && (
                        <div className="w-12 h-12 mr-4">
                          <img
                            src={track.image}
                            alt={track.name}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{track.name}</h3>
                        <p className="text-spotify-lightgray text-sm truncate">{track.artists}</p>
                      </div>
                      
                      <div className="text-spotify-lightgray text-sm hidden md:block">
                        {track.album}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-spotify-lightgray">Nenhuma música adicionada à playlist.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetails; 