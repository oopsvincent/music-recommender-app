// SavedAlbums.jsx
import React from 'react';

const SavedAlbums = ({ albums, onSelectAlbum }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map(({ album }) => (
        <div
          key={album.id}
          className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
          onClick={() => onSelectAlbum(album.id)}
        >
          <img src={album.images[0]?.url} alt={album.name} className="rounded mb-2" />
          <div className="font-semibold">{album.name}</div>
          <div className="text-sm text-gray-400">{album.artists.map(a => a.name).join(', ')}</div>
        </div>
      ))}
    </div>
  );
};


export default SavedAlbums;
