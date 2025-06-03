import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Users, Award } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";
import { useNavigate } from "react-router-dom";

export const ArtistCard = ({
    url,
    title,
    spoURL,
    YTURL,
    popularity,
    followers,
    id
}) => {

    const navigate = useNavigate();

const handleCardClick = () => {
    navigate(`/artist/${id}`);
};

    const [saved, setSaved] = useState(false);

    function toggleSave() {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];

        if (saved) {
            // REMOVE the song
            const updated = savedSongs.filter(song => !(song.title === title && song.artist === artist));
            localStorage.setItem("savedSongs", JSON.stringify(updated));
            setSaved(false);
        } else {
            // ADD the song
            const newSong = {
                title,
                artist,
                spoURL,
                YTURL,
                image: url,
                popularity,
                explicit,
                trackURI,
                id,
            };
            savedSongs.push(newSong);
            localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
            setSaved(true);
        }
    }

    const handleSave = () => {
        toggleSave({
            title,
            artist,
            spoURL,
            YTURL,
            image: url,
            popularity,
            explicit,
            type: "track",
            trackURI,
            id,
        });
    };


    const handleClick = (url) => {
        setTimeout(() => window.open(url, "_blank"), 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-72 bg-gradient-to-br from-purple-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
            onClick={handleCardClick}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10">
                {saved ? <BookmarkCheck stroke="white" fill="green" onClick={handleSave} /> : <Bookmark stroke="white" onClick={handleSave} />}
            </div>

            <div className="p-6">
                {/* Artist Image */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={url}
                            alt={title}
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500/30 transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-purple-600/20 to-transparent" />
                    </div>
                </div>

                {/* Artist Info */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white" title={title}>
                        {title}
                    </h2>

                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <Users size={18} />
                        <span>{followers?.toLocaleString()} Followers</span>
                    </div>

                    {/* Popularity */}
                    <div className={`flex items-center justify-center gap-2 ${popularity >= 80 ? "text-green-400" : "text-yellow-400"}`}>
                        <Award size={18} />
                        <span>Popularity: {popularity}</span>
                        {popularity >= 80 && <span title="Trending">🔥</span>}
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2 pt-2 flex flex-col">
                        <SpotifyButton clickHandle={() => handleClick(spoURL)} />
                        <YouTubeButton clickHandle={() => handleClick(YTURL)} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};