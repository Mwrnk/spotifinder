# Fluxo de Autenticação PKCE com o Spotify

Este documento explica o fluxo de autenticação PKCE (Proof Key for Code Exchange) utilizado no SpotiFinder para autenticação com a API do Spotify.

## O que é PKCE?

PKCE (Proof Key for Code Exchange) é uma extensão do fluxo de autorização OAuth 2.0 que protege contra ataques de interceptação de código de autorização. É especialmente útil para aplicativos públicos que não podem manter um segredo do cliente de forma segura, como aplicativos de página única (SPA) e aplicativos móveis.

## Por que usar PKCE?

- **Segurança**: Protege contra ataques de interceptação de código de autorização.
- **Aplicativos Públicos**: Ideal para aplicativos que não podem manter um segredo do cliente de forma segura.
- **Recomendado pelo Spotify**: O Spotify recomenda o uso de PKCE para aplicativos públicos.

## Fluxo de Autenticação

### 1. Gerar Code Verifier e Code Challenge

O code verifier é uma string aleatória gerada pelo cliente. O code challenge é derivado do code verifier usando um algoritmo de hash.

```javascript
// Gerar code verifier
function generateCodeVerifier(length = 64) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

// Gerar code challenge
function generateCodeChallenge(codeVerifier) {
  // Calcular o hash SHA-256 do code verifier
  const hash = CryptoJS.SHA256(codeVerifier);
  
  // Converter para base64url
  return hash.toString(CryptoJS.enc.Base64)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
```

### 2. Redirecionar para a Página de Autorização

O usuário é redirecionado para a página de autorização do Spotify com o code challenge.

```javascript
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
```

### 3. Receber o Código de Autorização

Após o usuário autorizar o aplicativo, o Spotify redireciona de volta para o aplicativo com um código de autorização.

```
GET /callback?code={code}&state={state}
```

### 4. Trocar o Código de Autorização por um Token de Acesso

O aplicativo troca o código de autorização por um token de acesso usando o code verifier.

```javascript
async function getAccessToken(code, codeVerifier) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('code_verifier', codeVerifier);

  const response = await axios.post('https://accounts.spotify.com/api/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}
```

### 5. Armazenar o Token de Acesso

O token de acesso é armazenado em um cookie HTTP-only e usado para fazer requisições à API do Spotify.

```javascript
// Definir cookies com os tokens
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
```

### 6. Renovar o Token de Acesso

Quando o token de acesso expira, o aplicativo usa o refresh token para obter um novo token de acesso.

```javascript
async function refreshAccessToken(refreshToken) {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const response = await axios.post('https://accounts.spotify.com/api/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}
```

## Implementação no SpotiFinder

No SpotiFinder, o fluxo PKCE é implementado da seguinte forma:

1. O usuário clica no botão "Login com Spotify" na página inicial.
2. O frontend faz uma requisição para o endpoint `/api/auth/login`.
3. O backend gera um code verifier e um code challenge, armazena o code verifier em um cookie HTTP-only e retorna a URL de autorização.
4. O frontend redireciona o usuário para a URL de autorização.
5. Após o usuário autorizar o aplicativo, o Spotify redireciona de volta para o endpoint `/api/auth/callback` com um código de autorização.
6. O backend troca o código de autorização por um token de acesso usando o code verifier armazenado no cookie.
7. O backend armazena o token de acesso e o refresh token em cookies HTTP-only e redireciona o usuário para a página de criação de playlist.
8. O frontend usa o token de acesso para fazer requisições à API do Spotify através do backend.

## Referências

- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)
- [Spotify Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [RFC 7636 - PKCE](https://tools.ietf.org/html/rfc7636) 