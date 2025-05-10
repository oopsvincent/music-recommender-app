// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import PlaylistSection from './routes/PlaylistSection';
import AppBar from './Components/AppBar';
import SpotifyPlayer from './Components/SpotifyPlayer';
import SearchPage from './pages/SearchPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './hooks/AuthContext';
import Callback from './pages/Callback';  // ✅ Don't forget import
import './App.css'; // Import your CSS file
import './index.css'; // Import your CSS file
import FeedbackPage from './pages/Feedback';
import FirstTimeLogin from './Components/FirstTimeLogin'; // Import your FirstTimeLogin component
import DataNoticeModal from './Components/DataNoticeModal';



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
      <Router>
        <DataNoticeModal/>
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
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/playlist" element={<PlaylistSection />} />
              <Route path='/player' element={<SpotifyPlayer />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            <footer className="text-center py-6 px-8 text-white mb-17 relative bottom-0">
              © 2025 The CodeBreakers. All rights reserved. Licensed under MIT License.
            </footer>
          </>
        )}
      </AuthProvider>
    </Router>
  );
};


export default App;
