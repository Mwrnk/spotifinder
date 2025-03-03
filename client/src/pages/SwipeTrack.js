import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useRecommendation } from '../contexts/RecommendationContext';

/**
 * Página de seleção de músicas com interface de swipe
 * Permite que o usuário aceite ou recuse músicas recomendadas
 */
const SwipeTrack = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { playlist, getPlaylistDetails } = usePlaylist();
  const { currentTrack, loading, error, getNextRecommendation, acceptTrack, rejectTrack } = useRecommendation();
  
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);

  // Carrega os detalhes da playlist e a primeira recomendação
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega os detalhes da playlist
        if (!playlist || playlist.id !== playlistId) {
          await getPlaylistDetails(playlistId);
        }
        
        // Carrega a primeira recomendação
        if (!currentTrack) {
          await getNextRecommendation();
        }
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };
    
    loadInitialData();
  }, [playlistId, playlist, currentTrack, getPlaylistDetails, getNextRecommendation]);

  // Configuração dos gestos de swipe
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Função para lidar com o swipe
  const handleSwipe = async (direction) => {
    if (isAnimating || !currentTrack) return;
    
    setSwipeDirection(direction);
    setIsAnimating(true);
    
    // Aguarda a animação terminar
    setTimeout(async () => {
      try {
        if (direction === 'right') {
          // Aceita a música
          await acceptTrack(currentTrack, playlistId);
          setAcceptedCount(prev => prev + 1);
        } else {
          // Recusa a música
          await rejectTrack(currentTrack);
        }
      } catch (error) {
        console.error('Erro ao processar swipe:', error);
      } finally {
        setSwipeDirection(null);
        setIsAnimating(false);
      }
    }, 300);
  };

  // Função para lidar com os botões de aceitar/recusar
  const handleButtonClick = (direction) => {
    handleSwipe(direction);
  };

  // Função para finalizar a playlist
  const handleFinishPlaylist = () => {
    navigate(`/playlist/${playlistId}`);
  };

  // Renderiza o indicador de carregamento
  if (loading && !currentTrack) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-spotify-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // Renderiza a mensagem de erro
  if (error && !currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-spotify-black p-4">
        <div className="bg-red-500 text-white p-4 rounded-md max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <button
            onClick={() => getNextRecommendation()}
            className="mt-4 btn btn-secondary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spotify-black p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Descobrir Músicas</h1>
          <div className="text-spotify-lightgray">
            <span className="text-spotify-green font-bold">{acceptedCount}</span> músicas adicionadas
          </div>
        </div>
        
        {playlist && (
          <div className="mb-6 text-spotify-lightgray">
            Adicionando músicas à playlist: <span className="text-white font-semibold">{playlist.name}</span>
          </div>
        )}
        
        {currentTrack && (
          <div
            {...swipeHandlers}
            className={`card relative overflow-hidden transition-transform duration-300 ${
              swipeDirection === 'left'
                ? 'animate-slide-out-left'
                : swipeDirection === 'right'
                ? 'animate-slide-out-right'
                : ''
            }`}
          >
            <div className="relative pb-[100%] mb-4">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.album.name}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
              />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{currentTrack.name}</h2>
            
            <div className="flex items-center mb-4">
              {currentTrack.artists.map((artist, index) => (
                <React.Fragment key={artist.id}>
                  <span className="text-spotify-lightgray">{artist.name}</span>
                  {index < currentTrack.artists.length - 1 && (
                    <span className="text-spotify-gray mx-1">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-spotify-lightgray mb-4">
              <span className="text-spotify-gray">Álbum: </span>
              {currentTrack.album.name}
            </div>
            
            {currentTrack.preview_url && (
              <div className="mb-4">
                <audio
                  controls
                  src={currentTrack.preview_url}
                  className="w-full"
                >
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}
            
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => handleButtonClick('left')}
                disabled={isAnimating}
                className="btn bg-red-500 text-white hover:bg-red-600 rounded-full p-4"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              
              <button
                onClick={() => handleButtonClick('right')}
                disabled={isAnimating}
                className="btn bg-spotify-green text-white hover:bg-opacity-80 rounded-full p-4"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleFinishPlaylist}
            className="btn btn-secondary"
          >
            Finalizar Playlist
          </button>
        </div>
        
        <div className="mt-4 text-center text-spotify-lightgray text-sm">
          <p>
            Deslize para a direita para adicionar à playlist,
            <br />
            deslize para a esquerda para pular.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwipeTrack; 