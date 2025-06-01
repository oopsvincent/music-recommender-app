// SavedAlbums.jsx
import React from 'react';

const FollowedArtist = ({ artists, onSelectArtist }) => {
    
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artists.map((artist) => (
<div
  key={artist?.id}
  className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
  onClick={() => onSelectArtist(artist.id)}
>
  <img src={artist?.images[0]?.url} alt={artist?.name} className="rounded mb-2" />
  <div className="font-black">{artist?.name}</div>
  <div className='font-medium'>{artist?.followers?.total.toLocaleString()}</div>
</div>

      ))}
    </div>
  );
};


export default FollowedArtist;
