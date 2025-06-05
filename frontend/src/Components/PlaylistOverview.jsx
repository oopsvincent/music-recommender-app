// PlaylistsOverview.jsx
import React from 'react';

const PlaylistsOverview = ({ playlists, onSelectPlaylist }) => {
    console.log(playlists);
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((pl) => (
                <div
                    key={pl.id}
                    onClick={() => onSelectPlaylist(pl.id)}
                    className="cursor-pointer bg-white/5 p-4 rounded-xl hover:bg-white/10 transition shadow-md"
                >
                    <img
                        src={pl.images[0]?.url}
                        alt={pl.name}
                        className="rounded-xl mb-3 w-full h-40 object-cover"
                    />
                    <p className="text-white font-semibold text-lg truncate">{pl.name}</p>
                    <p className="text-sm text-gray-400">{pl.tracks.total} songs</p>
                </div>
            ))}
        </div>
    );
};

export default PlaylistsOverview;
