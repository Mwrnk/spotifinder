# Documentação da API do SpotiFinder

Este documento descreve os endpoints da API do SpotiFinder e como utilizá-los.

## Base URL

```
http://localhost:5000/api
```

## Autenticação

Todos os endpoints, exceto os de autenticação inicial, requerem um token de acesso válido. O token é armazenado em um cookie HTTP-only e enviado automaticamente com cada requisição.

### Iniciar o fluxo de login

```
GET /auth/login
```

**Resposta:**

```json
{
  "authUrl": "https://accounts.spotify.com/authorize?client_id=...&response_type=code&redirect_uri=...&code_challenge_method=S256&code_challenge=...&state=..."
}
```

### Callback de autorização

```
GET /auth/callback?code={code}&state={state}
```

**Parâmetros de Query:**
- `code`: Código de autorização fornecido pelo Spotify
- `state`: Estado para proteção contra CSRF

**Resposta:**
- Redireciona para a página de criação de playlist se a autenticação for bem-sucedida
- Redireciona para a página de erro se houver algum problema

### Verificar autenticação

```
GET /auth/me
```

**Resposta:**

```json
{
  "authenticated": true,
  "user": {
    "id": "usuario_id",
    "display_name": "Nome do Usuário",
    "email": "email@exemplo.com",
    "images": [
      {
        "url": "https://exemplo.com/imagem.jpg",
        "height": 300,
        "width": 300
      }
    ]
  }
}
```

### Logout

```
GET /auth/logout
```

**Resposta:**

```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## Playlists

### Criar uma playlist

```
POST /playlist/create
```

**Corpo da Requisição:**

```json
{
  "name": "Nome da Playlist",
  "description": "Descrição da playlist (opcional)",
  "isPublic": true
}
```

**Resposta:**

```json
{
  "success": true,
  "playlist": {
    "id": "playlist_id",
    "name": "Nome da Playlist",
    "description": "Descrição da playlist",
    "images": [],
    "external_urls": {
      "spotify": "https://open.spotify.com/playlist/playlist_id"
    },
    "uri": "spotify:playlist:playlist_id"
  }
}
```

### Adicionar uma faixa à playlist

```
POST /playlist/{playlistId}/tracks
```

**Parâmetros de URL:**
- `playlistId`: ID da playlist

**Corpo da Requisição:**

```json
{
  "trackUri": "spotify:track:track_id"
}
```

**Resposta:**

```json
{
  "success": true,
  "snapshot_id": "snapshot_id"
}
```

### Obter detalhes de uma playlist

```
GET /playlist/{playlistId}
```

**Parâmetros de URL:**
- `playlistId`: ID da playlist

**Resposta:**

```json
{
  "id": "playlist_id",
  "name": "Nome da Playlist",
  "description": "Descrição da playlist",
  "images": [
    {
      "url": "https://exemplo.com/imagem.jpg",
      "height": 300,
      "width": 300
    }
  ],
  "tracks": [
    {
      "id": "track_id",
      "name": "Nome da Música",
      "artists": "Artista 1, Artista 2",
      "album": "Nome do Álbum",
      "image": "https://exemplo.com/imagem.jpg",
      "uri": "spotify:track:track_id"
    }
  ],
  "external_urls": {
    "spotify": "https://open.spotify.com/playlist/playlist_id"
  },
  "uri": "spotify:playlist:playlist_id"
}
```

## Recomendações

### Obter artistas mais ouvidos

```
GET /recommendation/top-artists
```

**Parâmetros de Query (opcionais):**
- `time_range`: Período de tempo (short_term, medium_term, long_term)
- `limit`: Número máximo de artistas a retornar

**Resposta:**

```json
{
  "items": [
    {
      "id": "artist_id",
      "name": "Nome do Artista",
      "genres": ["Gênero 1", "Gênero 2"],
      "images": [
        {
          "url": "https://exemplo.com/imagem.jpg",
          "height": 300,
          "width": 300
        }
      ],
      "popularity": 85
    }
  ],
  "total": 50,
  "limit": 5,
  "offset": 0
}
```

### Obter faixas mais ouvidas

```
GET /recommendation/top-tracks
```

**Parâmetros de Query (opcionais):**
- `time_range`: Período de tempo (short_term, medium_term, long_term)
- `limit`: Número máximo de faixas a retornar

**Resposta:**

```json
{
  "items": [
    {
      "id": "track_id",
      "name": "Nome da Música",
      "artists": [
        {
          "id": "artist_id",
          "name": "Nome do Artista"
        }
      ],
      "album": {
        "id": "album_id",
        "name": "Nome do Álbum",
        "images": [
          {
            "url": "https://exemplo.com/imagem.jpg",
            "height": 300,
            "width": 300
          }
        ]
      },
      "popularity": 85,
      "preview_url": "https://exemplo.com/preview.mp3",
      "uri": "spotify:track:track_id"
    }
  ],
  "total": 50,
  "limit": 5,
  "offset": 0
}
```

### Obter recomendações

```
GET /recommendation
```

**Parâmetros de Query (opcionais):**
- `limit`: Número máximo de recomendações a retornar

**Resposta:**

```json
{
  "tracks": [
    {
      "id": "track_id",
      "name": "Nome da Música",
      "artists": [
        {
          "id": "artist_id",
          "name": "Nome do Artista"
        }
      ],
      "album": {
        "id": "album_id",
        "name": "Nome do Álbum",
        "images": [
          {
            "url": "https://exemplo.com/imagem.jpg",
            "height": 300,
            "width": 300
          }
        ]
      },
      "popularity": 85,
      "preview_url": "https://exemplo.com/preview.mp3",
      "uri": "spotify:track:track_id"
    }
  ],
  "seeds": [
    {
      "id": "seed_id",
      "type": "ARTIST",
      "href": "https://api.spotify.com/v1/artists/seed_id"
    }
  ]
}
```

### Obter próxima recomendação

```
GET /recommendation/next
```

**Resposta:**

```json
{
  "id": "track_id",
  "name": "Nome da Música",
  "artists": [
    {
      "id": "artist_id",
      "name": "Nome do Artista"
    }
  ],
  "album": {
    "id": "album_id",
    "name": "Nome do Álbum",
    "images": [
      {
        "url": "https://exemplo.com/imagem.jpg",
        "height": 300,
        "width": 300
      }
    ]
  },
  "preview_url": "https://exemplo.com/preview.mp3",
  "uri": "spotify:track:track_id",
  "external_urls": {
    "spotify": "https://open.spotify.com/track/track_id"
  }
}
``` 