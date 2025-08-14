import { ExplicitBadge } from "./ExplicitBadge";
import { PlayButton } from "./PlayButton";
import { ShareTrackComponent } from "./ShareTrackComponent"; // Add this import
import { usePlayer } from "../../contexts/PlayerContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Award, CirclePlay, EllipsisVertical, Share2 } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export const TrackCard = ({
    url,
    title,
    artist,
    spoURL,
    popularity,
    explicit,
    trackURI,
    albumID,
    trackId, // Add this prop for the share component
}) => {
    // console.log(trackURI);
    

    const navigate = useNavigate();
    const { showPlayer } = usePlayer();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
        const isSaved = savedSongs.some(
            (album) => album.trackURI === trackURI
        );
        setSaved(isSaved);
    }, [trackURI]);

    function toggleSave() {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];

        if (saved) {
            // REMOVE by trackURI
            const updated = savedSongs.filter(song => song.trackURI !== trackURI);
            localStorage.setItem("savedSongs", JSON.stringify(updated));
            setSaved(false);
        } else {
            // ADD the song
            const newSong = {
                title,
                artist,
                spoURL,
                image: url,
                popularity,
                explicit,
                trackURI,
                albumID,
                trackId,
            };
            savedSongs.push(newSong);
            localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
            setSaved(true);
        }
    }

    const handlePlayClick = () => {
        if (trackURI && trackURI.startsWith("spotify:track:")) {
            showPlayer(trackURI, false);
        } else {
            console.warn("Invalid Spotify URI:", trackURI);
        }
    };

    const handleSave = () => {
        toggleSave();
    };

    const handleClick = (url) => {
        setTimeout(() => window.open(url, "_blank"), 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 100, y: 20 }}
            whileInView={{ opacity: 1, translateY: 0, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-48 sm:w-84 bg-gradient-to-br from-gray-900/80 to-black/10 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
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
<div className="relative p-3 sm:p-4 space-y-3">
    {/* Header with Title and Desktop Controls */}
    <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
            <h3 
                className="text-sm sm:text-lg font-bold text-white truncate cursor-pointer hover:underline transition-colors duration-200"
                title={title}
                onClick={() => navigate(`/album/${albumID}`)}
            >
                {title}
            </h3>
            
            <div className="flex flex-wrap gap-x-1 text-xs sm:text-sm text-gray-300 mt-1">
                {artist.map((a, i) => (
                    <span
                        key={a.id}
                        className="cursor-pointer hover:underline hover:text-white transition-colors duration-200"
                        title={a.name}
                        onClick={() => navigate(`/artist/${a.id}`)}
                    >
                        {a.name}{i < artist.length - 1 && ','}
                    </span>
                ))}
            </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden sm:flex gap-2 items-center">
            <PlayButton onPlay={handlePlayClick} />
            <ShareTrackComponent
                trackId={trackId}
                title={title}
                artist={artist}
                url={url}
                popularity={popularity}
                explicit={explicit}
            />
            <button
                onClick={handleSave}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            >
                {saved ? (
                    <BookmarkCheck size={18} className="text-green-400" />
                ) : (
                    <Bookmark size={18} className="text-white" />
                )}
            </button>
        </div>

        {/* Mobile Dropdown */}
        <div className="flex sm:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white">
                        <EllipsisVertical size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="bg-black/95 backdrop-blur-xl text-white min-w-[160px] rounded-xl p-2 border border-white/20 shadow-2xl"
                    align="end"
                    side="top"
                    sideOffset={8}
                >
                    <DropdownMenuItem
                        onSelect={handlePlayClick}
                        className="cursor-pointer px-3 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <CirclePlay size={16} /> Play
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-2 bg-white/20" />
                    
                    <DropdownMenuItem
                        onSelect={handleSave}
                        className="cursor-pointer px-3 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                        {saved ? (
                            <>
                                <BookmarkCheck size={16} className="text-green-400" /> 
                                Saved
                            </>
                        ) : (
                            <>
                                <Bookmark size={16} /> 
                                Save
                            </>
                        )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            if (navigator.share) {
                                navigator.share({
                                    title: `${title} - ${artist.map(a => a.name).join(', ')}`,
                                    text: `Check out this amazing track!`,
                                    url: `https://music-recommender-app.vercel.app/track/${trackId || trackURI.split(':')[2]}`
                                });
                            } else {
                                navigator.clipboard.writeText(`https://music-recommender-app.vercel.app/track/${trackId || trackURI.split(':')[2]}`);
                            }
                        }}
                        className="cursor-pointer px-3 py-2.5 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                                    <ShareTrackComponent
                trackId={trackId}
                title={title}
                artist={artist}
                url={url}
                popularity={popularity}
                explicit={explicit}
            />Share
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>

    {/* Explicit Badge - positioned over the image */}
    {explicit && (
        <div className="absolute top-2 right-2 sm:top-20 sm:right-8 z-10">
            <ExplicitBadge />
        </div>
    )}

    {/* Popularity */}
    <div className={`flex items-center gap-1 text-sm ${popularity >= 80 ? "text-green-400" : "text-yellow-400"}`}>
        <Award size={16} />
        <span>Popularity: {popularity}</span>
        {popularity >= 80 && <span title="Trending">🔥</span>}
    </div>

    {/* External Buttons */}
    <div className="space-y-2 flex flex-col">
        <SpotifyButton clickHandle={() => handleClick(spoURL)} />
        <YouTubeButton clickHandle={() => handleClick(`https://www.youtube.com/results?search_query=${title + " " + artist.map((a, i) => a.name)}`)} />
    </div>
</div>
        </motion.div>
    );
};