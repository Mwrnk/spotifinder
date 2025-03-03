const express = require('express');
const router = express.Router();
const pkce = require('../utils/pkce');
const spotifyAPI = require('../utils/spotify');

// Escopos necessários para o aplicativo
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-state',
  'streaming'
];

/**
 * Rota para iniciar o fluxo de login
 * Gera o code verifier, code challenge e state
 * Redireciona para a página de autorização do Spotify
 */
router.get('/login', (req, res) => {
  // Gera o code verifier e armazena em um cookie
  const codeVerifier = pkce.generateCodeVerifier();
  
  // Gera o code challenge a partir do code verifier
  const codeChallenge = pkce.generateCodeChallenge(codeVerifier);
  
  // Gera um state para proteção contra CSRF
  const state = pkce.generateState();
  
  // Armazena o code verifier e state em cookies
  res.cookie('code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000 // 10 minutos
  });
  
  res.cookie('auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000 // 10 minutos
  });
  
  // Gera a URL de autorização
  const authUrl = pkce.getAuthorizationUrl(
    process.env.CLIENT_ID,
    process.env.REDIRECT_URI,
    codeChallenge,
    state,
    SCOPES
  );
  
  // Retorna a URL de autorização para o cliente
  res.json({ authUrl });
});

/**
 * Rota de callback para processar o código de autorização
 * Troca o código pelo token de acesso usando o code verifier
 */
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const storedState = req.cookies.auth_state;
  const codeVerifier = req.cookies.code_verifier;
  
  // Limpa os cookies de autenticação
  res.clearCookie('auth_state');
  res.clearCookie('code_verifier');
  
  // Verifica se houve erro na autorização
  if (error) {
    console.error('Erro na autorização:', error);
    return res.redirect(`${process.env.FRONTEND_URI}/error?message=${encodeURIComponent('Erro na autorização do Spotify')}`);
  }
  
  // Verifica se o state corresponde (proteção contra CSRF)
  if (!state || state !== storedState) {
    console.error('State inválido');
    return res.redirect(`${process.env.FRONTEND_URI}/error?message=${encodeURIComponent('Erro de segurança na autenticação')}`);
  }
  
  // Verifica se o code verifier está presente
  if (!codeVerifier) {
    console.error('Code verifier não encontrado');
    return res.redirect(`${process.env.FRONTEND_URI}/error?message=${encodeURIComponent('Erro na autenticação: code verifier não encontrado')}`);
  }
  
  try {
    // Troca o código pelo token de acesso
    const tokenData = await spotifyAPI.getAccessToken(code, codeVerifier);
    
    // Define os cookies com os tokens
    res.cookie('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in * 1000 // Converte segundos para milissegundos
    });
    
    res.cookie('refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
    });
    
    // Redireciona para a página inicial do frontend
    res.redirect(`${process.env.FRONTEND_URI}/create-playlist`);
  } catch (error) {
    console.error('Erro ao obter token de acesso:', error);
    res.redirect(`${process.env.FRONTEND_URI}/error?message=${encodeURIComponent('Erro ao obter token de acesso')}`);
  }
});

/**
 * Rota para verificar se o usuário está autenticado
 * Retorna os dados do usuário se estiver autenticado
 */
router.get('/me', async (req, res) => {
  const accessToken = req.cookies.access_token;
  
  if (!accessToken) {
    return res.status(401).json({ authenticated: false });
  }
  
  try {
    // Obtém os dados do usuário
    const userData = await spotifyAPI.getCurrentUser(accessToken);
    
    res.json({
      authenticated: true,
      user: {
        id: userData.id,
        display_name: userData.display_name,
        email: userData.email,
        images: userData.images
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    
    // Se o token estiver expirado, tenta renovar
    if (error.response?.status === 401) {
      return res.status(401).json({ authenticated: false });
    }
    
    res.status(500).json({ error: 'Erro ao obter dados do usuário' });
  }
});

/**
 * Rota para fazer logout
 * Remove os cookies de autenticação
 */
router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

module.exports = router; 