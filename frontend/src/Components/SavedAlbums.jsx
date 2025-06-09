import React, { useState, useEffect } from 'react';

const SavedAlbums = ({ albums, onSelectAlbum }) => {
  const [hasAlbums, setHasAlbums] = useState([]);
  console.log(albums);
  
    function openArtist(id) {
        window.open(`/artist/${id}`);
    }
//   useEffect(() => {
//     if (Array.isArray(albums) && albums.length > 0) {
//       setHasAlbums(albums);
//       console.log("a");
      
//     } else {
//       setHasAlbums([]);
//       console.log("b");
      
//     }
//   }, [albums]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {albums.map((album, index) => (
        <div
          key={album.id || index}
          className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
          onClick={() => onSelectAlbum?.(album.id)}
        >
          <img
            src={album.album.images[0].url}
            alt={album.album.name}
            className="rounded mb-2 w-full h-auto object-cover"
          />
          <div className="font-semibold">{album.album.name}</div>
          <div className="text-sm text-gray-400" onClick={() => {
            openArtist(album.album.artists[0].id)
          }}>{album.album.artists[0].name}</div>
        </div>
      ))}
    </div>
  );
};

export default SavedAlbums;
