// src/contexts/PlayerContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [visiblePlayer, setVisiblePlayer] = useState(false);
  const [trackUri, setTrackUri] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('https://music-recommender-api.onrender.com/me', {
          credentials: 'include'
        });

        if (!res.ok) throw new Error('User not authenticated');
        const data = await res.json();
        const productType = data.profile?.product || 'unknown';

        setIsAuthenticated(true);
        setIsPremium(productType === "premium");

        console.log(`[DEBUG] Spotify account type: ${productType}`);
      } catch (error) {
        console.error("[DEBUG] Error fetching user profile:", error);
        setIsAuthenticated(false);
        setIsPremium(false);
      }
    };

    fetchUserProfile();
  }, []);

  const showPlayer = (uri) => {
    if (!isAuthenticated) {
      console.warn("[WARN] Cannot show player: user not authenticated.");
      return;
    }

    if (!uri || !uri.startsWith('spotify:')) {
      console.warn("[WARN] Invalid Spotify URI passed to showPlayer.");
      return;
    }

    setTrackUri(uri);
    setVisiblePlayer(true);
    console.log(`[DEBUG] Player activated with URI: ${uri}`);
  };


  return (
    <PlayerContext.Provider
      value={{
        visiblePlayer,
        trackUri,
        showPlayer,
        isPremium,
        isAuthenticated,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
