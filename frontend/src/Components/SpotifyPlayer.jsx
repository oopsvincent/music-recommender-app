// src/components/SpotifyPlayer.jsx
import React, { useEffect, useState } from 'react';

export default function SpotifyPlayer() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('access_token'); // Your valid token

  useEffect(() => {
    if (!token) {
      setErrorMessage('Spotify token not found. Please authenticate.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Harmony Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5
      });

      newPlayer.addListener('initialization_error', ({ message }) => console.error('Init Error:', message));
      newPlayer.addListener('authentication_error', ({ message }) => console.error('Auth Error:', message));
      newPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
        setErrorMessage('Spotify Premium is required to use this player.');
      });
      newPlayer.addListener('playback_error', ({ message }) => console.error('Playback Error:', message));

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID:', device_id);
        setDeviceId(device_id);
      });

      newPlayer.addListener('player_state_changed', state => {
        if (!state) return;
        const { paused, track_window } = state;
        setIsPaused(paused);
        const track = track_window.current_track;
        setCurrentTrack({
          title: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          albumImage: track.album.images[0]?.url,
          uri: track.uri
        });
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const transferPlayback = async () => {
    if (!deviceId) return;
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ device_ids: [deviceId], play: true })
    });
  };

  const handlePlayPause = () => {
    if (!player) return;
    player.togglePlay();
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    player.setVolume(vol);
  };

  return (
    <div className="bg-zinc-900 text-white rounded-xl p-5 w-full max-w-md mx-auto shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">🎵 Harmony Spotify Player</h2>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      {!errorMessage && (
        <>
          <div className="flex flex-col items-center mb-4">
            {currentTrack ? (
              <>
                <img src={currentTrack.albumImage} alt="Album cover" className="w-32 h-32 rounded-lg shadow mb-2" />
                <p className="font-bold text-lg text-center">{currentTrack.title}</p>
                <p className="text-sm text-gray-400 text-center">{currentTrack.artists}</p>
              </>
            ) : (
              <p className="italic text-gray-400">No track playing</p>
            )}
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={transferPlayback}
              disabled={!deviceId}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-black disabled:opacity-50"
            >
              Connect & Transfer Playback
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handlePlayPause}
              disabled={!player}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {isPaused ? '▶️ Play' : '⏸ Pause'}
            </button>
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="volume" className="text-sm mb-1">Volume</label>
            <input
              type="range"
              id="volume"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
