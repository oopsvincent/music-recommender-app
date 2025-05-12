// SpotifyPlayer.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume1, Volume2, MonitorSpeaker, ChevronUp, ChevronDown } from "lucide-react";
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../hooks/AuthContext';

export default function SpotifyPlayer() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [devices, setDevices] = useState([]);
  const [activeDevice, setActiveDevice] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const { authTokens, isAuthenticated } = useAuth();
  const { visiblePlayer, trackUri, isPremium } = usePlayer();
  const token = authTokens?.access_token;

  if (!visiblePlayer || !isAuthenticated) return null; // Don't show player if not logged in

  const fetchDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDevices(data.devices);
    const active = data.devices.find(d => d.is_active);
    setActiveDevice(active ? active.id : null);
  };

  const transferPlayback = async (targetDeviceId) => {
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ device_ids: [targetDeviceId], play: false })
    });
    setActiveDevice(targetDeviceId);
    fetchDevices();
  };

  const togglePlay = () => {
    if (player && isPremium) player.togglePlay();
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (player && isPremium) player.setVolume(vol);
  };

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!token || !isPremium) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    let localPlayer = null;
    window.onSpotifyWebPlaybackSDKReady = () => {
      localPlayer = new window.Spotify.Player({
        name: 'Harmony Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5
      });

      localPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID:', device_id);
        setDeviceId(device_id);
        fetchDevices();
      });

      localPlayer.addListener('player_state_changed', state => {
        if (!state) return;
        const track = state.track_window.current_track;
        setIsPaused(state.paused);
        setCurrentTrack({
          title: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          albumImage: track.album.images[0]?.url,
        });
        setPosition(state.position);
        setDuration(state.duration);
      });

      localPlayer.connect();
      setPlayer(localPlayer);
    };

    return () => {
      if (localPlayer) localPlayer.disconnect();
    };
  }, [token, isPremium]);

  // Poll position
  useEffect(() => {
    if (!player || !isPremium) return;
    const poll = setInterval(() => {
      player.getCurrentState().then(state => {
        if (state) {
          setPosition(state.position);
          setDuration(state.duration);
        }
      });
    }, 1000);
    return () => clearInterval(poll);
  }, [player, isPremium]);

  // Play trackUri when ready
  useEffect(() => {
    const playTrack = async (uri) => {
      if (!token || !deviceId || !uri || !isPremium) return;
      try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uris: [uri] })
        });
        console.log('[DEBUG] Track URI sent to player:', uri);
      } catch (err) {
        console.error('[ERROR] Failed to play track:', err);
      }
    };

    if (deviceId && trackUri && isPremium) {
      playTrack(trackUri);
    }
  }, [deviceId, trackUri, token, isPremium]);

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const Waveform = () => (
    <div className="flex items-end justify-center gap-1 h-8 my-2">
      {[...Array(5)].map((_, i) => (
        <motion.div key={i} animate={{ height: isPaused ? 8 : [8, 32, 8] }} transition={{ duration: 0.7 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }} className="w-1 bg-white rounded" style={{ width: 4 }} />
      ))}
    </div>
  );

  // --- Your return component here (same UI as yours, no changes needed) ---
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/10 border border-white/40 rounded-3xl shadow-xl max-w-md w-[95%] z-50"
    >
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div key="expanded" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="p-4 flex justify-center items-center flex-col">

            <div className="flex justify-between items-center mb-2 w-full">
              <h2 className="text-white text-lg font-semibold">Now Playing</h2>
              <button onClick={() => setIsExpanded(false)}><ChevronDown className="text-white" /></button>
            </div>

            {currentTrack ? (
              <>
                <div className="flex items-center justify-center mb-3 gap-5">
                <img src={currentTrack.albumImage} alt="Album cover" className="rounded-xl w-lwh text-center h-40 object-cover mb-3" />
                <div className="flex flex-col">
                {/* <p className="text-white text-lg text-center">{currentTrack.album}</p> */}
                <p className="text-white text-xl font-bold text-left">{currentTrack.title}</p>
                <p className="text-gray-400 text-sm text-left mb-3">{currentTrack.artists}</p>
                </div>
                </div>
                <Waveform />
                <p className="text-center text-gray-300 text-xs mb-1">{formatTime(position)} / {formatTime(duration)}</p>
              </>
            ) : <div className="h-60 rounded-xl bg-gray-800 mb-3 flex items-center justify-center text-white">No Track</div>}

            {!isPremium && <p className="text-red-500 text-center mb-2 text-sm">Spotify Premium is required to play music in this player.</p>}

            <div className="flex items-center justify-center gap-6 my-4">
              <button disabled={!isPremium} onClick={() => player?.previousTrack()} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                <SkipBack />
              </button>
              <button disabled={!isPremium} onClick={togglePlay} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                {isPaused ? <Play /> : <Pause />}
              </button>
              <button disabled={!isPremium} onClick={() => player?.nextTrack()} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                <SkipForward />
              </button>
            </div>

            <div className="flex items-center justify-center mb-3">
              {volume === 0 ? <VolumeX className="text-white mr-2" /> : volume < 0.6 ? <Volume1 className="text-white mr-2" /> : <Volume2 className="text-white mr-2" />}
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} disabled={!isPremium} className="w-full accent-green-400 mx-2 disabled:opacity-50" />
              <span className="text-gray-300 text-sm">{Math.floor(volume * 100)}%</span>
            </div>

            <div className="mt-4">
              <h3 className="text-gray-300 text-md mb-2 text-center">Playback Devices</h3>
              {devices.map(d => (
                <motion.button key={d.id} whileTap={{ scale: 0.95 }} onClick={() => transferPlayback(d.id)} disabled={!isPremium || d.id === activeDevice} className={`w-full flex items-center gap-2 justify-between rounded-xl py-2 px-3 transition-all ${d.id === activeDevice ? 'bg-green-600 text-black font-semibold' : 'bg-gray-800 hover:bg-gray-700 text-white'} ${!isPremium ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2"><MonitorSpeaker className="w-4 h-4" /><span>{d.name}</span></div>
                  {d.id === activeDevice && <span className="text-xs">Active</span>}
                </motion.button>
              ))}
            </div>

          </motion.div>
        ) : (
          <motion.div key="miniplayer" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              {currentTrack?.albumImage ? <img src={currentTrack.albumImage} alt="" className="w-12 h-12 rounded-lg" /> : <div className="w-12 h-12 rounded-lg bg-gray-800"></div>}
              <div>
                <p className="text-white text-sm">{currentTrack?.title || 'No Track'}</p>
                <p className="text-gray-400 text-xs">{currentTrack?.artists}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button disabled={!isPremium} onClick={togglePlay} className="text-white">{isPaused ? <Play /> : <Pause />}</button>
              <button onClick={() => setIsExpanded(true)}><ChevronUp className="text-white" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
