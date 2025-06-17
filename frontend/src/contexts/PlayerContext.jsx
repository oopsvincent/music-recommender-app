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
    const [playbackInfo, setPlaybackInfo] = useState({
        uri: null,
        isContext: false,
        offset: null,
        positionMs: 0,
    });


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

    const showPlayer = useCallback((uri, isContext = false, offset = null, positionMs = 0) => {
        if (!isAuthenticated) {
            console.warn("[WARN] Cannot show player: User not authenticated.");
            return;
        }

        const isValidUri = typeof uri === 'string' &&
            /^spotify:(track|album|playlist|artist):[a-zA-Z0-9]+$/.test(uri);

        const isUriArray = Array.isArray(uri) && uri.every(u =>
            /^spotify:track:[a-zA-Z0-9]+$/.test(u)
        );

        if (!isValidUri && !isUriArray) {
            console.warn("[WARN] Invalid URI or URI array passed to showPlayer.");
            return;
        }

        setPlaybackInfo({ uri, isContext, offset, positionMs });
        setVisiblePlayer(true);

        DEBUG_MODE && console.log(`[DEBUG] Player activated with:`, { uri, isContext, offset, positionMs });
    }, [isAuthenticated]);


    return (
        <PlayerContext.Provider
            value={{
                visiblePlayer,
                playbackInfo,
                showPlayer,
                isPremium,
                isAuthenticated
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
