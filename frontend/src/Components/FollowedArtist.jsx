import React from 'react';
import { ArtistCard } from './CardComponents/ArtistsCard';

const FollowedArtist = ({ artists, onSelectArtist }) => {


    return (
        <div className="flex flex-wrap flex-row justify-center gap-5">
            {artists.map((artist) => (
                <ArtistCard
                    title={artist.name}
                    followers={artist.followers.total}
                    id={artist.id}
                    url={artist.images[0].url}
                    popularity={artist.popularity}
                    spoURL={artist.external_urls.spotify}
                />
            ))}
        </div>
    );
};


export default FollowedArtist;
