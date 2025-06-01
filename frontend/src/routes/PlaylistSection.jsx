import React, { useEffect, useState } from 'react';
import PlaylistHeader from '../Components/PlaylistHeader';
import PlaylistTracks from '../Components/PlaylistTracks';
import PlaylistsOverview from '../Components/PlaylistOverview';
import SavedAlbums from '../Components/SavedAlbums';
import LocallySavedSongs from '../Components/LocallySavedSongs';
import { usePlayer } from '../contexts/PlayerContext';
import FollowedArtist from '../Components/FollowedArtist';

const PlaylistSection = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [localSaved, setLocalSaved] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedSection, setSelectedSection] = useState('playlists'); // chips: playlists, albums, saved
  const { showPlayer } = usePlayer();

  useEffect(() => {
    fetchPlaylists();
    fetchAlbums();
    fetchArtists();
    loadLocalSaved();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
      const data = await res.json();
      setPlaylists(data.playlists.items);
      console.log(playlists);
      
    } catch (err) {
      console.error('[ERROR] Failed to fetch playlists:', err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me/albums', { credentials: 'include' });
      const data = await res.json();
      setAlbums(data.items);
    } catch (err) {
      console.error('[ERROR] Failed to fetch albums:', err);
    }
  };
  
  const fetchArtists = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me/artists', { credentials: 'include' });
      const data = await res.json();
      setArtists(data.artists.items);
      console.log(data.artists.items);
      
      
    } catch (err) {
      console.error('[ERROR] Failed to fetch albums:', err);
    }
  };


  const loadLocalSaved = () => {
    const saved = localStorage.getItem("savedSongs");
    if (saved) setLocalSaved(JSON.parse(saved));
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', {
        credentials: 'include'
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      
setSelectedPlaylist({
  id: playlistId,
  name: data.name,
  image: data.images?.[0]?.url,
  owner: data.owner?.display_name,
  tracks: data.items,
});

    } catch (err) {
      console.error('[ERROR] Failed to fetch playlist tracks:', err);
    }
  };

  const fetchAlbumTracks = async (albumId) => {
    try {
      const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', {
        credentials: 'include'
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data);
      
setSelectedAlbum({
  id: albumId,
  name: data.name,
  image: data.images?.[0]?.url,
  owner: data.artists.map(a => a.name).join(', '), // albums don't have an "owner" like playlists do
  label: data.label,
  copyrights: data.copyrights,
  total_tracks: data.total_tracks,
  release_date: data.release_date,
  uri: data.uri,
  tracks: data.tracks.items.map(item => ({
    track: {
      ...item,
      uri: item.uri,
      name: item.name,
      artists: item.artists,
      popularity: data.popularity,
      album: data, // attach album info
    }
  }))
});

    } catch (err) {
      console.error('[ERROR] Failed to fetch album tracks:', err);
    }
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
    setSelectedAlbum(null);
  };

  const handlePlayAll = () => {
    const item = selectedAlbum.uri;
    showPlayer(item);
    const items = selectedPlaylist?.tracks || selectedAlbum?.uri || [];
    const uris = items.map(item => (item.track ? item.track.uri : item.uri));
    console.log(uris);
    
    if (uris.length > 0) showPlayer(uris);
  };

  const renderChips = () => (
    <div className='flex gap-3 mb-6'>
      {['playlists', 'albums', 'artists', 'saved'].map(type => (
        <button
          key={type}
          onClick={() => {
            setSelectedSection(type);
            handleBack(); // Reset album/playlist view
          }}
          className={`px-4 py-2 rounded-full font-medium ${
            selectedSection === type ? 'bg-green-500 text-black' : 'bg-gray-700 text-white'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className='w-full max-w-6xl'>{renderChips()}</div>

      {(selectedPlaylist || selectedAlbum) ? (
        <div className="w-full max-w-6xl">
<PlaylistHeader
  handleBack={handleBack}
  handlePlayAll={handlePlayAll}
  data={selectedPlaylist || selectedAlbum}
/>

          <PlaylistTracks tracks={(selectedPlaylist?.tracks || selectedAlbum?.tracks) || []} />
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          {selectedSection === 'playlists' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Spotify Playlists</h2>
              <PlaylistsOverview playlists={playlists} onSelectPlaylist={fetchPlaylistTracks} />
            </>
          )}

          {selectedSection === 'albums' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Saved Albums</h2>
              <SavedAlbums albums={albums} onSelectAlbum={fetchAlbumTracks} />
            </>
          )}
          {selectedSection === 'artists' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Saved Albums</h2>
            <FollowedArtist artists={artists} />
            </>
          )}

          {selectedSection === 'saved' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Local Saved Songs</h2>
              <LocallySavedSongs localSaved={localSaved} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistSection;
