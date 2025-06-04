// SpotifyPlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import SpotifyDevices from './SpotifyDevices';
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
    // At the top level of your component or context
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolume] = useState(1); // default volume = 100%
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { visiblePlayer, trackUri, isPremium } = usePlayer();
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isExpanded]);

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

        if (playerRef.current) {
            setPlayer(playerRef.current);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const localPlayer = new window.Spotify.Player({
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
                // console.log('Ready with Device ID:', device_id);
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
            playerRef.current = localPlayer;
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.disconnect();
                playerRef.current = null;
            }
        };
    }, [isPremium, isAuthenticated]);

    useEffect(() => {
        const playTrack = async (uriOrUris, isContext = false) => {
            if (!deviceId || !uriOrUris || !isPremium) return;

            try {
                await fetch('https://music-recommender-api.onrender.com/player/play', {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        device_id: deviceId,
                        ...(isContext
                            ? { context_uri: uriOrUris } // e.g. spotify:album:xxx or spotify:playlist:xxx
                            : { uris: Array.isArray(uriOrUris) ? uriOrUris : [uriOrUris] })
                    }),
                });
            } catch (err) {
                console.error('[ERROR] Failed to play track(s):', err);
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
        let intervalId;
        let animationFrameId;
        let localProgress = 0;

        const fetchPlayerState = async () => {
            try {
                const res = await fetch('https://music-recommender-api.onrender.com/player/state', {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();


                    const newTrack = {
                        title: data.item.name,
                        artists: data.item.artists.map((a) => a.name).join(', '),
                        albumImage: data.item.album.images[0]?.url,
                    };

                    setIsPaused(!data.is_playing);
                    setCurrentTrack(newTrack);
                    setDuration(data.item.duration_ms);
                    setPosition(data.progress_ms);
                    localProgress = data.progress_ms;
                    setVolume(data.device.volume_percent / 100);


                }
            } catch (err) {
                console.error('[ERROR] Failed to fetch player state:', err);
            }
        };

        if (isPremium) {
            fetchPlayerState();
            intervalId = setInterval(fetchPlayerState, 8000); // every 8s
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPremium]);

    useEffect(() => {
        if (!currentTrack) return;

        // Set document title to the current track's name
        document.title = `${currentTrack.title} — ${currentTrack.artists}`;

        // Change favicon to album image
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = currentTrack.albumImage;

        document.head.appendChild(favicon);

        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artists,
                // album: "Album Name (optional)",
                artwork: [
                    { src: currentTrack.albumImage, sizes: "512x512", type: "image/png" }
                ]
            });
        }


        // Optional: Clean up on unmount
        return () => {
            document.title = 'GrooveEstrella Music Recommender'; // Or your default app title
            if (favicon) {
                favicon.href = '/favicon.ico'; // Reset to default favicon
            }
        };
    }, [currentTrack]);


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
                    className="fixed inset-0 sm:bottom-20 sm:left-1/2 sm:-translate-x-1/2 sm:w-[95%] sm:max-w-md backdrop-blur-md bg-[#121212]/90 border border-white/20 rounded-none sm:rounded-3xl shadow-xl z-[150] scrollb-none"
                >
                    <div className="p-5 pt-6 pb-10 flex flex-col items-center w-full space-y-5 overflow-y-auto max-h-[90vh] scrollb-none">
                        {/* Header */}
                        <div className="flex justify-between items-center w-full m-0">
                            <h2 className="text-white text-base font-semibold">Now Playing</h2>
                            <button onClick={() => setIsExpanded(false)}>
                                <ChevronDown className="text-white" />
                            </button>
                        </div>
                        {/* Spotify branding */}
                        <div className="w-auto pb-3 text-center text-xs m-0 text-gray-400">
                            <img
                                src="/2024-spotify-full-logo/Full_Logo_White_CMYK.svg"
                                alt="Spotify"
                                className="mx-auto w-32"
                            />
                            <p className="mt-1">Powered by Spotify</p>
                        </div>

                        {/* Track info */}
                        {currentTrack && (
                            <>
                                <img
                                    src={currentTrack.albumImage}
                                    alt="Album cover"
                                    className="rounded-xl w-84 h-84 md:w-64 md:h-64 object-cover"
                                />
                                <div className="w-full text-left px-2 space-y-1">
                                    <p className="text-white text-2xl font-bold truncate">
                                        {currentTrack.title}
                                    </p>
                                    <p className="text-gray-400 text-sm truncate">
                                        {currentTrack.artists}
                                    </p>
                                </div>

                                {/* Seek bar */}
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={position}
                                    onChange={handleSeek}
                                    disabled={!isPremium}
                                    className="w-full accent-green-500 disabled:opacity-50 mb-0"
                                />
                                <div className='w-full flex justify-between items-center mb-0'>
                                    <p className="text-gray-400 text-xs tracking-wide text-center">
                                        {formatTime(position)}
                                    </p>
                                    <p className="text-gray-400 text-xs tracking-wide text-center">
                                        {formatTime(duration)}
                                    </p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-6 m-0 mb-2">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.1 }}
                                        disabled={!isPremium}
                                        onClick={() => player?.previousTrack()}
                                        className={`rounded-full w-12 h-12 flex items-center justify-center transition shadow-md ${!isPremium
                                            ? 'bg-gray-700'
                                            : 'text-white'
                                            }`}
                                    >
                                        <SkipBack size={32} fill='white' />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.05 }}
                                        disabled={!isPremium}
                                        onClick={togglePlay}
                                        className={`rounded-full w-16 h-16 flex items-center justify-center transition shadow-md ${!isPremium
                                            ? 'bg-gray-700'
                                            : 'bg-white text-black'
                                            }`}
                                    >
                                        {isPaused ? <Play size={28} /> : <Pause size={28} />}
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.1 }}
                                        disabled={!isPremium}
                                        onClick={() => player?.nextTrack()}
                                        className={`rounded-full w-12 h-12 flex items-center justify-center transition shadow-md ${!isPremium
                                            ? 'bg-gray-700'
                                            : 'text-white'
                                            }`}
                                    >
                                        <SkipForward size={32} fill='white' />
                                    </motion.button>
                                </div>

                                {/* Volume */}
                                <div className="flex items-center w-full gap-3 px-2 mt-3">
                                    {volume === 0 ? (
                                        <VolumeX className="text-white" />
                                    ) : volume < 0.6 ? (
                                        <Volume1 className="text-white" />
                                    ) : (
                                        <Volume2 className="text-white" />
                                    )}
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        disabled={!isPremium}
                                        className="w-full accent-green-400 disabled:opacity-50"
                                    />
                                    <span className="text-gray-400 text-xs">
                                        {Math.floor(volume * 100)}%
                                    </span>
                                </div>

                                {/* Devices */}
                                <div className="w-full text-left px-2 mt-3">
                                    <div>
                                        {/* ...player UI */}
                                        <SpotifyDevices isPremium={isPremium} />
                                    </div>

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
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 backdrop-blur-md bg-[#121212]/90 border border-white/20 rounded-3xl shadow-lg max-w-md w-[95%] z-[100] px-4 py-3 flex items-center justify-between"
                >
                    {currentTrack && (
                        <>
                            <img
                                src={currentTrack.albumImage}
                                alt="Album"
                                className="w-10 h-10 rounded-md object-cover"
                            />
                            <div className="ml-3 flex-1 truncate">
                                <p className="text-white text-sm font-medium truncate">
                                    {currentTrack.title}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {currentTrack.artists}
                                </p>
                            </div>
                        </>
                    )}
                    <div className="ml-4 flex items-center space-x-3">
                        <motion.button
                        whileTap={{ scale: 1.1 }}
                        whileHover={{ scale: 0.95 }}
                            onClick={togglePlay}
                            disabled={!isPremium}
                            className={`rounded-full w-9 h-9 flex items-center justify-center shadow-md transition ${!isPremium
                                ? 'bg-gray-700'
                                : 'text-black bg-white'
                                }`}
                        >
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                        </motion.button>
                        <button onClick={() => setIsExpanded(true)}>
                            <ChevronUp className="text-white" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>


    );
}
