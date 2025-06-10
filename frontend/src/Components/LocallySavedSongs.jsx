// LocallySavedSongs.jsx
import React, { useState, useEffect } from 'react';
import { TrackCard } from './CardComponents/TracksCard';
import { AlbumCard } from './CardComponents/AlbumsCard';
import { PlaylistCard } from './CardComponents/PlaylistsCard';
import { ArtistCard } from './CardComponents/ArtistsCard';

const LocallySavedSongs = () => {
    const [section, setSection] = useState("songs");

    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        try {
            const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
            const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
            const savedPlaylists = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
            const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];

            setSongs(Array.isArray(savedSongs) ? savedSongs : []);
            setAlbums(Array.isArray(savedAlbums) ? savedAlbums : []);
            setPlaylists(Array.isArray(savedPlaylists) ? savedPlaylists : []);
            setArtists(Array.isArray(savedArtists) ? savedArtists : []);
        } catch (err) {
            console.error("[ERROR] Failed to load local storage data:", err);
        }
    }, []);

    const renderContent = () => {
        switch (section) {
            case "songs":
                return songs.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved songs.</p>
                ) : (
                    songs.map((track, index) => (
                        <TrackCard
                            key={index}
                            url={track.image}
                            title={track.title}
                            artist={Array.isArray(track.artist) ? track.artist : []} // ✅ use track.artist, not track.artists
                            spoURL={track.spoURL}
                            YTURL={""}
                            popularity={track.popularity}
                            explicit={track.explicit}
                            trackURI={track.trackURI}
                            albumID={track.albumID}
                        />

                    ))
                );
            case "albums":
                return albums.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved albums.</p>
                ) : (
                    albums.map((album, index) => (
                        <AlbumCard
                            id={album.id}
                            key={index}
                            url={album.image}
                            title={album.title}
                            artist={Array.isArray(album.artist) ? album.artist : []} // ✅ use track.artist, not track.artists
                            spoURL={album.spoURL}
                            YTURL={album.YTURL}
                            released_date={album.released_date}
                            description={album.description}
                            trackURI={album.trackURI}
                        />
                    ))
                );
            case "playlists":
                return playlists.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved playlists.</p>
                ) : (
                    playlists.map((playlist, index) => (
                        <PlaylistCard
                            key={index}
                            url={playlist.image}
                            title={playlist.title}
                            spoURL={playlist.spoURL}
                            YTURL={playlist.YTURL}
                            owner={playlist.owner}
                            description={playlist.description}
                            isPublic={playlist.public}
                            trackURI={playlist.trackURI}
                        />
                    ))
                );
            case "artists":
                return artists.length === 0 ? (
                    <p className="text-gray-400 text-sm">No saved artists.</p>
                ) : (
                    artists.map((artist, index) => (
                        <ArtistCard
                            key={index}
                            url={artist.image}
                            title={artist.title}
                            spoURL={artist.spoURL}
                            YTURL={artist.YTURL}
                            popularity={artist.popularity}
                            followers={artist.followers}
                            URI={artist.URI}
                            id={artist.id}
                        />
                    ))
                );
            default:
                return <p className="text-gray-400">Select a valid section.</p>;
        }
    };

    return (
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 shadow-md">
            <div className="flex flex-row justify-between items-center">
                <h3 className="text-xl font-semibold mb-8 mt-3 pl-3">Saved Locally</h3>
                <select
                    onChange={(e) => setSection(e.target.value)}
                    value={section}
                    name="saved"
                    id="savedCategorySelect"
                    className="w-35 h-auto border-2 rounded-lg bg-black text-white text-xs p-1.5 focus:outline-none md:text-xl"
                >
                    <option value="songs">Songs</option>
                    <option value="artists">Artists</option>
                    <option value="playlists">Playlists</option>
                    <option value="albums">Albums</option>
                </select>
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-5">{renderContent()}</div>
        </div>
    );
};

export default LocallySavedSongs;
