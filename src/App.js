import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import TranslationDownloads from './pages/TranslationDownloads';
import SpeechTranslation from './pages/SpeechTranslation';
import CameraTranslation from './pages/CameraTranslation';
import LanguageLearning from './pages/LanguageLearning';
import AccentCustomization from './pages/AccentCustomization';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/translation-downloads"
            element={<ProtectedRoute><TranslationDownloads /></ProtectedRoute>}
          />
          <Route
            path="/speech-translation"
            element={<ProtectedRoute><SpeechTranslation /></ProtectedRoute>}
          />
          <Route
            path="/camera-translation"
            element={<ProtectedRoute><CameraTranslation /></ProtectedRoute>}
          />
          <Route
            path="/language-learning"
            element={<ProtectedRoute><LanguageLearning /></ProtectedRoute>}
          />
          <Route
            path="/accent-customization"
            element={<ProtectedRoute><AccentCustomization /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;