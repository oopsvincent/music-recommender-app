// useTrackLoader.js
import { fetchSpotifyData } from './useSpotify';

const loadTracks = async (tracks, token, setTrackData, setLoading) => {
    try {
        const trackPromises = tracks.map((title) =>
            fetchSpotifyData(title, token)
        );
        const results = await Promise.all(trackPromises);
        setTrackData(results);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

export default loadTracks;
