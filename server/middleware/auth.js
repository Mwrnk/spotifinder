const spotifyAPI = require('../utils/spotify');

/**
 * Middleware para verificar se o usuário está autenticado
 * Verifica se o token de acesso está presente nos cookies
 * Se o token estiver expirado, tenta renovar usando o refresh token
 */
async function requireAuth(req, res, next) {
  // Obtém os tokens dos cookies
  const { access_token, refresh_token } = req.cookies;
  
  // Se não houver token de acesso, retorna erro de não autorizado
  if (!access_token) {
    return res.status(401).json({ error: 'Não autorizado. Faça login novamente.' });
  }
  
  try {
    // Tenta fazer uma requisição para verificar se o token é válido
    await spotifyAPI.getCurrentUser(access_token);
    
    // Se não lançar erro, o token é válido
    req.accessToken = access_token;
    next();
  } catch (error) {
    // Se o token estiver expirado (status 401) e houver refresh token, tenta renovar
    if (error.response?.status === 401 && refresh_token) {
      try {
        // Tenta renovar o token
        const tokenData = await spotifyAPI.refreshAccessToken(refresh_token);
        
        // Define os novos cookies
        res.cookie('access_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: tokenData.expires_in * 1000 // Converte segundos para milissegundos
        });
        
        // Se houver um novo refresh token, atualiza também
        if (tokenData.refresh_token) {
          res.cookie('refresh_token', tokenData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
          });
        }
        
        // Define o novo token de acesso na requisição
        req.accessToken = tokenData.access_token;
        next();
      } catch (refreshError) {
        // Se não conseguir renovar, retorna erro de não autorizado
        console.error('Erro ao renovar token:', refreshError);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
      }
    } else {
      // Outro tipo de erro
      console.error('Erro de autenticação:', error);
      return res.status(401).json({ error: 'Erro de autenticação. Faça login novamente.' });
    }
  }
}

module.exports = { requireAuth }; 