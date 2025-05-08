// src/components/RandomTrackButton.jsx
import { useState } from 'react';

export default function RandomTrackButton({ categoryBaseUrl }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { fetchAllSongs, getRandomSongFromList } = await import('../modules/musicApi');
      const songsList = await fetchAllSongs(categoryBaseUrl);
      const song = getRandomSongFromList(songsList);
      console.log(song);
      
    //   onSongSelected(song);
    } catch (error) {
      console.error('Error fetching random song:', error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Random Track'}
    </button>
  );
}
