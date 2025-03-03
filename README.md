# SpotiFinder

SpotiFinder é um aplicativo web que utiliza a API do Spotify para criar playlists dinâmicas com base no perfil do usuário. O aplicativo permite que os usuários façam login com suas contas do Spotify, criem playlists personalizadas e descubram novas músicas através de uma interface intuitiva de swipe.

## Funcionalidades

- **Login com Spotify**: Autenticação segura usando o fluxo Authorization Code com PKCE
- **Criação de Playlist**: Interface simples para criar playlists personalizadas
- **Seleção Dinâmica de Músicas**: Interface de swipe para aceitar ou recusar músicas recomendadas
- **Recomendações Personalizadas**: Baseadas no perfil musical do usuário

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: React, React Router
- **Estilização**: Tailwind CSS
- **Autenticação**: Spotify OAuth 2.0 com PKCE
- **API**: Spotify Web API

## Configuração do Projeto

### Pré-requisitos

- Node.js (v14 ou superior)
- Conta de desenvolvedor do Spotify
- Aplicativo registrado no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)

### Registrando um Aplicativo no Spotify Developer Dashboard

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) e faça login com sua conta do Spotify.
2. Clique em "Create an App".
3. Preencha o nome e a descrição do aplicativo e clique em "Create".
4. Na página do aplicativo, clique em "Edit Settings".
5. Adicione `http://localhost:5000/api/auth/callback` como Redirect URI e clique em "Save".
6. Anote o Client ID e o Client Secret, você precisará deles para configurar o aplicativo.

### Configuração do Projeto

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/spotifinder.git
   cd spotifinder
   ```

2. Instale as dependências:
   ```
   npm run install-all
   ```

3. Configure as variáveis de ambiente:
   - No diretório `server`, copie o arquivo `.env.example` para `.env`:
     ```
     cp server/.env.example server/.env
     ```
   - Edite o arquivo `server/.env` e adicione suas credenciais do Spotify (CLIENT_ID e CLIENT_SECRET).
   
   - No diretório `client`, copie o arquivo `.env.example` para `.env`:
     ```
     cp client/.env.example client/.env
     ```

4. Inicie o aplicativo em modo de desenvolvimento:
   ```
   npm run dev
   ```
   Isso iniciará tanto o servidor (na porta 5000) quanto o cliente (na porta 3000).

5. Acesse o aplicativo em `http://localhost:3000`.

## Estrutura do Projeto

```
spotifinder/
├── client/                 # Frontend (React)
│   ├── public/             # Arquivos públicos
│   └── src/                # Código-fonte
│       ├── api/            # Configuração do axios
│       ├── components/     # Componentes React
│       ├── contexts/       # Contextos React
│       └── pages/          # Páginas do aplicativo
├── server/                 # Backend (Node.js/Express)
│   ├── middleware/         # Middleware do Express
│   ├── routes/             # Rotas da API
│   └── utils/              # Utilitários
└── package.json            # Configuração do projeto
```

## Fluxo de Autenticação

O aplicativo utiliza o fluxo Authorization Code com PKCE (Proof Key for Code Exchange) para autenticação com o Spotify. Este fluxo é recomendado para aplicativos públicos que não podem manter um segredo do cliente de forma segura.

1. O usuário clica no botão "Login com Spotify".
2. O aplicativo gera um code verifier e um code challenge.
3. O usuário é redirecionado para a página de autorização do Spotify.
4. Após autorizar o aplicativo, o Spotify redireciona de volta para o aplicativo com um código de autorização.
5. O aplicativo troca o código de autorização por um token de acesso usando o code verifier.
6. O token de acesso é armazenado em um cookie HTTP-only e usado para fazer requisições à API do Spotify.

## Endpoints da API

### Autenticação

- `GET /api/auth/login`: Inicia o fluxo de login com o Spotify.
- `GET /api/auth/callback`: Callback para processar o código de autorização.
- `GET /api/auth/me`: Verifica se o usuário está autenticado e retorna os dados do usuário.
- `GET /api/auth/logout`: Faz logout do usuário.

### Playlist

- `POST /api/playlist/create`: Cria uma nova playlist.
- `POST /api/playlist/:playlistId/tracks`: Adiciona uma faixa à playlist.
- `GET /api/playlist/:playlistId`: Obtém detalhes de uma playlist.

### Recomendações

- `GET /api/recommendation/top-artists`: Obtém os artistas mais ouvidos pelo usuário.
- `GET /api/recommendation/top-tracks`: Obtém as faixas mais ouvidas pelo usuário.
- `GET /api/recommendation`: Obtém recomendações de faixas.
- `GET /api/recommendation/next`: Obtém uma única recomendação de faixa.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Agradecimentos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [React Swipeable](https://www.npmjs.com/package/react-swipeable)
- [Tailwind CSS](https://tailwindcss.com/) 