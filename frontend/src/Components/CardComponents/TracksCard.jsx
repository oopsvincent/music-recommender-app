import { ExplicitBadge } from "./ExplicitBadge";
import { PlayButton } from "./PlayButton";
import { usePlayer } from "../../contexts/PlayerContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Award, CirclePlay } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";

export const TrackCard = ({
    url,
    title,
    artist,
    spoURL,
    popularity,
    explicit,
    trackURI,
    albumID,
}) => {
    const { showPlayer } = usePlayer();
    const [saved, setSaved] = useState(false);


    console.log(artist);


    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
        const isSaved = savedSongs.some(
            (album) => album.trackURI === trackURI
        );
        setSaved(isSaved);
    }, [title, artist]);

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
                artist: artist,
                spoURL,
                image: url,
                popularity,
                explicit,
                trackURI,
            };
            savedSongs.push(newSong);
            localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
            setSaved(true);
        }
    }

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:track:")) {
            showPlayer(trackURI, false); // ⬅️ Explicitly mark as non-context
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };


    const handleSave = () => {
        toggleSave({
            title,
            artist: artist,
            spoURL,
            image: url,
            popularity,
            explicit,
            type: "track",
            trackURI,
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
            className="relative w-72 bg-gradient-to-br from-gray-900/80 to-black/10 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
        >

            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={url}
                    alt={title}
                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>

                    <div className="relative w-full h-full">
                        <div className="absolute top-15 right-3">
                            {explicit && <ExplicitBadge />}
                        </div>
                        {/* Controls */}
                        <div className="absolute top-0 right-0 flex gap-2 items-center z-10">
                            <PlayButton onPlay={handlePlayClick} />
                            {saved ? <BookmarkCheck stroke="white" fill="green" onClick={handleSave} /> : <Bookmark stroke="white" onClick={handleSave} />}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white overflow-scroll w-45 text-nowrap scrollb-none cursor-pointer hover:underline" title={title}
                        onClick={() => {
                            window.open(`/album/${albumID}`)
                        }}
                    >
                        {title}
                    </h3>

                    {artist.map((a, i) => (
                        <span
                            key={a.id}
                            className="text-gray-300 text-sm truncate cursor-pointer hover:underline"
                            title={a.name}
                            onClick={() => window.open(`/artist/${a.id}`)}
                        >
                            {a.name}{i < artist.length - 1 && ', '}
                        </span>
                    ))}
                </div>

                {/* Popularity */}
                <div className={`flex items-center gap-1 text-sm ${popularity >= 80 ? "text-green-400" : "text-yellow-400"}`}>
                    <Award size={16} />
                    <span>Popularity: {popularity}</span>
                    {popularity >= 80 && <span title="Trending">🔥</span>}
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2 flex flex-col">
                    <SpotifyButton clickHandle={() => handleClick(spoURL)} />
                    <YouTubeButton clickHandle={() => handleClick(`https://www.youtube.com/results?search_query=${title + " " + artist.map((a, i) => a.name)}`)} />
                </div>
            </div>
        </motion.div>
    );
}