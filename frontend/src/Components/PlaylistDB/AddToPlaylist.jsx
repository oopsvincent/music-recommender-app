// AddToPlaylist.jsx
import React, { useState, useEffect } from 'react';
import { db, addSongToPlaylist, getAllPlaylists } from '../../hooks/db';

export default function AddToPlaylist({ song }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const all = await getAllPlaylists();
      setPlaylists(all);
    };
    fetchPlaylists();
  }, []);

  const handleAdd = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, song);
      alert('Song added!');
    } catch (err) {
      console.error(err);
      alert('Error adding song');
    }
  };

  return (
    <div>
      <h3 className="text-white font-semibold mb-2">Add to Playlist</h3>
      {playlists.map((pl) => (
        <button
          key={pl.id}
          onClick={() => handleAdd(pl.id)}
          className="text-sm bg-purple-700 text-white px-3 py-1 rounded m-1 hover:bg-purple-800"
        >
          {pl.name}
        </button>
      ))}
    </div>
  );
}
