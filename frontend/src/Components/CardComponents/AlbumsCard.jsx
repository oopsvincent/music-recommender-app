import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Calendar, Play } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../MusicButtons";
import { usePlayer } from "../../contexts/PlayerContext";
import { useNavigate } from "react-router-dom";

export const AlbumCard = ({
  id,
  url,
  title,
  artist,
  trackURI,
}) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

useEffect(() => {
  const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
  const isSaved = savedAlbums.some(album => album.id === id); // ✅ match on id
  setSaved(isSaved);
}, [id]);

const toggleSave = () => {
  const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];

  if (saved) {
    const updated = savedAlbums.filter(album => album.id !== id);
    localStorage.setItem("savedAlbums", JSON.stringify(updated));
    setSaved(false);
  } else {
    const newAlbum = {
      id,
      title,
      artist: artist,
      image: url,
      type: "album",
      trackURI,
    };
    savedAlbums.push(newAlbum);
    localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));
    setSaved(true);
  }
};

    const handleSave = () => {
        toggleSave();
    }

  const handleClick = (url) => {
    if (url) window.open(url, "_blank");
  };

  const handleCardClick = (e) => {
    if (e.target.closest(".noskip")) return;
    navigate(`/album/${id}`);
  };

  const handlePlay = () => {
    if (trackURI?.startsWith("spotify:album:")) {
      showPlayer(trackURI, true); // context_uri mode
    } else {
      console.warn("[AlbumCard] Invalid album URI:", trackURI);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="relative w-64 bg-gradient-to-br from-blue-900/80 to-gray/80 backdrop-blur-xl rounded-md overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      {/* Album Cover */}
      <div className="relative overflow-hidden rounded-xl p-5 ">
        <img
          src={url}
          alt={title}
          className="w-auto h-auto object-cover transition-transform duration-700 hover:scale-110"
        />

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="no-click absolute bottom-2 right-2 z-20 bg-white text-black p-2 rounded-full shadow hover:scale-110 transition"
          title="Play Album"
        >
          <Play size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Save Icon */}
        <div className="absolute top-4 right-4 z-10 cursor-pointer no-click">
          {saved ? (
            <BookmarkCheck stroke="white" fill="green" onClick={handleSave} />
          ) : (
            <Bookmark stroke="white" onClick={handleSave} />
          )}
        </div>

        <div>
          <h3 className="text-xl w-[90%] font-bold text-white truncate cursor-pointer hover:underline" title={title}>

            {title}
          </h3>
{Array.isArray(artist) &&
  artist.map((a, i) => (
    <span
      key={a.id}
      className="text-gray-300 text-sm truncate cursor-pointer hover:underline noskip"
      title={a.name}
      onClick={() => navigate(`/artist/${a.id}`)}
    >
      {a.name}{i < artist.length - 1 && ', '}
    </span>
))}
            <h2 className="text-sm text-gray-400">
                album
            </h2>
        </div>
      </div>
    </motion.div>
  );
};
