// PlayerContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const PlayerContext = createContext();
const API_ME_ENDPOINT = "https://music-recommender-api.onrender.com/me";
const DEBUG_MODE = true;

export const PlayerProvider = ({ children }) => {
  const [visiblePlayer, setVisiblePlayer] = useState(true);
  const [trackUri, setTrackUri] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(API_ME_ENDPOINT, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("User not authenticated");

      const data = await res.json();
      const productType = data?.profile?.product?.toLowerCase() || "unknown";

      setIsAuthenticated(true);
      setIsPremium(productType === "premium");

      DEBUG_MODE &&
        console.log(`[DEBUG] Spotify account type: ${productType}`);
    } catch (error) {
      console.error("[DEBUG] Error fetching user profile:", error);
      setIsAuthenticated(false);
      setIsPremium(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const showPlayer = useCallback(
    (uri) => {
      if (!isAuthenticated) {
        console.warn("[WARN] Cannot show player: User not authenticated.");
        return;
      }

      const isValidUri = /^spotify:track:[a-zA-Z0-9]+$/.test(uri);
      if (!isValidUri) {
        console.warn("[WARN] Invalid Spotify URI passed to showPlayer.");
        return;
      }

      setTrackUri(uri);
      setVisiblePlayer(true);

      DEBUG_MODE &&
        console.log(`[DEBUG] Player activated with URI: ${uri}`);
    },
    [isAuthenticated]
  );

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

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
