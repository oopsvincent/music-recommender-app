// src/hooks/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);  // { access_token, refresh_token }
  const [expiresAt, setExpiresAt] = useState(null);    // expiry timestamp (in seconds)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to fetch /refresh_access_token
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await axios.get('/refresh_access_token');  // Your backend route
      const { access_token } = res.data;

      // Update state with new token (only access_token refreshed)
      setAuthTokens(prev => ({
        ...prev,
        access_token,
      }));

      console.log('[AuthContext] Refreshed access token');
    } catch (error) {
      console.error('[AuthContext] Failed to refresh token:', error);
      logout();  // Kill session if refresh fails
    }
  }, []);

  // Function to initialize tokens (called after /callback success)
  const login = (access_token, refresh_token, expires_in) => {
    setAuthTokens({ access_token, refresh_token });
    setExpiresAt(Date.now() + (expires_in * 1000) - (60 * 1000)); // expire 60 sec earlier (buffer)
    setIsAuthenticated(true);
    console.log('[AuthContext] User logged in');
  };

  const logout = () => {
    setAuthTokens(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
    console.log('[AuthContext] User logged out');
  };

  // Auto-refresh token when expiry nears
  useEffect(() => {
    if (!authTokens || !expiresAt) return;

    const timeLeft = expiresAt - Date.now();
    console.log(`[AuthContext] Token expires in ${(timeLeft / 1000).toFixed(0)}s`);

    if (timeLeft <= 0) {
      refreshAccessToken();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshAccessToken();
    }, timeLeft);

    return () => clearTimeout(refreshTimer);
  }, [authTokens, expiresAt, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ authTokens, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
