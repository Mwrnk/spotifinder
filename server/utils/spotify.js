const axios = require('axios');

/**
 * Classe para interagir com a API do Spotify
 */
class SpotifyAPI {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this.authURL = 'https://accounts.spotify.com/api/token';
  }

  /**
   * Obtém um token de acesso usando o código de autorização
   * @param {string} code - Código de autorização
   * @param {string} codeVerifier - Code verifier para PKCE
   * @returns {Promise<Object>} - Token de acesso e refresh token
   */
  async getAccessToken(code, codeVerifier) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('code_verifier', codeVerifier);

    try {
      const response = await axios.post(this.authURL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter token de acesso:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Atualiza o token de acesso usando o refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - Novo token de acesso
   */
  async refreshAccessToken(refreshToken) {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    try {
      const response = await axios.post(this.authURL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtém o perfil do usuário atual
   * @param {string} accessToken - Token de acesso
   * @returns {Promise<Object>} - Dados do perfil do usuário
   */
  async getCurrentUser(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cria uma nova playlist para o usuário
   * @param {string} userId - ID do usuário
   * @param {string} accessToken - Token de acesso
   * @param {string} name - Nome da playlist
   * @param {string} description - Descrição da playlist
   * @param {boolean} isPublic - Se a playlist é pública
   * @returns {Promise<Object>} - Dados da playlist criada
   */
  async createPlaylist(userId, accessToken, name, description = '', isPublic = true) {
    try {
      const response = await axios.post(
        `${this.baseURL}/users/${userId}/playlists`,
        {
          name,
          description,
          public: isPublic
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar playlist:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Adiciona faixas a uma playlist
   * @param {string} playlistId - ID da playlist
   * @param {string} accessToken - Token de acesso
   * @param {Array<string>} trackUris - URIs das faixas a serem adicionadas
   * @returns {Promise<Object>} - Resposta da API
   */
  async addTracksToPlaylist(playlistId, accessToken, trackUris) {
    try {
      const response = await axios.post(
        `${this.baseURL}/playlists/${playlistId}/tracks`,
        {
          uris: trackUris
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar faixas à playlist:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtém os artistas mais ouvidos pelo usuário
   * @param {string} accessToken - Token de acesso
   * @param {string} timeRange - Período de tempo (short_term, medium_term, long_term)
   * @param {number} limit - Número máximo de artistas a retornar
   * @returns {Promise<Object>} - Lista de artistas mais ouvidos
   */
  async getTopArtists(accessToken, timeRange = 'medium_term', limit = 5) {
    try {
      const response = await axios.get(`${this.baseURL}/me/top/artists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          time_range: timeRange,
          limit
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter artistas mais ouvidos:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtém as faixas mais ouvidas pelo usuário
   * @param {string} accessToken - Token de acesso
   * @param {string} timeRange - Período de tempo (short_term, medium_term, long_term)
   * @param {number} limit - Número máximo de faixas a retornar
   * @returns {Promise<Object>} - Lista de faixas mais ouvidas
   */
  async getTopTracks(accessToken, timeRange = 'medium_term', limit = 5) {
    try {
      const response = await axios.get(`${this.baseURL}/me/top/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          time_range: timeRange,
          limit
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter faixas mais ouvidas:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtém recomendações de faixas com base em sementes
   * @param {string} accessToken - Token de acesso
   * @param {Object} seeds - Sementes para recomendações (artistas, faixas, gêneros)
   * @param {number} limit - Número máximo de recomendações
   * @returns {Promise<Object>} - Lista de faixas recomendadas
   */
  async getRecommendations(accessToken, seeds, limit = 1) {
    const { seed_artists, seed_tracks, seed_genres } = seeds;
    
    try {
      const response = await axios.get(`${this.baseURL}/recommendations`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          seed_artists: seed_artists?.join(','),
          seed_tracks: seed_tracks?.join(','),
          seed_genres: seed_genres?.join(','),
          limit
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter recomendações:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtém os gêneros disponíveis para recomendações
   * @param {string} accessToken - Token de acesso
   * @returns {Promise<Object>} - Lista de gêneros disponíveis
   */
  async getAvailableGenres(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/recommendations/available-genre-seeds`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter gêneros disponíveis:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new SpotifyAPI(); 