const express = require('express');
const router = express.Router();
const spotifyAPI = require('../utils/spotify');
const { requireAuth } = require('../middleware/auth');

/**
 * Rota para obter os artistas mais ouvidos pelo usuário
 * Requer autenticação
 */
router.get('/top-artists', requireAuth, async (req, res) => {
  const { time_range = 'medium_term', limit = 5 } = req.query;
  
  try {
    const topArtists = await spotifyAPI.getTopArtists(
      req.accessToken,
      time_range,
      parseInt(limit)
    );
    
    res.json(topArtists);
  } catch (error) {
    console.error('Erro ao obter artistas mais ouvidos:', error);
    res.status(500).json({ error: 'Erro ao obter artistas mais ouvidos' });
  }
});

/**
 * Rota para obter as faixas mais ouvidas pelo usuário
 * Requer autenticação
 */
router.get('/top-tracks', requireAuth, async (req, res) => {
  const { time_range = 'medium_term', limit = 5 } = req.query;
  
  try {
    const topTracks = await spotifyAPI.getTopTracks(
      req.accessToken,
      time_range,
      parseInt(limit)
    );
    
    res.json(topTracks);
  } catch (error) {
    console.error('Erro ao obter faixas mais ouvidas:', error);
    res.status(500).json({ error: 'Erro ao obter faixas mais ouvidas' });
  }
});

/**
 * Rota para obter recomendações de faixas
 * Requer autenticação
 */
router.get('/', requireAuth, async (req, res) => {
  const { limit = 1 } = req.query;
  
  try {
    // Obtém os artistas mais ouvidos
    const topArtists = await spotifyAPI.getTopArtists(req.accessToken, 'medium_term', 2);
    
    // Obtém as faixas mais ouvidas
    const topTracks = await spotifyAPI.getTopTracks(req.accessToken, 'medium_term', 2);
    
    // Obtém os gêneros disponíveis
    const availableGenres = await spotifyAPI.getAvailableGenres(req.accessToken);
    
    // Seleciona aleatoriamente um gênero dos disponíveis
    const randomGenre = availableGenres.genres[Math.floor(Math.random() * availableGenres.genres.length)];
    
    // Prepara as sementes para recomendações
    const seeds = {
      seed_artists: topArtists.items.slice(0, 1).map(artist => artist.id),
      seed_tracks: topTracks.items.slice(0, 1).map(track => track.id),
      seed_genres: [randomGenre]
    };
    
    // Obtém as recomendações
    const recommendations = await spotifyAPI.getRecommendations(
      req.accessToken,
      seeds,
      parseInt(limit)
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Erro ao obter recomendações:', error);
    res.status(500).json({ error: 'Erro ao obter recomendações' });
  }
});

/**
 * Rota para obter uma única recomendação de faixa
 * Requer autenticação
 */
router.get('/next', requireAuth, async (req, res) => {
  try {
    // Obtém os artistas mais ouvidos
    const topArtists = await spotifyAPI.getTopArtists(req.accessToken, 'medium_term', 2);
    
    // Obtém as faixas mais ouvidas
    const topTracks = await spotifyAPI.getTopTracks(req.accessToken, 'medium_term', 2);
    
    // Obtém os gêneros disponíveis
    const availableGenres = await spotifyAPI.getAvailableGenres(req.accessToken);
    
    // Seleciona aleatoriamente um gênero dos disponíveis
    const randomGenre = availableGenres.genres[Math.floor(Math.random() * availableGenres.genres.length)];
    
    // Prepara as sementes para recomendações
    const seeds = {
      seed_artists: topArtists.items.slice(0, 1).map(artist => artist.id),
      seed_tracks: topTracks.items.slice(0, 1).map(track => track.id),
      seed_genres: [randomGenre]
    };
    
    // Obtém uma única recomendação
    const recommendations = await spotifyAPI.getRecommendations(
      req.accessToken,
      seeds,
      1
    );
    
    // Verifica se há recomendações
    if (recommendations.tracks.length === 0) {
      return res.status(404).json({ error: 'Nenhuma recomendação encontrada' });
    }
    
    // Retorna a primeira recomendação
    const track = recommendations.tracks[0];
    
    res.json({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images
      },
      preview_url: track.preview_url,
      uri: track.uri,
      external_urls: track.external_urls
    });
  } catch (error) {
    console.error('Erro ao obter próxima recomendação:', error);
    res.status(500).json({ error: 'Erro ao obter próxima recomendação' });
  }
});

module.exports = router; 