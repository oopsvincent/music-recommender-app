// // useTrackLoader.js
// import { fetchSpotifyData } from './useSpotify';

// const loadTracks = async (tracks, token, setTrackData, setLoading) => {
//     try {
//         const trackPromises = tracks.map((title) =>
//             fetchSpotifyData(title, token)
//         );
//         const results = await Promise.all(trackPromises);
//         setTrackData(results);
//     } catch (error) {
//         console.log(error);
//     } finally {
//         setLoading(false);
//     }
// };

// export default loadTracks;

// src/hooks/useTrackLoader.js
import { fetchSpotifyData } from './useSpotify';

const loadTracks = async (tracks, token, setTrackData = null, setLoading = null) => {
  try {
    const trackPromises = tracks.map((title) =>
      fetchSpotifyData(title, token)
    );
    const results = await Promise.all(trackPromises);

    // If setTrackData is provided, set it
    if (typeof setTrackData === 'function') {
      setTrackData(results);
    }

    // Return results for manual usage
    return results;

  } catch (error) {
    console.log(error);
    return [];
  } finally {
    if (typeof setLoading === 'function') {
      setLoading(false);
    }
  }
};

export default loadTracks;
