// src/hooks/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);
  const [userProfile, setUserProfile] = useState(null);

  // Save token to both memory + localStorage
  const saveAccessToken = (token) => {
    setAccessToken(token);
    localStorage.setItem('access_token', token);
  };

  // Clear token (logout)
  const clearAccessToken = () => {
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  // === Token auto-refresh ===
  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/spotify/token`, {
        credentials: 'include',  // include cookies for session
      });
      const data = await res.json();

      if (data.access_token) {
        console.log('[DEBUG] Token refreshed:', data.access_token);
        saveAccessToken(data.access_token);
      } else {
        console.warn('[WARN] Token refresh failed. Clearing token.');
        clearAccessToken();
      }
    } catch (err) {
      console.error('[ERROR] Failed to refresh token:', err);
      clearAccessToken();
    }
  };

  // Setup auto-refresh interval (every 55 min)
  useEffect(() => {
    if (!accessToken) return;

    console.log('[DEBUG] Setting auto-refresh for token (55 min)');
    const intervalId = setInterval(refreshAccessToken, 55 * 60 * 1000);  // 55 min

    return () => clearInterval(intervalId);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, saveAccessToken, clearAccessToken, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
