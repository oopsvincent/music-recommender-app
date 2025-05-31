// PlaylistTracks.jsx
import React from 'react';
import Card from '../Components/Card';

const PlaylistTracks = ({ tracks }) => {
    return (
        <div className="flex flex-row flex-wrap justify-center">
            {tracks.map((item, idx) => (
                <Card
                    key={idx}
                    url={item.track.album.images[0]?.url}
                    title={item.track.name}
                    artist={item.track.artists.map(a => a.name).join(', ')}
                    popularity={item.track.popularity}
                    explicit={item.track.explicit}
                    trackURI={item.track.uri}
                    YTURL={`https://www.youtube.com/results?search_query=${item.track.name} ${item.track.artists.map(a => a.name).join(', ')}`}
                    spoURL={item.track.external_urls.spotify}
                    type="track"
                />
            ))}
        </div>
    );
};

export default PlaylistTracks;
