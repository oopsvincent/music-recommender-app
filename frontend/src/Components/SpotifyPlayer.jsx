import React, { useEffect, useState } from 'react';

const SpotifyPlayer = () => {
    const playTrack = (token, deviceId, uri) => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                uris: [uri],  // For a single track
                // context_uri: 'spotify:album:YOUR_ALBUM_ID', // For album/playlist
            }),
        }).then(res => {
            if (res.ok) {
                console.log('Track is playing!');
            } else {
                console.error('Failed to start playback');
            }
        });
    };

    
    // In your React project (any component or effect)
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = "BQDYYU-cHL6f0kvxeE06baFYPlmJf-TvsO8maJVZQXLD2FTg_OZUQcPX3g4Dx4fcKtItiF02SSEYyptVmdez5wG2LlKLurJ3fFdVFEboVVDpESSRa5wSoDSNYbYFE9XYRMzWBNft-2GBLVRm_06rjchQzoErUXf7oYb5odQN1Jqy5hK8K_SX_4hkqsJk-NqehbN42kWzbr370GQUPiY4sYTZCmUcpzjygLvXdUZDXFbwzKZgpq_lhBZ6DPQ--qkbI0NAmHw8d6dDPRkw15QMPNgWuHcu36t8hszVzxabqMHAm4c";
    
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
    
            // Playback status updates
            player.addListener('player_state_changed', state => {
                console.log('Player state changed:', state);
            });
    
            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
    
                // ✅ Transfer playback to this device
                fetch('https://api.spotify.com/v1/me/player', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: true,  // Auto-play after transfer
                    }),
                }).then(res => {
                    if (res.ok) {
                        console.log('Playback transferred!');
                        // ✅ Optional: Start playback of a track or playlist
                        playTrack(token, device_id, 'spotify:track:2plbrEY59IikOBgBGLjaoe');
                    } else {
                        console.error('Failed to transfer playback');
                    }
                });
            });
    
            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
    
            // Connect to the player!
            player.connect();
        };
    }, []);
  
  return (

    <div>SpotifyPlayer</div>
  )
}

export default SpotifyPlayer