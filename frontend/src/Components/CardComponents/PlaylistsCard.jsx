import { ExplicitBadge } from "./ExplicitBadge";
import { PlayButton } from "./PlayButton";
import { usePlayer } from "../../contexts/PlayerContext";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, User } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";
import React, { useEffect, useState } from "react";

export const PlaylistCard = ({
    url,
    title,
    spoURL,
    YTURL,
    owner,
    description,
    isPublic,
    trackURI,
}) => {
    const { showPlayer } = usePlayer();
    const [saved, setSaved] = useState(false);

    // Load saved state on mount
    useEffect(() => {
        const savedPlaylists = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
        const isAlreadySaved = savedPlaylists.some(
            (p) => p.title === title && p.owner === owner
        );
        setSaved(isAlreadySaved);
    }, [title, owner]);

    function toggleSave() {
        const savedPlaylists = JSON.parse(localStorage.getItem("savedPlaylists")) || [];

        if (saved) {
            const updated = savedPlaylists.filter(
                (p) => !(p.title === title && p.owner === owner)
            );
            localStorage.setItem("savedPlaylists", JSON.stringify(updated));
            setSaved(false);
        } else {
            const newPlaylist = {
                title,
                owner,
                spoURL,
                YTURL,
                image: url,
                type: "playlist",
                trackURI,
            };
            savedPlaylists.push(newPlaylist);
            localStorage.setItem("savedPlaylists", JSON.stringify(savedPlaylists));
            setSaved(true);
        }
    }

    const handlePlayClick = () => {
        if (trackURI?.startsWith("spotify:")) {
            showPlayer(trackURI, true);
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleClick = (url) => {
        if (url) {
            setTimeout(() => window.open(url, "_blank"), 300);
        }
    };

    const truncatedDesc =
        description?.length > 100 ? description.slice(0, 97) + "..." : description;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-64 bg-gradient-to-br from-orange-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-orange-500/10 transition-all duration-500"
        >
            {/* Controls */}
            <div className="absolute top-0 right-0 flex gap-2 items-center z-10">
                <PlayButton onPlay={handlePlayClick} />
                {saved ? (
                    <BookmarkCheck stroke="white" fill="green" onClick={toggleSave} />
                ) : (
                    <Bookmark stroke="white" onClick={toggleSave} />
                )}
            </div>

            {/* Playlist Cover */}
            <div className="relative overflow-hidden">
                <img
                    src={url}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-xl font-bold text-white truncate" title={title}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <User size={14} />
                        <span>by {owner}</span>
                    </div>
                </div>

                {description && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {truncatedDesc}
                    </p>
                )}

                <p className={isPublic ? "text-green-500" : "text-red-500"}>
                    {isPublic ? "PUBLIC" : "PRIVATE"}
                </p>

        {/* Buttons */}
        <div className="space-y-2 pt-2 flex flex-col">
          <SpotifyButton clickHandle={() => handleClick(spoURL)} />
          <YouTubeButton clickHandle={() => handleClick(YTURL)} />
        </div>
            </div>
        </motion.div>
    );
};
