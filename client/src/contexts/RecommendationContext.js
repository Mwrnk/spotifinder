import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

// Cria o contexto de recomendações
const RecommendationContext = createContext();

// Hook personalizado para usar o contexto de recomendações
export const useRecommendation = () => useContext(RecommendationContext);

// Provedor do contexto de recomendações
export const RecommendationProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Função para obter a próxima recomendação
  const getNextRecommendation = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recommendation/next');
      
      setCurrentTrack(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter próxima recomendação:', error);
      setError('Erro ao obter próxima recomendação');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para aceitar uma recomendação
  const acceptTrack = async (track, playlistId) => {
    try {
      // Adiciona a faixa à playlist
      await api.post(`/playlist/${playlistId}/tracks`, {
        trackUri: track.uri
      });
      
      // Adiciona a faixa ao histórico
      setHistory(prev => [...prev, { ...track, accepted: true }]);
      
      // Obtém a próxima recomendação
      return await getNextRecommendation();
    } catch (error) {
      console.error('Erro ao aceitar faixa:', error);
      setError('Erro ao aceitar faixa');
      throw error;
    }
  };

  // Função para recusar uma recomendação
  const rejectTrack = async (track) => {
    try {
      // Adiciona a faixa ao histórico
      setHistory(prev => [...prev, { ...track, accepted: false }]);
      
      // Obtém a próxima recomendação
      return await getNextRecommendation();
    } catch (error) {
      console.error('Erro ao recusar faixa:', error);
      setError('Erro ao recusar faixa');
      throw error;
    }
  };

  // Valores e funções expostos pelo contexto
  const value = {
    currentTrack,
    loading,
    error,
    history,
    getNextRecommendation,
    acceptTrack,
    rejectTrack
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export default RecommendationContext; 