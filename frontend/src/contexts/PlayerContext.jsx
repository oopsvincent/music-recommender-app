import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [visiblePlayer, setVisiblePlayer] = useState(true);
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
        if (productType === "premium") {
          setIsPremium(true);
        }

        // Log the updated state after it's set
        console.log(`[DEBUG] Spotify account type: ${productType}`);
      } catch (error) {
        console.error("[DEBUG] Error fetching user profile:", error);
        setIsAuthenticated(false);
        setIsPremium(false);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  useEffect(() => {
    console.log("[DEBUG] isPremium state updated:", isPremium);
  }, [isPremium]); // This will log when `isPremium` state changes

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
