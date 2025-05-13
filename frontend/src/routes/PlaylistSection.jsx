// PlaylistSection.jsx
import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import Greet from '../Components/Greet';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, ChevronLeft } from 'lucide-react';

const PlaylistSection = () => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [localSaved, setLocalSaved] = useState([]);
    const { showPlayer } = usePlayer();

    const fetchPlaylists = async () => {
        try {
            const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
            const data = await res.json();
            setPlaylists(data.playlists.items);
        } catch (err) {
            console.error('[ERROR] Failed to fetch playlists:', err);
        }
    };

    const fetchPlaylistTracks = async (playlistId) => {
        try {
            const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', { credentials: 'include' });
            const tokenData = await tokenRes.json();
            const token = tokenData.access_token;

            const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setSelectedPlaylist({ id: playlistId, tracks: data.items });
        } catch (err) {
            console.error('[ERROR] Failed to fetch playlist tracks:', err);
        }
    };

    const loadLocalSaved = () => {
        const saved = localStorage.getItem("savedSongs");
        if (saved) setLocalSaved(JSON.parse(saved));
    };

    useEffect(() => {
        fetchPlaylists();
        loadLocalSaved();
    }, []);

    const handlePlayAll = () => {
        if (!selectedPlaylist) return;
        const first = selectedPlaylist.tracks?.[0]?.track?.uri;
        if (first) showPlayer(first);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-white p-4">
            <Greet />
            {selectedPlaylist ? (
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4 w-full">
                        <button onClick={() => setSelectedPlaylist(null)} className="text-sm text-gray-300 hover:text-white underline inline-flex justify-center items-center gap-2 bg-green-500 p-2 rounded-xl">
                            <ChevronLeft />
                        </button>
                        <h2 className="text-2xl font-bold">Playlist</h2>
                        <button onClick={handlePlayAll} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                            <Play size={18} /> Play All
                        </button>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                        {selectedPlaylist.tracks.map((item, idx) => (
                            <Card
                                key={idx}
                                url={item.track.album.images[0]?.url}
                                title={item.track.name}
                                artist={item.track.artists.map(a => a.name).join(', ')}
                                popularity={item.track.popularity}
                                explicit={item.track.explicit}
                                trackURI={item.uri}
                                YTURL={`https://www.youtube.com/results?search_query=${item.track.name} ${item.track.artists.map(a => a.name).join(', ')}`}
                                spoURL={item.track.external_urls.spotify}
                                type="track"
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4">Your Spotify Playlists</h2>
                    <div className="flex flex-row flex-wrap justify-start items-center gap-1">
                        {playlists.map((pl) => (
                            <div key={pl.id} onClick={() => fetchPlaylistTracks(pl.id)} className="cursor-pointer bg-white/5 p-4 rounded-xl hover:bg-white/10 transition">
                                <img src={pl.images[0]?.url} alt={pl.name} className="rounded-xl mb-3 w-full h-40 object-cover" />
                                <p className="text-white font-semibold text-lg">{pl.name}</p>
                                <p className="text-sm text-gray-400">{pl.tracks.total} songs</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold mt-10 mb-3">Locally Saved Songs</h2>
                    {localSaved.length === 0 ? (
                        <p className="text-gray-400">No local songs saved.</p>
                    ) : (
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-white/10 shadow-lg w-full max-w-6xl">
                            <h3 className="text-white text-lg font-semibold mb-3">Saved Locally</h3>
                            <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                                {localSaved.map((track, index) => (
                                    <Card
                                        key={index}
                                        url={track.image}
                                        title={track.title}
                                        artist={track.artist}
                                        spoURL={track.spoURL}
                                        YTURL={track.YTURL}
                                        trackURI={track.trackURI}
                                        popularity={track.popularity}
                                        explicit={track.explicit}
                                        type={track.type || "track"}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PlaylistSection;
