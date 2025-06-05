import React, { useState, useEffect } from 'react';

const SavedAlbums = ({ albums, onSelectAlbum }) => {
  const [hasAlbums, setHasAlbums] = useState([]);

  useEffect(() => {
    if (Array.isArray(albums) && albums.length > 0) {
      setHasAlbums(albums);
    } else {
      setHasAlbums([]);
    }
  }, [albums]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hasAlbums.map((album, index) => (
        <div
          key={album.id || index}
          className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
          onClick={() => onSelectAlbum?.(album.id)}
        >
          <img
            src={album.image}
            alt={album.title}
            className="rounded mb-2 w-full h-auto object-cover"
          />
          <div className="font-semibold">{album.title}</div>
          <div className="text-sm text-gray-400">{album.artist}</div>
        </div>
      ))}
    </div>
  );
};

export default SavedAlbums;
