import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

// Cria o contexto da playlist
const PlaylistContext = createContext();

// Hook personalizado para usar o contexto da playlist
export const usePlaylist = () => useContext(PlaylistContext);

// Provedor do contexto da playlist
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para criar uma nova playlist
  const createPlaylist = async (name, description = '', isPublic = true) => {
    try {
      setLoading(true);
      const response = await api.post('/playlist/create', {
        name,
        description,
        isPublic
      });
      
      setPlaylist(response.data.playlist);
      setError(null);
      return response.data.playlist;
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      setError('Erro ao criar playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar uma faixa à playlist
  const addTrackToPlaylist = async (trackUri) => {
    if (!playlist) {
      setError('Nenhuma playlist selecionada');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post(`/playlist/${playlist.id}/tracks`, {
        trackUri
      });
      
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar faixa à playlist:', error);
      setError('Erro ao adicionar faixa à playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para obter detalhes da playlist
  const getPlaylistDetails = async (playlistId) => {
    try {
      setLoading(true);
      const response = await api.get(`/playlist/${playlistId}`);
      
      setPlaylist(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter detalhes da playlist:', error);
      setError('Erro ao obter detalhes da playlist');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valores e funções expostos pelo contexto
  const value = {
    playlist,
    loading,
    error,
    createPlaylist,
    addTrackToPlaylist,
    getPlaylistDetails,
    setPlaylist
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext; 