import React, { useEffect, useState, useCallback } from 'react';
import PlaylistHeader from '../Components/PlaylistHeader';
import PlaylistTracks from '../Components/PlaylistTracks';
import PlaylistsOverview from '../Components/PlaylistOverview';
import SavedAlbums from '../Components/SavedAlbums';
import LocallySavedSongs from '../Components/LocallySavedSongs';
import FollowedArtist from '../Components/FollowedArtist';
import { usePlayer } from '../contexts/PlayerContext';
import { Loader, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const LibrarySection = () => {
    const spotifyAvailable = false;
  // Core state
//   const [playlists, setPlaylists] = useState([]);
//   const [albums, setAlbums] = useState([]);
//   const [artists, setArtists] = useState([]);
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [selectedAlbum, setSelectedAlbum] = useState(null);
//   const [selectedSection, setSelectedSection] = useState('playlists');
  
//   // Loading states
//   const [loading, setLoading] = useState(true);
//   const [fetchingTracks, setFetchingTracks] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [error, setError] = useState(null);

//   // Local storage fallbacks
//   const [localSaved, setLocalSaved] = useState([]);
//   const [localAlbums, setLocalAlbums] = useState([]);
//   const [localArtists, setLocalArtists] = useState([]);

//   const { showPlayer } = usePlayer();

//   // Load local data function
//   const loadLocalData = useCallback(() => {
//     try {
//       const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
//       const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');
//       const savedArtists = JSON.parse(localStorage.getItem('savedArtists') || '[]');
      
//       setLocalSaved(savedSongs);
//       setLocalAlbums(savedAlbums);
//       setLocalArtists(savedArtists);
//     } catch (err) {
//       console.warn('[LOCAL STORAGE] Error loading local data:', err);
//       setError('Failed to load local data');
//     }
//   }, []);

//   // Check authentication
//   const checkAuth = useCallback(async () => {
//     try {
//       const res = await fetch('https://music-recommender-api.onrender.com/me', { 
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }

//       const data = await res.json();
      
//       if (data?.playlists?.items || data?.id) {
//         setIsAuthenticated(true);
//         setError(null);
//       } else {
//         throw new Error('Invalid response structure');
//       }
//     } catch (err) {
//       console.warn('[AUTH] Authentication failed:', err.message);
//       setIsAuthenticated(false);
//       setError(null); // Don't show error for auth failure
//     }
//   }, []);

//   // Fetch functions with better error handling
//   const fetchPlaylists = useCallback(async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       const res = await fetch('https://music-recommender-api.onrender.com/me', { 
//         credentials: 'include' 
//       });
      
//       if (!res.ok) throw new Error(`Failed to fetch playlists: ${res.status}`);
      
//       const data = await res.json();
//       setPlaylists(data?.playlists?.items || []);
//     } catch (err) {
//       console.error('[ERROR] Playlists fetch failed:', err);
//       setError('Failed to load playlists');
//     }
//   }, [isAuthenticated]);

//   const fetchAlbums = useCallback(async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       const res = await fetch('https://music-recommender-api.onrender.com/me/albums', { 
//         credentials: 'include' 
//       });
      
//       if (!res.ok) throw new Error(`Failed to fetch albums: ${res.status}`);
      
//       const data = await res.json();
//       setAlbums(data?.items || []);
//     } catch (err) {
//       console.error('[ERROR] Albums fetch failed:', err);
//       setError('Failed to load albums');
//     }
//   }, [isAuthenticated]);

//   const fetchArtists = useCallback(async () => {
//     if (!isAuthenticated) return;
    
//     try {
//       const res = await fetch('https://music-recommender-api.onrender.com/me/artists', { 
//         credentials: 'include' 
//       });
      
//       if (!res.ok) throw new Error(`Failed to fetch artists: ${res.status}`);
      
//       const data = await res.json();
//       setArtists(data?.artists?.items || []);
//     } catch (err) {
//       console.error('[ERROR] Artists fetch failed:', err);
//       setError('Failed to load artists');
//     }
//   }, [isAuthenticated]);

//   // Fetch playlist tracks with loading state
//   const fetchPlaylistTracks = async (playlistId) => {
//     if (!playlistId) return;
    
//     setFetchingTracks(true);
//     setError(null);
    
//     try {
//       const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', { 
//         credentials: 'include' 
//       });
      
//       if (!tokenRes.ok) throw new Error('Failed to refresh token');
      
//       const { access_token } = await tokenRes.json();
      
//       const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
//         headers: { Authorization: `Bearer ${access_token}` }
//       });
      
//       if (!res.ok) throw new Error(`Failed to fetch playlist: ${res.status}`);
      
//       const data = await res.json();
      
//       setSelectedPlaylist({
//         id: playlistId,
//         name: data.name || 'Unknown Playlist',
//         image: data.images?.[0]?.url || null,
//         owner: data.owner?.display_name || 'Unknown',
//         description: data.description || '',
//         tracks: data.tracks?.items || [],
//         total: data.tracks?.total || 0,
//       });
//     } catch (err) {
//       console.error('[ERROR] Playlist tracks fetch failed:', err);
//       setError('Failed to load playlist tracks');
//     } finally {
//       setFetchingTracks(false);
//     }
//   };

//   // Fetch album tracks with loading state
//   const fetchAlbumTracks = async (albumId) => {
//     if (!albumId) return;
    
//     setFetchingTracks(true);
//     setError(null);
    
//     try {
//       const tokenRes = await fetch('https://music-recommender-api.onrender.com/refresh_access_token', { 
//         credentials: 'include' 
//       });
      
//       if (!tokenRes.ok) throw new Error('Failed to refresh token');
      
//       const { access_token } = await tokenRes.json();
      
//       const res = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
//         headers: { Authorization: `Bearer ${access_token}` }
//       });
      
//       if (!res.ok) throw new Error(`Failed to fetch album: ${res.status}`);
      
//       const data = await res.json();
      
//       setSelectedAlbum({
//         id: albumId,
//         name: data.name || 'Unknown Album',
//         image: data.images?.[0]?.url || null,
//         owner: data.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
//         label: data.label || '',
//         copyrights: data.copyrights || [],
//         total_tracks: data.total_tracks || 0,
//         release_date: data.release_date || '',
//         uri: data.uri || '',
//         tracks: data.tracks?.items?.map(item => ({
//           track: {
//             ...item,
//             uri: item.uri,
//             name: item.name,
//             artists: item.artists,
//             popularity: data.popularity || 0,
//             album: {
//               id: data.id,
//               name: data.name,
//               images: data.images,
//             },
//           }
//         })) || []
//       });
//     } catch (err) {
//       console.error('[ERROR] Album tracks fetch failed:', err);
//       setError('Failed to load album tracks');
//     } finally {
//       setFetchingTracks(false);
//     }
//   };

//   // Navigation handlers
//   const handleBack = () => {
//     setSelectedAlbum(null);
//     setSelectedPlaylist(null);
//     setError(null);
//   };

//   const handlePlayAll = () => {
//     const items = selectedPlaylist?.tracks || selectedAlbum?.tracks || [];
//     const uris = items
//       .map(item => item.track?.uri || item.uri)
//       .filter(uri => uri); // Filter out null/undefined URIs
    
//     if (uris.length > 0) {
//       showPlayer(uris);
//     } else {
//       setError('No playable tracks found');
//     }
//   };

//   const handleSectionChange = (section) => {
//     setSelectedSection(section);
//     handleBack();
//     setError(null);
//   };

//   // Effects
//   useEffect(() => {
//     const initializeLibrary = async () => {
//       setLoading(true);
//       await checkAuth();
//       loadLocalData();
//       setLoading(false);
//     };

//     initializeLibrary();
//   }, [checkAuth, loadLocalData]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       Promise.allSettled([
//         fetchPlaylists(),
//         fetchAlbums(),
//         fetchArtists()
//       ]).then(() => {
//         console.log('[INFO] Library data loaded');
//       });
//     }
//   }, [isAuthenticated, fetchPlaylists, fetchAlbums, fetchArtists]);

  // Render section chips
  const renderChips = () => {
    const sections = [
      { key: 'playlists', label: 'Playlists', count: isAuthenticated ? playlists.length : 0 },
      { key: 'albums', label: 'Albums', count: isAuthenticated ? albums.length : localAlbums.length },
      { key: 'artists', label: 'Artists', count: isAuthenticated ? artists.length : localArtists.length },
    //   { key: 'saved', label: 'Saved Songs', count: localSaved.length }
    ];

    return (
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.key}
            onClick={() => handleSectionChange(section.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              selectedSection === section.key
                ? 'bg-green-500 text-black shadow-lg'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {section.label}
            {section.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedSection === section.key 
                  ? 'bg-black/20 text-black' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {section.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  // Error component
  const ErrorBanner = ({ message, onRetry }) => (
    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-200 text-sm">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="mt-2 text-xs text-red-300 hover:text-red-100 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );

  // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
//         <div className="text-center">
//           <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-green-500" />
//           <p className="text-lg font-medium">Loading your library...</p>
//           <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex justify-center items-center">

        <div className='h-full w-full flex flex-col justify-center items-center p-5 text-center'>
            <h1 className='text-4xl'>Coming Soon...</h1>
            <p>Spotify declined our application twice, so there's a chance that this page might not be ever available</p>
        </div>


    { spotifyAvailable && <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Authentication Status */}
        <div className="mb-6">
          {!isAuthenticated ? (
            <div className="p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-200 text-sm font-medium">Offline Mode</p>
                <p className="text-yellow-300/80 text-xs mt-1">
                  Showing locally saved content only. 
                  <a href="/account" className="underline text-yellow-300 hover:text-yellow-100 ml-1">
                    Login to Spotify
                  </a> to access your full library.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg flex items-center gap-3">
              <Wifi className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-green-200 text-sm">Connected to Spotify</p>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner 
            message={error} 
            onRetry={() => {
              setError(null);
              if (isAuthenticated) {
                fetchPlaylists();
                fetchAlbums();
                fetchArtists();
              }
            }}
          />
        )}

        {/* Section Navigation */}
        {renderChips()}

        {/* Main Content */}
        {fetchingTracks ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin w-6 h-6 mx-auto mb-3 text-green-500" />
              <p className="text-gray-300">Loading tracks...</p>
            </div>
          </div>
        ) : (selectedPlaylist || selectedAlbum) ? (
          <div className="space-y-6">
            <PlaylistHeader 
              handleBack={handleBack} 
              handlePlayAll={handlePlayAll} 
              data={selectedPlaylist || selectedAlbum} 
            />
            <PlaylistTracks 
              tracks={(selectedPlaylist?.tracks || selectedAlbum?.tracks) || []} 
            />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Playlists Section */}
            {selectedSection === 'playlists' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAuthenticated ? 'Your Playlists' : 'No Playlists Available'}
                  </h2>
                  {isAuthenticated && playlists.length > 0 && (
                    <span className="text-sm text-gray-400">
                      {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {isAuthenticated && playlists.length > 0 ? (
                  <PlaylistsOverview
                    playlists={playlists}
                    onSelectPlaylist={fetchPlaylistTracks}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-lg mb-2">
                      {isAuthenticated ? 'No playlists found' : 'Login required'}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {isAuthenticated 
                        ? 'Create some playlists on Spotify to see them here'
                        : 'Connect your Spotify account to view your playlists'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Albums Section */}
            {selectedSection === 'albums' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAuthenticated ? 'Saved Albums' : 'Local Albums'}
                  </h2>
                  {((isAuthenticated && albums.length > 0) || (!isAuthenticated && localAlbums.length > 0)) && (
                    <span className="text-sm text-gray-400">
                      {isAuthenticated ? albums.length : localAlbums.length} album{(isAuthenticated ? albums.length : localAlbums.length) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {(isAuthenticated ? albums.length : localAlbums.length) > 0 ? (
                  <SavedAlbums
                    albums={isAuthenticated ? albums : localAlbums}
                    onSelectAlbum={fetchAlbumTracks}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-lg mb-2">No albums found</div>
                    <p className="text-gray-500 text-sm">
                      {isAuthenticated 
                        ? 'Save some albums on Spotify to see them here'
                        : 'No locally saved albums available'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Artists Section */}
            {selectedSection === 'artists' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAuthenticated ? 'Followed Artists' : 'Local Artists'}
                  </h2>
                  {((isAuthenticated && artists.length > 0) || (!isAuthenticated && localArtists.length > 0)) && (
                    <span className="text-sm text-gray-400">
                      {isAuthenticated ? artists.length : localArtists.length} artist{(isAuthenticated ? artists.length : localArtists.length) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {(isAuthenticated ? artists.length : localArtists.length) > 0 ? (
                  <FollowedArtist artists={isAuthenticated ? artists : localArtists} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-lg mb-2">No artists found</div>
                    <p className="text-gray-500 text-sm">
                      {isAuthenticated 
                        ? 'Follow some artists on Spotify to see them here'
                        : 'No locally saved artists available'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Songs Section */}
            {selectedSection === 'saved' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Locally Saved Songs</h2>
                  {localSaved.length > 0 && (
                    <span className="text-sm text-gray-400">
                      {localSaved.length} song{localSaved.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {localSaved.length > 0 ? (
                  <LocallySavedSongs localSaved={localSaved} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-lg mb-2">No saved songs found</div>
                    <p className="text-gray-500 text-sm">
                      Songs you save locally will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div> }
    </div>
  );
};

export default LibrarySection;