import { PlayButton } from "./PlayButton";
import { usePlayer } from "../../contexts/PlayerContext";
import { MoreVertical, Bookmark } from "lucide-react";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export const AlbumTrackCard = ({
    title,
    artist,
    spoURL,
    YTURL,
    trackURI,
    trackID,
    pos,
}) => {
    const { showPlayer } = usePlayer();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:")) {
            showPlayer(trackURI, true, { position: pos });
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };

    const handleSave = () => {
        console.log("Saved", title);
        // Your save logic here
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 rounded-xl w-full min-w-0">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                <div className="flex-shrink-0">
                    <PlayButton onPlay={handlePlayClick} />
                </div>
                
                {/* Title & Artist - with proper overflow handling */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3
                        className="text-sm font-semibold text-white truncate cursor-pointer hover:underline leading-tight"
                        title={title}
                        onClick={() => navigate(`/track/${trackID}`)}
                    >
                        {title}
                    </h3>
                    <div className="text-xs text-gray-300 truncate">
                        {artist.map((a, i) => (
                            <span key={a.id}>
                                <span
                                    className="hover:underline cursor-pointer"
                                    onClick={() => navigate(`/artist/${a.id}`)}
                                    title={a.name}
                                >
                                    {a.name}
                                </span>
                                {i < artist.length - 1 && ", "}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <img 
                        src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                        className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => handleClick(spoURL)}
                        alt="Spotify"
                    />
                    <FontAwesomeIcon 
                        icon={faYoutube} 
                        className="text-2xl cursor-pointer text-red-500 hover:text-red-400 transition-colors" 
                        onClick={() => handleClick(YTURL)} 
                    />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden relative" ref={menuRef}>
                    <MoreVertical
                        size={20}
                        className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg w-44 p-2 space-y-1 text-sm">
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(spoURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <img 
                                    src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                                    className="w-4 h-4" 
                                    alt="Spotify"
                                />
                                Open in Spotify
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(YTURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 text-red-500" />
                                Open on YouTube
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleSave();
                                    setMenuOpen(false);
                                }}
                            >
                                <Bookmark size={16} />
                                Save Track
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ArtistTrackCard = ({
    title,
    album,
    coverImage,
    spoURL,
    YTURL,
    trackURI,
    trackID,
    pos,
    duration,
}) => {
    const { showPlayer } = usePlayer();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:")) {
            showPlayer(trackURI, true, { position: pos });
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };

    const handleSave = () => {
        console.log("Saved", title);
        // Your save logic here
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 rounded-xl w-full min-w-0">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                {/* Album Cover */}
                <div className="flex-shrink-0 relative group">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        onError={(e) => {
                            e.target.src = '/default-cover.png'; // Fallback image
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <PlayButton onPlay={handlePlayClick} size="small" />
                    </div>
                </div>
                
                {/* Title & Album */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3
                        className="text-sm font-semibold text-white truncate cursor-pointer hover:underline leading-tight"
                        title={title}
                        onClick={() => navigate(`/track/${trackID}`)}
                    >
                        {title}
                    </h3>
                    <div className="text-xs text-gray-300 truncate">
                        {/* <span
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate(`/album/${album.id}`)}
                            title={album.name}
                        >
                            {album.name}
                        </span> */}
                    </div>
                </div>

                {/* Duration - visible on larger screens */}
                {duration && (
                    <div className="hidden md:block flex-shrink-0 text-xs text-gray-400">
                        {duration}
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <img 
                        src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                        className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => handleClick(spoURL)}
                        alt="Spotify"
                    />
                    <FontAwesomeIcon 
                        icon={faYoutube} 
                        className="text-2xl cursor-pointer text-red-500 hover:text-red-400 transition-colors" 
                        onClick={() => handleClick(YTURL)} 
                    />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden relative" ref={menuRef}>
                    <MoreVertical
                        size={20}
                        className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg w-44 p-2 space-y-1 text-sm">
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(spoURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <img 
                                    src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                                    className="w-4 h-4" 
                                    alt="Spotify"
                                />
                                Open in Spotify
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(YTURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 text-red-500" />
                                Open on YouTube
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleSave();
                                    setMenuOpen(false);
                                }}
                            >
                                <Bookmark size={16} />
                                Save Track
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const PlaylistTrackCard = ({
    title,
    artist,
    album,
    coverImage,
    spoURL,
    YTURL,
    trackURI,
    trackID,
    pos,
    duration,
    addedAt, // When track was added to playlist
}) => {
    const { showPlayer } = usePlayer();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:")) {
            showPlayer(trackURI, true, { position: pos });
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };

    const handleSave = () => {
        console.log("Saved", title);
        // Your save logic here
    };

    const handleRemoveFromPlaylist = () => {
        console.log("Remove from playlist", title);
        // Your remove logic here
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 rounded-xl w-full min-w-0">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                {/* Album Cover */}
                <div className="flex-shrink-0 relative group">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        onError={(e) => {
                            e.target.src = '/default-cover.png'; // Fallback image
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <PlayButton onPlay={handlePlayClick} size="small" />
                    </div>
                </div>
                
                {/* Title & Artist */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3
                        className="text-sm font-semibold text-white truncate cursor-pointer hover:underline leading-tight"
                        title={title}
                        onClick={() => navigate(`/track/${trackID}`)}
                    >
                        {title}
                    </h3>
                    <div className="text-xs text-gray-300 truncate">
                        {artist.map((a, i) => (
                            <span key={a.id}>
                                <span
                                    className="hover:underline cursor-pointer"
                                    onClick={() => navigate(`/artist/${a.id}`)}
                                    title={a.name}
                                >
                                    {a.name}
                                </span>
                                {i < artist.length - 1 && ", "}
                            </span>
                        ))}
                        {album && (
                            <>
                                <span className="mx-1">•</span>
                                <span
                                    className="hover:underline cursor-pointer"
                                    onClick={() => navigate(`/album/${album.id}`)}
                                    title={album.name}
                                >
                                    {album.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Duration and Added Date - visible on larger screens */}
                <div className="hidden lg:flex flex-col items-end gap-1 flex-shrink-0 text-xs text-gray-400">
                    {addedAt && <span>{addedAt}</span>}
                    {duration && <span>{duration}</span>}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    <img 
                        src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                        className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={() => handleClick(spoURL)}
                        alt="Spotify"
                    />
                    <FontAwesomeIcon 
                        icon={faYoutube} 
                        className="text-2xl cursor-pointer text-red-500 hover:text-red-400 transition-colors" 
                        onClick={() => handleClick(YTURL)} 
                    />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden relative" ref={menuRef}>
                    <MoreVertical
                        size={20}
                        className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg w-48 p-2 space-y-1 text-sm">
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(spoURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <img 
                                    src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                                    className="w-4 h-4" 
                                    alt="Spotify"
                                />
                                Open in Spotify
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleClick(YTURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 text-red-500" />
                                Open on YouTube
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleSave();
                                    setMenuOpen(false);
                                }}
                            >
                                <Bookmark size={16} />
                                Save Track
                            </div>
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleRemoveFromPlaylist();
                                    setMenuOpen(false);
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove from Playlist
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const SmallTrackCardWithCover = ({
    title,
    artist,
    coverImage,
    spoURL,
    YTURL,
    trackURI,
    trackID,
    pos,
    subtitle, // For playlist description or additional info
}) => {
    const { showPlayer } = usePlayer();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:")) {
            showPlayer(trackURI, true, { position: pos });
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };

    const handleSave = () => {
        console.log("Saved", title);
        // Your save logic here
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 rounded-xl w-full min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* Album/Playlist Cover */}
                <div className="flex-shrink-0 relative group">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                        onError={(e) => {
                            e.target.src = '/default-cover.png'; // Fallback image
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <PlayButton onPlay={handlePlayClick} size="small" />
                    </div>
                </div>
                
                {/* Title & Artist/Subtitle */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3
                        className="text-sm sm:text-base font-semibold text-white truncate cursor-pointer hover:underline leading-tight"
                        title={title}
                        onClick={() => navigate(`/track/${trackID}`)}
                    >
                        {title}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-300 truncate">
                        {subtitle ? (
                            <span title={subtitle}>{subtitle}</span>
                        ) : (
                            artist?.map((a, i) => (
                                <span key={a.id}>
                                    <span
                                        className="hover:underline cursor-pointer"
                                        onClick={() => navigate(`/artist/${a.id}`)}
                                        title={a.name}
                                    >
                                        {a.name}
                                    </span>
                                    {i < artist.length - 1 && ", "}
                                </span>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                    {spoURL && (
                        <img 
                            src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                            className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity" 
                            onClick={() => handleClick(spoURL)}
                            alt="Spotify"
                        />
                    )}
                    {YTURL && (
                        <FontAwesomeIcon 
                            icon={faYoutube} 
                            className="text-2xl cursor-pointer text-red-500 hover:text-red-400 transition-colors" 
                            onClick={() => handleClick(YTURL)} 
                        />
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden relative" ref={menuRef}>
                    <MoreVertical
                        size={20}
                        className="cursor-pointer text-white hover:text-gray-300 transition-colors"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg w-44 p-2 space-y-1 text-sm">
                            {spoURL && (
                                <div
                                    className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                    onClick={() => {
                                        handleClick(spoURL);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <img 
                                        src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" 
                                        className="w-4 h-4" 
                                        alt="Spotify"
                                    />
                                    Open in Spotify
                                </div>
                            )}
                            {YTURL && (
                                <div
                                    className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                    onClick={() => {
                                        handleClick(YTURL);
                                        setMenuOpen(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faYoutube} className="w-4 h-4 text-red-500" />
                                    Open on YouTube
                                </div>
                            )}
                            <div
                                className="flex items-center gap-3 text-white hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors"
                                onClick={() => {
                                    handleSave();
                                    setMenuOpen(false);
                                }}
                            >
                                <Bookmark size={16} />
                                Save Track
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};