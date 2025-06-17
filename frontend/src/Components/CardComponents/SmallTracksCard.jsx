import { PlayButton } from "./PlayButton";
import { usePlayer } from "../../contexts/PlayerContext";
import { MoreVertical, Bookmark } from "lucide-react";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
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

    return (
        <div className="flex items-center justify-between px-4 py-2 border border-gray-700 hover:bg-gray-800 transition-colors duration-300 rounded-xl w-full relative">
            <div className="flex flex-row gap-5">

                <div>
                    <PlayButton onPlay={handlePlayClick} />
                </div>
                {/* Title & Artist */}
                <div className="flex flex-col gap-1 max-w-[70%]">
                    <h3
                        className="text-sm font-semibold text-white truncate cursor-pointer hover:underline"
                        title={title}
                        onClick={() => navigate(`/track/${trackID}`)}
                    >
                        {title}
                    </h3>
                    <div className="text-xs text-gray-300 flex flex-wrap gap-x-1">
                        {artist.map((a, i) => (
                            <span
                                key={a.id}
                                className="hover:underline cursor-pointer"
                                onClick={() => navigate(`/artist/${a.id}`)}
                                title={a.name}
                            >
                                {a.name}
                                {i < artist.length - 1 && ","}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">

                {/* Desktop Buttons */}
                <div className="hidden sm:flex sm:flex-row items-center gap-5">
                    <img src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" className="w-8 cursor-pointer text-green-400" onClick={() => handleClick(spoURL)} />
                    <FontAwesomeIcon icon={faYoutube} className="text-3xl cursor-pointer text-red-500" onClick={() => handleClick(YTURL)} />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden relative">
                    <MoreVertical
                        size={20}
                        className="cursor-pointer text-white"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    />

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg w-40 p-2 space-y-2 text-sm">
                            <div
                                className="flex items-center gap-2 text-white hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    handleClick(spoURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <img src="/2024-spotify-logo-icon/Primary_Logo_Green_RGB.svg" className=" w-5 cursor-pointer text-green-400" onClick={() => handleClick(spoURL)} />
                                Open in Spotify
                            </div>
                            <div
                                className="flex items-center gap-2 text-white hover:text-red-400 cursor-pointer"
                                onClick={() => {
                                    handleClick(YTURL);
                                    setMenuOpen(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faYoutube} size={16} />
                                Open on YouTube
                            </div>
                            <div
                                className="flex items-center gap-2 text-white hover:text-yellow-400 cursor-pointer"
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
