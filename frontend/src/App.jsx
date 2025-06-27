// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import PlaylistSection from './routes/PlaylistSection';
import AppBar from './Components/AppBar';
import SpotifyPlayer from './Components/SpotifyPlayer';
import Attribution from './Components/SpotifyAttribution';
import SearchPage from './pages/SearchPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import LibrarySection from './pages/LibrarySection';
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
import Redirect from './pages/redirect';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import PlaylistPage from './pages/PlaylistPage';
import TrackPage from './pages/TrackPage';
import ChatPage from './pages/ChatPage';
import LocallySavedSongs from './Components/LocallySavedSongs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

const App = () => {
  const [selectedSection, setSection] = useState('');
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
              <div className="md:max-w-[40%] max-w-[90%]">
                <FirstTimeLogin onSubmit={handleUserInfo} />
              </div>
            </div>
          ) : (
              <>
                {location.pathname !== '/chat' && <Attribution />}
              <AppBar selectedSection={selectedSection} setSection={setSection} />
              <Routes>
                <Route path="/artist/:id" element={<ArtistPage />} />
                <Route path="/album/:id" element={<AlbumPage />} />
                <Route path='/playlist/:id' element={<PlaylistPage />} />
                <Route path="/track/:id" element={<TrackPage />} />
                <Route path="/" element={<HomePage userName={userName} selectedSection={selectedSection} setSection={setSection} />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/account" element={<UserDashboard />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/library" element={<LibrarySection />} />
                <Route path="/library/saved" element={<LocallySavedSongs />} />
                <Route path='chat' element={<ChatPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path='redirect' element={<Redirect />} />
                <Route path='/terms' element={<TermsAndConditions />} />
                <Route path='/privacy' element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* ✅ Globally available floating Spotify Player */}
              <div className={`${location.pathname === "/chat" && "hidden"}`}>
             <SpotifyPlayer />
              </div>
            </>
          )}
          {location.pathname !== '/chat' && <Footer />}
        </AuthProvider>
      </Router>
    </PlayerProvider>
  );
};

export default App;
