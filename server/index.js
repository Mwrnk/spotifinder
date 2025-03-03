require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importando rotas
const authRoutes = require('./routes/auth');
const playlistRoutes = require('./routes/playlist');
const recommendationRoutes = require('./routes/recommendation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URI,
  credentials: true
}));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/recommendation', recommendationRoutes);

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando corretamente!' });
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
}); 