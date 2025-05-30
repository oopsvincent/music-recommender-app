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
    const { showPlayer, queueTracks } = usePlayer();
    const [albums, setAlbums] = useState([]);

    const fetchAlbums = async () => {
        try {
            const res = await fetch('https://music-recommender-api.onrender.com/me/albums', { credentials: 'include' });
            const data = await res.json();
            setAlbums(data.items);
        } catch (err) {
            console.error('[ERROR] Failed to fetch albums:', err);
        }
    };

    useEffect(() => {
        fetchPlaylists();
        fetchAlbums();
        loadLocalSaved();
    }, []);


    useEffect(() => {
        fetchPlaylists();
        loadLocalSaved();
    }, []);

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

const handlePlayAll = () => {
    if (!selectedPlaylist) return;
    const uris = selectedPlaylist.tracks.map(item => item.track.uri);
    if (uris.length > 0) showPlayer(uris);
};


    return (
        <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <Greet />

            {selectedPlaylist ? (
                <div className="w-full max-w-6xl">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setSelectedPlaylist(null)} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
                            <ChevronLeft className="w-5 h-5" /> Back
                        </button>
                        <h2 className="text-3xl font-bold">Playlist</h2>
                        <button onClick={handlePlayAll} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl">
                            <Play size={18} /> Play All
                        </button>
                    </div>

                    <div className="flex flex-row flex-wrap justify-center">
                        {selectedPlaylist.tracks.map((item, idx) => (
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
                </div>
            ) : (
                <div className="w-full max-w-6xl">
                    <h2 className="text-2xl font-bold mb-6">Your Spotify Playlists</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {playlists.map((pl) => (
                            <div
                                key={pl.id}
                                onClick={() => fetchPlaylistTracks(pl.id)}
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
                    <h2 className="text-xl font-semibold mt-10 mb-3">Your Saved Albums</h2>
                    <div className="flex flex-row flex-wrap justify-start items-center gap-1">
                        {albums.map((albumItem) => {
                            const album = albumItem.album;
                            return (
                                <div key={album.id} className="cursor-pointer bg-white/5 p-4 rounded-xl hover:bg-white/10 transition">
                                    <img src={album.images[0]?.url} alt={album.name} className="rounded-xl mb-3 w-full h-40 object-cover" />
                                    <p className="text-white font-semibold text-lg">{album.name}</p>
                                    <p className="text-sm text-gray-400">{album.artists.map(a => a.name).join(', ')}</p>
                                </div>
                            );
                        })}
                    </div>


                    <h2 className="text-2xl font-bold mt-12 mb-4 pl-3">Locally Saved Songs</h2>
                    {localSaved.length === 0 ? (
                        <p className="text-gray-400">No local songs saved.</p>
                    ) : (
                        <div className="bg-white/5 p-2 rounded-xl border border-white/10 shadow-md">
                            <h3 className="text-xl font-semibold mb-4 pl-3">Saved Locally</h3>
                            <div className="flex flex-row flex-wrap justify-center">
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
                </div>
            )}
        </div>
    );
};

export default PlaylistSection;
