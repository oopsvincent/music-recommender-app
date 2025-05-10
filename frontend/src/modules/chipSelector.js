// src/modules/chipSelector.js
import { fetchTracksFromDB } from './trackFetcher';
import dailyTracks from './dailyTracks';
import loadTracks from '../hooks/useTrackLoader';

export async function handleChipSelect({ chipText, chipMap, setChipKey, spotifyToken, setTrackData, setPaginationStates, setLoading }) {
  const key = chipMap[chipText];
  setChipKey(key);

  if (key) {
    await fetchTracksFromDB({
      keyOrUrl: key,
      limit: 10,
      spotifyToken,
      setTrackData,
      setPaginationStates,
      setLoading,
    });
  } else {
    await loadTracks(dailyTracks, spotifyToken, setTrackData, setLoading);
  }
}
