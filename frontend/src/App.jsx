// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import PlaylistSection from './routes/PlaylistSection';
import AppBar from './Components/AppBar';
import SpotifyPlayer from './Components/SpotifyPlayer';
import SearchPage from './pages/SearchPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './hooks/AuthContext';
import Callback from './pages/Callback';
import './App.css';
import './index.css';
import FeedbackPage from './pages/Feedback';
import FirstTimeLogin from './Components/FirstTimeLogin';
import DataNoticeModal from './Components/DataNoticeModal';
import { PlayerProvider } from './contexts/PlayerContext';
import Footer from './Components/Footer';
import CreditsPage from './pages/CreditsPages';

const App = () => {
  const [selectedSection, setSection] = useState('Music');
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [showLogin, setShowLogin] = useState(!localStorage.getItem("userName"));

  const handleUserInfo = (name) => {
    localStorage.setItem("userName", name);
    setUserName(name);
    setShowLogin(false);
  };

  return (
    <PlayerProvider>
      <Router>
        <DataNoticeModal />
        <AuthProvider>
          {showLogin ? (
            <div className="h-dvh flex justify-center items-center">
              <div className="max-w-[90%] w-full">
                <FirstTimeLogin onSubmit={handleUserInfo} />
              </div>
            </div>
          ) : (
            <>
              <AppBar selectedSection={selectedSection} setSection={setSection} />
              <Routes>
                <Route path="/" element={<HomePage userName={userName} selectedSection={selectedSection} setSection={setSection} />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/account" element={<UserDashboard />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/playlist" element={<PlaylistSection />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* ✅ Globally available floating Spotify Player */}
              <SpotifyPlayer />

              <Footer />
            </>
          )}
        </AuthProvider>
      </Router>
    </PlayerProvider>
  );
};

export default App;
