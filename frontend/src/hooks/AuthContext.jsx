// src/hooks/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const isAuthenticated = !!authTokens?.sessionActive;

  const logout = () => {
    setAuthTokens(null);
    // Optional: Invalidate server session as well
    window.location.href = '/'; // Full reload logout
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
