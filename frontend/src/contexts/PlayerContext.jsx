// src/contexts/PlayerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [visiblePlayer, setVisiblePlayer] = useState(false);
  const [trackUri, setTrackUri] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        setIsPremium(data.product === "premium");
        console.log(`[DEBUG] Spotify account type: ${data.product}`);
      } catch (error) {
        console.error("[DEBUG] Error fetching user profile:", error);
        setIsPremium(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  const showPlayer = (uri) => {
    if (!uri || !uri.startsWith('spotify:')) {
      console.warn("[WARN] Invalid Spotify URI passed to showPlayer");
      return;
    }
    setTrackUri(uri);
    setVisiblePlayer(true);
    console.log(`[DEBUG] Player activated with track URI: ${uri}`);
  };

  return (
    <PlayerContext.Provider value={{ visiblePlayer, trackUri, showPlayer, isPremium }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
