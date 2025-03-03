# Estrutura do Projeto SpotiFinder

Este documento descreve a estrutura do projeto SpotiFinder, explicando a organização dos diretórios e arquivos.

## Visão Geral

O projeto SpotiFinder é dividido em duas partes principais:

1. **Backend**: Uma API RESTful construída com Node.js e Express.
2. **Frontend**: Uma aplicação de página única (SPA) construída com React.

## Estrutura de Diretórios

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

## Backend (server/)

### Middleware (server/middleware/)

- **auth.js**: Middleware para verificar a autenticação do usuário.

### Rotas (server/routes/)

- **auth.js**: Rotas para autenticação com o Spotify.
- **playlist.js**: Rotas para gerenciar playlists.
- **recommendation.js**: Rotas para obter recomendações de músicas.

### Utilitários (server/utils/)

- **spotify.js**: Classe para interagir com a API do Spotify.
- **pkce.js**: Funções para implementar o fluxo PKCE.

### Arquivos de Configuração

- **index.js**: Ponto de entrada do servidor.
- **.env**: Variáveis de ambiente (não versionado).
- **.env.example**: Exemplo de variáveis de ambiente.

## Frontend (client/)

### API (client/src/api/)

- **axios.js**: Configuração do axios para fazer requisições à API.

### Componentes (client/src/components/)

- **Header.js**: Componente de cabeçalho.
- **ProtectedRoute.js**: Componente para proteger rotas que requerem autenticação.

### Contextos (client/src/contexts/)

- **AuthContext.js**: Contexto para gerenciar o estado de autenticação.
- **PlaylistContext.js**: Contexto para gerenciar o estado da playlist.
- **RecommendationContext.js**: Contexto para gerenciar as recomendações de músicas.

### Páginas (client/src/pages/)

- **Login.js**: Página de login.
- **CreatePlaylist.js**: Página de criação de playlist.
- **SwipeTrack.js**: Página de seleção de músicas com interface de swipe.
- **PlaylistDetails.js**: Página de detalhes da playlist.
- **ErrorPage.js**: Página de erro.

### Arquivos de Configuração

- **App.js**: Componente principal que define as rotas.
- **index.js**: Ponto de entrada do aplicativo.
- **.env**: Variáveis de ambiente (não versionado).
- **.env.example**: Exemplo de variáveis de ambiente.
- **tailwind.config.js**: Configuração do Tailwind CSS.

## Arquivos na Raiz

- **package.json**: Configuração do projeto e scripts.
- **README.md**: Documentação principal do projeto.
- **LICENSE**: Licença do projeto.
- **API.md**: Documentação da API.
- **PKCE.md**: Documentação do fluxo PKCE.
- **STRUCTURE.md**: Este arquivo.
- **.gitignore**: Arquivos e diretórios ignorados pelo Git.

## Fluxo de Dados

1. O usuário faz login com sua conta do Spotify.
2. O backend troca o código de autorização por um token de acesso.
3. O usuário cria uma playlist.
4. O backend cria a playlist na conta do usuário do Spotify.
5. O usuário seleciona músicas com a interface de swipe.
6. O backend adiciona as músicas selecionadas à playlist.
7. O usuário visualiza a playlist finalizada.

## Tecnologias Utilizadas

### Backend

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para Node.js.
- **axios**: Cliente HTTP para fazer requisições à API do Spotify.
- **cookie-parser**: Middleware para analisar cookies.
- **cors**: Middleware para habilitar CORS.
- **dotenv**: Carrega variáveis de ambiente de um arquivo .env.
- **crypto-js**: Biblioteca de criptografia para implementar o fluxo PKCE.

### Frontend

- **React**: Biblioteca JavaScript para construir interfaces de usuário.
- **React Router**: Roteamento para aplicativos React.
- **axios**: Cliente HTTP para fazer requisições à API.
- **react-swipeable**: Biblioteca para gestos de swipe.
- **Tailwind CSS**: Framework CSS utilitário.

## Conclusão

Esta estrutura de projeto foi projetada para ser modular e escalável, separando claramente as responsabilidades entre o backend e o frontend. O backend lida com a autenticação e as chamadas à API do Spotify, enquanto o frontend fornece uma interface de usuário intuitiva para criar playlists e descobrir novas músicas. 