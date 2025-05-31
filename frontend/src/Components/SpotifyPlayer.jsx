// SpotifyPlayer.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    VolumeX,
    Volume1,
    Volume2,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

export default function SpotifyPlayer() {
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const { visiblePlayer, trackUri, isPremium } = usePlayer();



    const [devices, setDevices] = useState([]);

const fetchPlayerState = async () => {
  try {
    const res = await fetch('https://music-recommender-api.onrender.com/player/state', {
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to fetch player state');
    const data = await res.json();

    if (data?.devices) {
      setDevices(data.devices);
    }

    // Log current devices
    console.log("[DEBUG] Devices fetched:", data.devices);

  } catch (err) {
    console.error("[DEBUG] Error fetching player state:", err);
  }
};



    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('https://music-recommender-api.onrender.com/me', {
                    credentials: 'include',
                });
                setIsAuthenticated(res.ok);
            } catch (err) {
                console.error('[ERROR] Failed to verify session:', err);
                setIsAuthenticated(false);
            }
        };
        checkSession();
    }, []);

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
                getOAuthToken: (cb) => {
                    fetch('https://music-recommender-api.onrender.com/refresh_access_token', {
                        credentials: 'include',
                    })
                        .then((res) => res.json())
                        .then((data) => cb(data.access_token));
                },
                volume: 0.5,
            });

            localPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID:', device_id);
                setDeviceId(device_id);
            });

            localPlayer.addListener('player_state_changed', (state) => {
                if (!state) return;
                const track = state.track_window.current_track;
                setIsPaused(state.paused);
                setCurrentTrack({
                    title: track.name,
                    artists: track.artists.map((a) => a.name).join(', '),
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
            player.getCurrentState().then((state) => {
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
                    body: JSON.stringify({ device_id: deviceId, uris: [uri] }),
                });
                console.log('[DEBUG] Track URI sent to player:', uri);
            } catch (err) {
                console.error('[ERROR] Failed to play track:', err);
            }
        };
        if (deviceId && trackUri && isPremium) playTrack(trackUri);
    }, [deviceId, trackUri, isPremium]);

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

    const formatTime = (ms) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };


    useEffect(() => {
        const fetchPlayerState = async () => {
            try {
                const res = await fetch('https://music-recommender-api.onrender.com/player/state', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsPaused(!data.is_playing);
                    setPosition(data.progress_ms);
                    setDuration(data.item.duration_ms);
                    setCurrentTrack({
                        title: data.item.name,
                        artists: data.item.artists.map((a) => a.name).join(', '),
                        albumImage: data.item.album.images[0]?.url,
                    });
                    setVolume(data.device.volume_percent / 100);
                }
            } catch (err) {
                console.error('[ERROR] Failed to fetch player state:', err);
            }
        };

        if (isPremium) {
            // Fetch initial state
            fetchPlayerState();
            
        }
    }, [isPremium]); // run again if isPremium changes
    useEffect(() => {
        if (!player || !isPremium) return;
    
        const poll = setInterval(async () => {
            const state = await player.getCurrentState();
            if (state) {
                const track = state.track_window.current_track;
                setIsPaused(state.paused);
                setPosition(state.position);
                setDuration(state.duration);
                setCurrentTrack({
                    title: track.name,
                    artists: track.artists.map((a) => a.name).join(', '),
                    albumImage: track.album.images[0]?.url,
                });
            }
        }, 1000);
    
        return () => clearInterval(poll);
    }, [player, isPremium]);





    if (!visiblePlayer || !isAuthenticated) return null;

    return (
<AnimatePresence mode="wait">
    {isExpanded ? (
        <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/10 border border-white/40 rounded-3xl shadow-xl max-w-md w-[95%] z-50"
        >
            <div className="p-4 flex justify-center items-center flex-col w-full h-full">
                <div className="flex justify-between items-center mb-2 w-full h-full">
                    <h2 className="text-white text-lg font-semibold">Now Playing</h2>
                    <button onClick={() => setIsExpanded(false)}>
                        <ChevronDown className="text-white" />
                    </button>
                </div>

                {currentTrack && (
                    <>
                        <div className="flex items-center justify-center mb-3 gap-5">
                            <img
                                src={currentTrack.albumImage}
                                alt="Album cover"
                                className="rounded-xl w-40 h-40 object-cover mb-3"
                            />
                            <div className="flex flex-col text-left">
                                <p className="text-white text-xl font-bold">
                                    {currentTrack.title}
                                </p>
                                <p className="text-gray-400 text-sm mb-3">
                                    {currentTrack.artists}
                                </p>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={position}
                            onChange={handleSeek}
                            disabled={!isPremium}
                            className="w-full accent-[#D50000] disabled:opacity-50 mb-2"
                        />
                        <p className="text-center text-gray-300 text-xs mb-1">
                            {formatTime(position)} / {formatTime(duration)}
                        </p>

                        <div className="flex items-center justify-center gap-6 my-4">
                            <button
                                disabled={!isPremium}
                                onClick={() => player?.previousTrack()}
                                className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}
                            >
                                <SkipBack fill="#000" stroke="#000" />
                            </button>
                            <button
                                disabled={!isPremium}
                                onClick={togglePlay}
                                className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}
                            >
                                {isPaused ? <Play /> : <Pause />}
                            </button>
                            <button
                                disabled={!isPremium}
                                onClick={() => player?.nextTrack()}
                                className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}
                            >
                                <SkipForward fill="#000" stroke="#000" />
                            </button>
                        </div>

                        <div className="flex items-center justify-center mb-3">
                            {volume === 0 ? (
                                <VolumeX className="text-white mr-2" />
                            ) : volume < 0.6 ? (
                                <Volume1 className="text-white mr-2" />
                            ) : (
                                <Volume2 className="text-white mr-2" />
                            )}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                disabled={!isPremium}
                                className="w-full accent-green-400 mx-2 disabled:opacity-50"
                            />
                            <span className="text-gray-300 text-sm">
                                {Math.floor(volume * 100)}%
                            </span>
                            <ul>
  {devices.map((device) => (
    <li key={device.id}>
      {device.name} {device.is_active ? "(Active)" : ""}
    </li>
  ))}
</ul>

                        </div>
                    </>
                )}
            </div>
        </motion.div>
    ) : (
        <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/10 border border-white/40 rounded-3xl shadow-xl max-w-md w-[95%] z-50 p-3 flex items-center justify-between"
        >
            {currentTrack && (
                <>
                    <img
                        src={currentTrack.albumImage}
                        alt="Album"
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="ml-3">
                        <p className="text-white text-sm font-medium">
                            {currentTrack.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                            {currentTrack.artists}
                        </p>
                    </div>
                </>
            )}
            <div className="ml-auto flex items-center space-x-4">
                <button
                    onClick={togglePlay}
                    disabled={!isPremium}
                    className={`rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition ${!isPremium ? 'bg-gray-600' : 'bg-white text-black hover:scale-105 active:scale-90'}`}
                >
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button onClick={() => setIsExpanded(true)}>
                    <ChevronUp className="text-white" />
                </button>
            </div>
        </motion.div>
    )}
</AnimatePresence>

    );
}
