// ViewPlaylists.jsx
import React, { useEffect, useState } from 'react';
import { getAllPlaylists } from '../../hooks/db';

export default function ViewPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const all = await getAllPlaylists();
      setPlaylists(all);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Your Playlists</h2>
      {playlists.length === 0 && (
        <p className="text-gray-400">No playlists yet.</p>
      )}
      {playlists.map((pl) => (
        <div key={pl.id} className="bg-[#1e1e1e] p-4 rounded-md text-white">
          <h4 className="text-lg font-semibold">{pl.name}</h4>
          <ul className="text-sm text-gray-300 ml-4 mt-2 space-y-1">
            {pl.songs?.map((song) => (
              <li key={song.id}>🎵 {song.title} — {song.artists?.map(a => a.name).join(', ')}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
