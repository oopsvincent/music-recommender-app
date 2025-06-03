import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Calendar } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";

export const AlbumCard = ({
  url,
  title,
  artist,
  spoURL,
  YTURL,
  popularity, // Used as release date for albums
  description
}) => {
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
      className="relative w-64 bg-gradient-to-br from-blue-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >


      {/* Album Cover */}
      <div className="relative overflow-hidden">
        <img 
          src={url} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-4 space-y-3">
              {/* Controls */}
            <div className="absolute top-4 right-4 z-10">
                {saved ? <BookmarkCheck stroke="white" fill="green" onClick={handleSave} /> : <Bookmark stroke="white" onClick={handleSave} />}
            </div>
        <div>
          <h3 className="text-xl font-bold text-white truncate" title={title}>
            {title}
          </h3>
          <p className="text-gray-300 text-sm truncate" title={artist}>
            {artist}
          </p>
        </div>

        {/* Release Date */}
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <Calendar size={16} />
          <span>Released: {popularity}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-xs line-clamp-2">
            {description}
          </p>
        )}

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <SpotifyButton clickHandle={() => handleClick(spoURL)} />
          <YouTubeButton clickHandle={() => handleClick(YTURL)} />
        </div>
      </div>
    </motion.div>
  );
};
