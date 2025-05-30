import React, { useEffect, useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

const SpotifyPlayer = () => {
const { isAuthenticated, isPremium, trackUri, visiblePlayer } = usePlayer();
  const [playerState, setPlayerState] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!isAuthenticated || !isPremium || !visiblePlayer || !trackUri) return;

  const pollPlayState = async () => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) throw new Error('No access token found');

      const res = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204 || res.status === 202) {
        console.warn('[WARN] Player not currently playing.');
        setPlayerState(null);
        return;
      }

      const data = await res.json();
      if (!data || !data.item) {
        console.warn('[WARN] Invalid play state received:', data);
        setPlayerState(null);
        return;
      }

      setPlayerState(data);
    } catch (err) {
      console.error('[ERROR] Failed to poll player state:', err);
      setError(err);
    }
  };

  const interval = setInterval(pollPlayState, 3000);
  return () => clearInterval(interval);
}, [isAuthenticated, isPremium, visiblePlayer, trackUri]);

  const renderPlayerContent = () => {
    if (!isAuthenticated) {
      return <div className="text-center text-red-600 font-bold">Please log in to see the player.</div>;
    }

    if (!isPremium) {
      return (
        <div className="text-center text-yellow-600 font-bold text-xl">
          YOU NEED A SPOTIFY PREMIUM ACCOUNT TO LISTEN TO MUSIC IN OUR APP
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-600">Error: {error.message}</div>;
    }

    if (!playerState) {
      return <div className="text-center text-gray-500">Player is loading or nothing is playing...</div>;
    }

    const { item, is_playing, progress_ms } = playerState;
    const progress = Math.floor((progress_ms / item.duration_ms) * 100);

    return (
      <div className="bg-black text-white p-4 rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold">Now Playing</h2>
        <p className="text-sm">{item.name} by {item.artists.map(artist => artist.name).join(', ')}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs mt-1">{Math.floor(progress_ms / 1000)}s / {Math.floor(item.duration_ms / 1000)}s</p>
      </div>
    );
  };

  useEffect(() => {
  console.debug("[SpotifyPlayer] visiblePlayer:", visiblePlayer);
  console.debug("[SpotifyPlayer] trackUri:", trackUri);
  console.debug("[SpotifyPlayer] isPremium:", isPremium);
}, [visiblePlayer, trackUri, isPremium]);


  return (
    <div className="w-full max-w-md mx-auto my-8">
      {renderPlayerContent()}
    </div>
  );
};

export default SpotifyPlayer;
