import React from 'react';
import { ArtistCard } from './CardComponents/ArtistsCard';

const FollowedArtist = ({ artists = [], onSelectArtist }) => {
    
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
          artist={artist.name}
          followers={artist.followers.total ?? 'Unknown'}
          id={artist.id}
          url={artist.images[0].url}
          popularity={artist.popularity}
          spoURL={artist.url}
          onClick={() => onSelectArtist?.(artist.id)} // Optional callback if needed
          URI={artist.uri}
        />
      ))}
    </div>
  );
};

export default FollowedArtist;
