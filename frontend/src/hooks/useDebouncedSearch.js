import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { fetchSpotifySearchResults, getSpotifyToken } from "./useSpotify";

const useDebouncedSearch = (searchTerm, searchType, setLoading, setResults) => {
    const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getSpotifyToken();
            setSpotifyToken(token);
        };
        fetchToken();
    }, []);

    const debouncedSearch = useMemo(() => {
        return debounce(async (query, type) => {
            if (spotifyToken && query.trim() !== "") {
                await fetchSpotifySearchResults(
                    query,
                    type,
                    setResults,
                    setLoading
                );
            }
        }, 1000);
    }, [spotifyToken]);

    return debouncedSearch;
};

export default useDebouncedSearch;
