import React from 'react';
import { ArtistCard } from './CardComponents/ArtistsCard';

const FollowedArtist = ({ artists = [], onSelectArtist }) => {
    console.log(artists);
    
  if (!Array.isArray(artists) || artists.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center w-full">
        No followed artists found.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          title={artist.name}
          followers={artist.followers ?? 'Unknown'}
          id={artist.id}
          url={artist.image}
          popularity={artist.popularity}
          spoURL={artist.url}
          onClick={() => onSelectArtist?.(artist.id)} // Optional callback if needed
        />
      ))}
    </div>
  );
};

export default FollowedArtist;
