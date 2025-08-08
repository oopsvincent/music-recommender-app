import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Users, Award } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../contexts/PlayerContext";
import { PlayButton } from "./PlayButton";

export const ArtistCard = ({
    url,
    artist,
    spoURL,
    YTURL,
    popularity,
    followers,
    id,
    URI,
}) => {
    console.log(artist);

    const navigate = useNavigate();
    const { showPlayer } = usePlayer();

    const [saved, setSaved] = useState(false);

    // Check localStorage on mount
    useEffect(() => {
        const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];
        const isSaved = savedArtists.some(a => a.id === id); // ✅ match directly on ID prop
        setSaved(isSaved);
    }, [id]);



const toggleSave = () => {
    const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];

    if (saved) {
        const updated = savedArtists.filter((a) => a.id !== id);
        localStorage.setItem("savedArtists", JSON.stringify(updated));
        setSaved(false);
    } else {
        const newArtist = {
            id,
            artist,   // string like "Adele"
            spoURL,
            YTURL,
            image: url,
            followers,
            popularity,
            uri: URI,
        };

        savedArtists.push(newArtist);
        localStorage.setItem("savedArtists", JSON.stringify(savedArtists));
        setSaved(true);
    }
};


    const handleSave = () => {
        toggleSave();
    };

    const handleClick = (url) => {
        if (url) window.open(url, "_blank");
    };

    const handleCardClick = (e) => {
        // Prevent conflict when clicking save button
        if (e.target.closest(".noskip")) return;
        navigate(`/artist/${id}`);
    };

    const handlePlayClick = () => {
        if (URI?.startsWith("spotify:artist:")) {
            showPlayer(URI, true); // context_uri mode
        } else {
            console.warn("[ArtistCard] Invalid album URI:", URI);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardClick}
            className="relative w-72 bg-gradient-to-br from-purple-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
        >
            {/* Save Icon */}
            <div className="absolute top-4 right-4 z-10 noskip cursor-pointer">
                {saved ? (
                    <BookmarkCheck stroke="white" fill="green" onClick={handleSave} />
                ) : (
                    <Bookmark stroke="white" onClick={handleSave} />
                )}
            </div>

            <div className="absolute top-5 left-5 flex gap-2 items-center z-10 noskip">
                <PlayButton onPlay={handlePlayClick} />
            </div>

            <div className="p-6">
                {/* Artist Image */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={url}
                            alt={artist}
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500/30 transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-purple-600/20 to-transparent" />
                    </div>
                </div>

                {/* Info */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white" title={artist}>
                        {artist}
                    </h2>

                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <Users size={18} />
                        <span>{followers?.toLocaleString()} Followers</span>
                    </div>

                    <div
                        className={`flex items-center justify-center gap-2 ${popularity >= 80 ? "text-green-400" : "text-yellow-400"
                            }`}
                    >
                        <Award size={18} />
                        <span>Popularity: {popularity}</span>
                        {popularity >= 80 && <span title="Trending">🔥</span>}
                    </div>


                    <div className="space-y-2 pt-2 flex flex-col noskip">
                        <SpotifyButton clickHandle={() => handleClick(spoURL)} />
                        <YouTubeButton clickHandle={() => handleClick(`https://www.youtube.com/results?search_query=${artist}`)} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
