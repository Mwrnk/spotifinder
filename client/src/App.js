import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { RecommendationProvider } from './contexts/RecommendationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import CreatePlaylist from './pages/CreatePlaylist';
import SwipeTrack from './pages/SwipeTrack';
import PlaylistDetails from './pages/PlaylistDetails';
import ErrorPage from './pages/ErrorPage';

// Componente para envolver as páginas protegidas com o cabeçalho
const ProtectedPage = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlaylistProvider>
          <RecommendationProvider>
            <Routes>
              {/* Página de login */}
              <Route path="/" element={<Login />} />
              
              {/* Página de erro */}
              <Route path="/error" element={<ErrorPage />} />
              
              {/* Rotas protegidas (requerem autenticação) */}
              <Route
                path="/create-playlist"
                element={
                  <ProtectedRoute>
                    <ProtectedPage>
                      <CreatePlaylist />
                    </ProtectedPage>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/swipe/:playlistId"
                element={
                  <ProtectedRoute>
                    <ProtectedPage>
                      <SwipeTrack />
                    </ProtectedPage>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/playlist/:playlistId"
                element={
                  <ProtectedRoute>
                    <ProtectedPage>
                      <PlaylistDetails />
                    </ProtectedPage>
                  </ProtectedRoute>
                }
              />
              
              {/* Rota para qualquer caminho não encontrado */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </RecommendationProvider>
        </PlaylistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
