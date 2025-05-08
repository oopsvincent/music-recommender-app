import React, { useEffect, useState } from 'react';

const SpotifyPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Replace with a **fresh valid token** (expires in 1 hour)
  const token = localStorage.getItem('access_token') // Truncated for safety

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: "OopsVincent Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
      setPlayer(player);
    };
  }, [token]);

  const transferPlaybackAndPlay = () => {
    if (!player || !deviceId) {
      console.error('Player or deviceId not ready');
      return;
    }

    // Transfer playback
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false  // Do NOT auto-play here
      }),
    }).then(res => {
      if (res.ok) {
        console.log('Playback transferred!');

        // Now explicitly start track
        playTrack(token, deviceId, 'spotify:track:2plbrEY59IikOBgBGLjaoe');
      } else {
        console.error('Failed to transfer playback');
      }
    });
  };

  const playTrack = (token, deviceId, uri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        uris: [uri],
      }),
    }).then(res => {
      if (res.ok) {
        console.log('Track is playing!');
      } else {
        console.error('Failed to start playback');
      }
    });
  };

  return (
    <div className='bg-transparent h-lvh w-lvw text-white flex justify-center items-center flex-col'>
      <h2 className='text-4xl m-5'>Spotify Player</h2>
      <button onClick={transferPlaybackAndPlay} disabled={!deviceId} className='bg-white rounded-2xl p-5 disabled:bg-gray text-black'>
        Start Spotify Playback
      </button>
    </div>
  );
};

export default SpotifyPlayer;
