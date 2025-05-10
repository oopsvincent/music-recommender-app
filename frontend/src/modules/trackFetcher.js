// src/modules/trackFetcher.js
import loadTracks from '../hooks/useTrackLoader';

export async function fetchTracksFromDB({ keyOrUrl, limit, spotifyToken, setTrackData, setPaginationStates, setLoading }) {
  try {
    setLoading(true);
    let url = keyOrUrl.startsWith("http")
      ? keyOrUrl
      : `https://music-recommender-api.onrender.com/songs/${keyOrUrl}?offset=0&limit=${limit}`;

    const response = await fetch(url);
    const data = await response.json();
    const tracks = data.results || [];

    const parsedUrl = new URL(url);
    const offset = parseInt(parsedUrl.searchParams.get("offset")) || 0;

    setPaginationStates({
      nextUrl: data.next,
      prevUrl: data.prev,
      totalCount: data.total_items || 0,
      currentPage: Math.floor(offset / limit) + 1,
    });

    await loadTracks(tracks, spotifyToken, setTrackData, setLoading);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  } finally {
    setLoading(false);
  }
}
