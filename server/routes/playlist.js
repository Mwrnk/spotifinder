const express = require('express');
const router = express.Router();
const axios = require('axios');
const spotifyAPI = require('../utils/spotify');
const { requireAuth } = require('../middleware/auth');

/**
 * Rota para criar uma nova playlist
 * Requer autenticação
 */
router.post('/create', requireAuth, async (req, res) => {
  const { name, description = '', isPublic = true } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Nome da playlist é obrigatório' });
  }
  
  try {
    // Obtém o ID do usuário atual
    const userData = await spotifyAPI.getCurrentUser(req.accessToken);
    
    // Cria a playlist
    const playlist = await spotifyAPI.createPlaylist(
      userData.id,
      req.accessToken,
      name,
      description,
      isPublic
    );
    
    res.json({
      success: true,
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        images: playlist.images,
        external_urls: playlist.external_urls,
        uri: playlist.uri
      }
    });
  } catch (error) {
    console.error('Erro ao criar playlist:', error);
    res.status(500).json({ error: 'Erro ao criar playlist' });
  }
});

/**
 * Rota para adicionar uma faixa à playlist
 * Requer autenticação
 */
router.post('/:playlistId/tracks', requireAuth, async (req, res) => {
  const { playlistId } = req.params;
  const { trackUri } = req.body;
  
  if (!trackUri) {
    return res.status(400).json({ error: 'URI da faixa é obrigatório' });
  }
  
  try {
    // Adiciona a faixa à playlist
    const result = await spotifyAPI.addTracksToPlaylist(
      playlistId,
      req.accessToken,
      [trackUri]
    );
    
    res.json({
      success: true,
      snapshot_id: result.snapshot_id
    });
  } catch (error) {
    console.error('Erro ao adicionar faixa à playlist:', error);
    res.status(500).json({ error: 'Erro ao adicionar faixa à playlist' });
  }
});

/**
 * Rota para obter detalhes de uma playlist
 * Requer autenticação
 */
router.get('/:playlistId', requireAuth, async (req, res) => {
  const { playlistId } = req.params;
  
  try {
    // Faz uma requisição direta para a API do Spotify
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${req.accessToken}`
      }
    });
    
    const playlist = response.data;
    
    res.json({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      images: playlist.images,
      tracks: playlist.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map(artist => artist.name).join(', '),
        album: item.track.album.name,
        image: item.track.album.images[0]?.url,
        uri: item.track.uri
      })),
      external_urls: playlist.external_urls,
      uri: playlist.uri
    });
  } catch (error) {
    console.error('Erro ao obter detalhes da playlist:', error);
    res.status(500).json({ error: 'Erro ao obter detalhes da playlist' });
  }
});

module.exports = router; 