const crypto = require('crypto');
const CryptoJS = require('crypto-js');

/**
 * Gera um code verifier aleatório para o fluxo PKCE
 * @param {number} length - Comprimento do code verifier (entre 43 e 128 caracteres)
 * @returns {string} - Code verifier gerado
 */
function generateCodeVerifier(length = 64) {
  // Garante que o comprimento esteja dentro dos limites recomendados
  const validLength = Math.max(43, Math.min(128, length));
  
  // Gera uma string aleatória usando caracteres seguros para URL
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  
  for (let i = 0; i < validLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

/**
 * Gera um code challenge a partir do code verifier usando SHA-256
 * @param {string} codeVerifier - Code verifier
 * @returns {string} - Code challenge codificado em base64url
 */
function generateCodeChallenge(codeVerifier) {
  // Calcula o hash SHA-256 do code verifier
  const hash = CryptoJS.SHA256(codeVerifier);
  
  // Converte o hash para base64
  const base64 = hash.toString(CryptoJS.enc.Base64);
  
  // Converte para base64url (substitui caracteres não seguros para URL)
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Gera um state aleatório para proteger contra ataques CSRF
 * @param {number} length - Comprimento do state
 * @returns {string} - State gerado
 */
function generateState(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Gera a URL de autorização do Spotify com os parâmetros PKCE
 * @param {string} clientId - ID do cliente Spotify
 * @param {string} redirectUri - URI de redirecionamento
 * @param {string} codeChallenge - Code challenge gerado
 * @param {string} state - State para proteção CSRF
 * @param {Array<string>} scopes - Escopos de permissão solicitados
 * @returns {string} - URL de autorização completa
 */
function getAuthorizationUrl(clientId, redirectUri, codeChallenge, state, scopes = []) {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state
  });
  
  if (scopes.length > 0) {
    params.append('scope', scopes.join(' '));
  }
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

module.exports = {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  getAuthorizationUrl
}; 