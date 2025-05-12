// SpotifyPlayer.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume1, Volume2, MonitorSpeaker, ChevronUp, ChevronDown } from "lucide-react";
import { usePlayer } from '../contexts/PlayerContext';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { visiblePlayer, trackUri, isPremium } = usePlayer();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('https://music-recommender-api.onrender.com/me', { credentials: 'include' });
        setIsAuthenticated(res.ok);
      } catch (err) {
        console.error('[ERROR] Failed to verify session:', err);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  const fetchDevices = async () => {
    const res = await fetch('https://music-recommender-api.onrender.com/player/devices', { credentials: 'include' });
    const data = await res.json();
    setDevices(data.devices);
    const active = data.devices.find(d => d.is_active);
    setActiveDevice(active ? active.id : null);
  };

  const transferPlayback = async (targetDeviceId) => {
    await fetch('https://music-recommender-api.onrender.com/player/transfer', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: targetDeviceId })
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

  const handleSeek = (e) => {
    const newPos = parseFloat(e.target.value);
    setPosition(newPos);
    if (player && isPremium) player.seek(newPos);
  };

  useEffect(() => {
    if (!isPremium || !isAuthenticated) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    let localPlayer = null;
    window.onSpotifyWebPlaybackSDKReady = () => {
      localPlayer = new window.Spotify.Player({
        name: 'Harmony Web Player',
        getOAuthToken: cb => {
          fetch('https://music-recommender-api.onrender.com/refresh_access_token', { credentials: 'include' })
            .then(res => res.json())
            .then(data => cb(data.access_token));
        },
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
  }, [isPremium, isAuthenticated]);

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

  useEffect(() => {
    const playTrack = async (uri) => {
      if (!deviceId || !uri || !isPremium) return;
      try {
        await fetch('https://music-recommender-api.onrender.com/player/play', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id: deviceId, uris: [uri] })
        });
        console.log('[DEBUG] Track URI sent to player:', uri);
      } catch (err) {
        console.error('[ERROR] Failed to play track:', err);
      }
    };

    if (deviceId && trackUri && isPremium) {
      playTrack(trackUri);
    }
  }, [deviceId, trackUri, isPremium]);

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!visiblePlayer || !isAuthenticated) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="fixed bottom-20 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/10 border border-white/40 rounded-3xl shadow-xl max-w-md w-[95%] z-50">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div key="expanded" initial={{ height: 0, scale: 0 }} animate={{ height: 'auto', scale: 1 }} exit={{ height: 0, scale: 0 }} transition={{ duration: 0.25 }} className="p-4 flex justify-center items-center flex-col">

            <div className="flex justify-between items-center mb-2 w-full">
              <h2 className="text-white text-lg font-semibold">Now Playing</h2>
              <button onClick={() => setIsExpanded(false)}><ChevronDown className="text-white" /></button>
            </div>

            {currentTrack ? (
              <>
                <motion.div transition={{duration: 0.3}} className="flex items-center justify-center mb-3 gap-5">
                  <img src={currentTrack.albumImage} alt="Album cover" className="rounded-xl w-40 h-40 object-cover mb-3" />
                  <div className="flex flex-col text-left">
                    <p className="text-white text-xl font-bold">{currentTrack.title}</p>
                    <p className="text-gray-400 text-sm mb-3">{currentTrack.artists}</p>
                  </div>
                </motion.div>
                <input type="range" min="0" max={duration} value={position} onChange={handleSeek} disabled={!isPremium} className="w-full accent-[#D50000] disabled:opacity-50 mb-2" />
                <p className="text-center text-gray-300 text-xs mb-1">{formatTime(position)} / {formatTime(duration)}</p>

                <div className="flex items-center justify-center gap-6 my-4">
                  <button disabled={!isPremium} onClick={() => player?.previousTrack()} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                    <SkipBack fill='#000' stroke='#000' />
                  </button>
                  <button disabled={!isPremium} onClick={togglePlay} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                    {isPaused ? <Play fill='' /> : <Pause fill='' />}
                  </button>
                  <button disabled={!isPremium} onClick={() => player?.nextTrack()} className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}>
                    <SkipForward fill='#000' stroke='#000' />
                  </button>
                </div>

                <div className="flex items-center justify-center mb-3">
                  {volume === 0 ? <VolumeX className="text-white mr-2" /> : volume < 0.6 ? <Volume1 className="text-white mr-2" /> : <Volume2 className="text-white mr-2" />}
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} disabled={!isPremium} className="w-full accent-green-400 mx-2 disabled:opacity-50" />
                  <span className="text-gray-300 text-sm">{Math.floor(volume * 100)}%</span>
                </div>

                <div className="mt-4 w-full">
                  <h3 className="text-gray-300 text-md mb-2 text-center">Playback Device</h3>
                  <select value={activeDevice || ''} onChange={(e) => transferPlayback(e.target.value)} disabled={!isPremium} className="w-full rounded-xl p-2 bg-gray-800 text-white text-sm">
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>{d.name}{d.id === activeDevice ? ' (Active)' : ''}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : <div className="h-60 rounded-xl bg-gray-800 mb-3 flex items-center justify-center text-white">No Track</div>}

            {!isPremium && <p className="text-red-500 text-center mt-2 text-sm">Spotify Premium required to control playback</p>}

          </motion.div>
        ) : (
          <motion.div key="miniplayer" initial={{ height: 0, scale: 0 }} animate={{ height: 'auto', scale: 1 }} exit={{ height: 0, scale: 0 }} transition={{ duration: 0.45 }} className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              {currentTrack?.albumImage ? <img src={currentTrack.albumImage} alt="" className="w-12 h-12 rounded-lg" /> : <div className="w-12 h-12 rounded-lg bg-gray-800"></div>}
              <motion.div transition={{duration: 0.3}}>
                <p className="text-white text-sm">{currentTrack?.title || 'No Track'}</p>
                <p className="text-gray-400 text-xs">{currentTrack?.artists}</p>
              </motion.div>
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
