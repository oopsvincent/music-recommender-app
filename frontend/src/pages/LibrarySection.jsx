import React, { useEffect, useState } from 'react';
import PlaylistHeader from '../Components/PlaylistHeader';
import PlaylistTracks from '../Components/PlaylistTracks';
import PlaylistsOverview from '../Components/PlaylistOverview';
import SavedAlbums from '../Components/SavedAlbums';
import LocallySavedSongs from '../Components/LocallySavedSongs';
import FollowedArtist from '../Components/FollowedArtist';
import { usePlayer } from '../contexts/PlayerContext';
import { Loader2 } from 'lucide-react';

const LibrarySection = () => {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSection, setSelectedSection] = useState('playlists');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // localStorage fallbacks
  const [localSaved, setLocalSaved] = useState([]);
  const [localAlbums, setLocalAlbums] = useState([]);
  const [localArtists, setLocalArtists] = useState([]);

  const { showPlayer } = usePlayer();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
      fetchAlbums();
      fetchArtists();
    } else {
      loadLocalData();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
      const data = await res.json();
      if (data?.playlists?.items) {
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid shape');
      }
    } catch (err) {
      console.warn('[AUTH] Not authenticated. Using localStorage.');
      setIsAuthenticated(false);
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    try {
      const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
      const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');
      const savedArtists = JSON.parse(localStorage.getItem('savedArtists') || '[]');
      setLocalSaved(savedSongs);
      setLocalAlbums(savedAlbums);
      setLocalArtists(savedArtists);
    } catch (err) {
      console.warn('[LOCAL LOAD ERROR]', err);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
      const data = await res.json();
      setPlaylists(data.playlists.items);
    } catch (err) {
      console.error('[ERROR] Playlists fetch failed:', err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me/albums', { credentials: 'include' });
      const data = await res.json();
      setAlbums(data.items);
    } catch (err) {
      console.error('[ERROR] Albums fetch failed:', err);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me/artists', { credentials: 'include' });
      const data = await res.json();
      setArtists(data.artists.items);
    } catch (err) {
      console.error('[ERROR] Artists fetch failed:', err);
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', { credentials: 'include' });
      const { access_token } = await tokenRes.json();
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const data = await res.json();
      setSelectedPlaylist({
        id: playlistId,
        name: data.name,
        image: data.images?.[0]?.url,
        owner: data.owner?.display_name,
        tracks: data.tracks.items,
      });
    } catch (err) {
      console.error('[ERROR] Playlist tracks fetch failed:', err);
    }
  };

  const fetchAlbumTracks = async (albumId) => {
    try {
      const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', { credentials: 'include' });
      const { access_token } = await tokenRes.json();
      const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const data = await res.json();
      setSelectedAlbum({
        id: albumId,
        name: data.name,
        image: data.images?.[0]?.url,
        owner: data.artists.map(a => a.name).join(', '),
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
            album: data,
          }
        }))
      });
    } catch (err) {
      console.error('[ERROR] Album tracks fetch failed:', err);
    }
  };

  const handleBack = () => {
    setSelectedAlbum(null);
    setSelectedPlaylist(null);
  };

  const handlePlayAll = () => {
    const items = selectedPlaylist?.tracks || selectedAlbum?.tracks || [];
    const uris = items.map(item => item.track?.uri || item.uri);
    if (uris.length > 0) showPlayer(uris);
  };

  const renderChips = () => (
    <div className="flex gap-4 mb-8">
      {['playlists', 'albums', 'artists', 'saved'].map(section => (
        <button
          key={section}
          onClick={() => {
            setSelectedSection(section);
            handleBack();
          }}
          className={`px-5 py-2 rounded-full font-medium text-sm ${
            selectedSection === section
              ? 'bg-green-500 text-black'
              : 'bg-gray-700 text-white'
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Loading your library...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-10 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {!isAuthenticated && (
        <div className="mb-6 text-yellow-300 bg-yellow-800/30 p-3 rounded-md text-sm text-center border border-yellow-500/30">
          You’re not logged in. Showing locally saved content only. <br />
          <a href="/account" className="underline text-yellow-400">Login to Spotify</a> to view your full library.
        </div>
      )}

      <div className="w-full max-w-6xl">{renderChips()}</div>

      {(selectedPlaylist || selectedAlbum) ? (
        <div className="w-full max-w-6xl space-y-6">
          <PlaylistHeader handleBack={handleBack} handlePlayAll={handlePlayAll} data={selectedPlaylist || selectedAlbum} />
          <PlaylistTracks tracks={(selectedPlaylist?.tracks || selectedAlbum?.tracks) || []} />
        </div>
      ) : (
        <div className="w-full max-w-6xl space-y-10">
          {selectedSection === 'playlists' && (
            <>
              <h2 className="text-2xl font-semibold">
                Your {isAuthenticated ? 'Spotify' : 'Locally Saved'} Playlists
              </h2>
              <PlaylistsOverview
                playlists={isAuthenticated ? playlists : []}
                onSelectPlaylist={fetchPlaylistTracks}
              />
            </>
          )}

          {selectedSection === 'albums' && (
            <>
              <h2 className="text-2xl font-semibold">
                Your {isAuthenticated ? 'Saved Albums' : 'Local Albums'}
              </h2>
              {(isAuthenticated ? albums.length : localAlbums.length) > 0 ? (
                <SavedAlbums
                  albums={isAuthenticated ? albums : localAlbums}
                  onSelectAlbum={fetchAlbumTracks}
                />
              ) : (
                <p className="text-gray-400 text-sm text-center">No albums found.</p>
              )}
            </>
          )}

          {selectedSection === 'artists' && (
            <>
              <h2 className="text-2xl font-semibold">
                Your {isAuthenticated ? 'Followed Artists' : 'Local Artists'}
              </h2>
              {(isAuthenticated ? artists.length : localArtists.length) > 0 ? (
                <FollowedArtist artists={isAuthenticated ? artists : localArtists} />
              ) : (
                <p className="text-gray-400 text-sm text-center">No artists found.</p>
              )}
            </>
          )}

          {/* ✅ Locally Saved is untouched from your original version */}
          {selectedSection === 'saved' && (
            <>
              <h2 className="text-2xl font-semibold text-center">Your Locally Saved Songs</h2>
              <LocallySavedSongs localSaved={localSaved} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LibrarySection;
