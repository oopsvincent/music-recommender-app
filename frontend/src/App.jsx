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



const AppContent = ({ selectedSection, setSection }) => {
    
    const navigate = useNavigate();

    // Handle section change and navigate programmatically

    return (
        <>
            <AppBar selectedSection={selectedSection} setSection={setSection} />

            <Routes>
                <Route path="/" element={<HomePage />}  />
                <Route path="/callback" element={<Callback />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/account" element={<UserDashboard />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/playlist" element={<PlaylistSection />} />
                <Route path='/player' element={<SpotifyPlayer />}/>
                <Route path="*" element={<NotFound />} />
            </Routes>

            <footer className="text-center py-6 px-8 text-white mb-17 relative bottom-0">
                © 2025 The CodeBreakers. All rights reserved. Licensed under MIT License.
            </footer>            
        </>
    );
};

const App = () => {
    const [selectedSection, setSection] = useState('');

    return (
        <Router>
            <AuthProvider>
            <AppContent selectedSection={selectedSection} setSection={setSection} />
            </AuthProvider>
        </Router>
    );
};

export default App;
