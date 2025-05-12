// src/contexts/PlayerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [visiblePlayer, setVisiblePlayer] = useState(false);
  const [trackUri, setTrackUri] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('https://music-recommender-api.onrender.com/me', {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();

        // Backend already returns profile object
        const productType = data.profile?.product || 'unknown';
        setIsPremium(productType === "premium");
        console.log(`[DEBUG] Spotify account type: ${productType}`);
      } catch (error) {
        console.error("[DEBUG] Error fetching user profile:", error);
        setIsPremium(false);
      }
    };

    fetchUserProfile();
  }, []);

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
