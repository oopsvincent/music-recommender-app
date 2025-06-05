// PlaylistSection.jsx
import React, { useEffect, useState } from 'react';
import PlaylistHeader from '../Components/PlaylistHeader';
import PlaylistTracks from '../Components/PlaylistTracks';
import PlaylistsOverview from '../Components/PlaylistOverview';
import SavedAlbums from '../Components/SavedAlbums';
import LocallySavedSongs from '../Components/LocallySavedSongs';
import { usePlayer } from '../contexts/PlayerContext';
import FollowedArtist from '../Components/FollowedArtist';
import { Loader2 } from 'lucide-react'; // You can use any spinner you prefer


const PlaylistSection = () => {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSection, setSelectedSection] = useState('playlists');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localSaved, setLocalSaved] = useState([]);
  const [localAlbums, setLocalAlbums] = useState([]);
  const [localArtists, setLocalArtists] = useState([]);
  const [loading, setLoading] = useState(true);
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
      loadLocalStorageData();
    }
  }, [isAuthenticated]);

const checkAuth = async () => {
  try {
    const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });

    if (!res.ok) throw new Error('Not authenticated');

    const data = await res.json();

    if (data && data.playlists && Array.isArray(data.playlists.items)) {
      setPlaylists(data.playlists.items);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid data shape, not authenticated');
    }
  } catch (err) {
    console.warn('[AUTH] Not authenticated. Using localStorage fallback.');
    setIsAuthenticated(false);
    loadLocalStorageData();
  } finally {
    setLoading(false); // Set loading to false regardless of success/failure
  }
};


  const fetchPlaylists = async () => {
    try {
      const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
      const data = await res.json();
      setPlaylists(data.playlists.items);
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
    } catch (err) {
      console.error('[ERROR] Failed to fetch artists:', err);
    }
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
      console.error('[ERROR] Failed to fetch album tracks:', err);
    }
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
    setSelectedAlbum(null);
  };




  const handlePlayAll = () => {
    const item = selectedAlbum?.uri;
    const items = selectedPlaylist?.tracks || selectedAlbum?.tracks || [];
    const uris = items.map(item => item.track?.uri || item.uri);
    if (uris.length > 0) showPlayer(uris);
  };

  const renderChips = () => (
    <div className='flex gap-3 mb-6'>
      {['playlists', 'albums', 'artists', 'saved'].map(type => (
        <button
          key={type}
          onClick={() => {
            setSelectedSection(type);
            handleBack();
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


useEffect(() => {
  console.log('Auth status:', isAuthenticated);
}, [isAuthenticated]);

const loadLocalStorageData = () => {
  try {
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
    const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');
    const savedArtists = JSON.parse(localStorage.getItem('savedArtists') || '[]');

    console.log('[LOCAL DATA]', { savedSongs, savedAlbums, savedArtists });

    setLocalSaved(Array.isArray(savedSongs) ? savedSongs : []);
    setLocalAlbums(Array.isArray(savedAlbums) ? savedAlbums : []);
    setLocalArtists(Array.isArray(savedArtists) ? savedArtists : []);
  } catch (err) {
    console.warn('[LOCAL STORAGE ERROR]', err);
  }
};



    if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Loader2 className="animate-spin w-8 h-8 mr-3" />
      <span className="text-lg">Loading your music library...</span>
    </div>
  );
}


  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        {!isAuthenticated && (
  <div className="mb-6 text-yellow-300 bg-yellow-800/30 p-3 rounded-md text-sm text-center border border-yellow-500/30">
    You’re not logged in. Showing locally saved content only. <br />
    <a href="/auth/login" className="underline text-yellow-400">Login to Spotify</a> to view your full library.
  </div>
)}

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
              <h2 className="text-2xl font-bold mb-6">Your {isAuthenticated ? 'Spotify' : 'Locally Saved'} Playlists</h2>
              <PlaylistsOverview playlists={isAuthenticated ? playlists : []} onSelectPlaylist={fetchPlaylistTracks} />
            </>
          )}
{selectedSection === 'albums' && (
  <>
    <h2 className="text-2xl font-bold mb-6">
      Your {isAuthenticated ? 'Saved Albums' : 'Local Albums'}
    </h2>
    {(isAuthenticated ? albums.length : localAlbums.length) > 0 ? (
      <SavedAlbums
        albums={isAuthenticated ? albums : localAlbums}
        onSelectAlbum={fetchAlbumTracks}
      />
    ) : (
      <p className="text-gray-400 text-sm text-center">No albums found. {isAuthenticated ? '' : 'Save some albums to see them here.'}</p>
    )}
  </>
)}

{selectedSection === 'artists' && (
  <>
    <h2 className="text-2xl font-bold mb-6">
      Your {isAuthenticated ? 'Followed Artists' : 'Local Saved Artists'}
    </h2>
    {(isAuthenticated ? artists.length : localArtists.length) > 0 ? (
      <FollowedArtist artists={isAuthenticated ? artists : localArtists} />
    ) : (
      <p className="text-gray-400 text-sm text-center">No artists found.</p>
    )}
  </>
)}

{selectedSection === 'saved' && (
  <>
    <h2 className="text-2xl font-bold mb-6 text-center">Your Locally Saved Songs</h2>
    {localSaved.length > 0 ? (
      <LocallySavedSongs localSaved={localSaved} />
    ) : (
      <p className="text-gray-400 text-sm text-center">No saved songs yet. Save tracks to see them here.</p>
    )}
  </>
)}

        </div>
      )}
    </div>
  );
};

export default PlaylistSection;
