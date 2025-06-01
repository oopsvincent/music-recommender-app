import React, { useState, useEffect } from "react";
import { SmallSpotifyButton, SmallYouTubeButton } from "./MusicButtons";
import { Award, PlayCircle } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";

const Card = ({
  url,
  title,
  artist,
  spoURL,
  YTURL,
  popularity,
  type,
  followers,
  description,
  explicit,
  trackURI,
}) => {
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

  useEffect(() => {
    const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
    const isAlreadySaved = savedSongs.some(
      (song) => song.title === title && song.artist === artist
    );
    setSaved(isAlreadySaved);
  }, [title, artist]);

  const toggleSave = () => {
    const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
    if (saved) {
      const updated = savedSongs.filter(
        (song) => !(song.title === title && song.artist === artist)
      );
      localStorage.setItem("savedSongs", JSON.stringify(updated));
      setSaved(false);
    } else {
      const newSong = {
        title,
        artist,
        followers,
        spoURL,
        YTURL,
        image: url,
        description,
        popularity,
        explicit,
        type,
        trackURI,
      };
      localStorage.setItem("savedSongs", JSON.stringify([...savedSongs, newSong]));
      setSaved(true);
    }
  };

  const openLink = (link) => window.open(link, "_blank");
  const playTrack = () => {
    if (trackURI?.startsWith("spotify:")) {
      showPlayer(trackURI);
    }
  };

  const displayDesc =
    description && description.length > 150
      ? description.slice(0, 147) + "..."
      : description;

  return (
    <div className="relative w-full max-w-md p-4 m-2 rounded-xl border border-white/20 bg-black/30 backdrop-blur-md hover:bg-black/40 transition-colors shadow-md">
      {/* Image + Buttons */}
      <div className="flex gap-4">
        <img
          src={url}
          alt={title}
          className="w-24 h-24 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col gap-2 justify-center">
          <SmallSpotifyButton clickHandle={() => openLink(spoURL)} />
          <SmallYouTubeButton clickHandle={() => openLink(YTURL)} />
        </div>
      </div>

      {/* Title + Save */}
      <div className="mt-4 flex items-start justify-between">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <button onClick={toggleSave} title={saved ? "Saved" : "Save"}>
          <svg
            className="w-6 h-6 transition-transform hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            fill={saved ? "rgb(0, 255, 106)" : "none"}
            viewBox="0 0 24 24"
            stroke="black"
            strokeWidth="1.5"
          >
            {saved ? (
              <>
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
              </>
            ) : (
              <>
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <line x1="12" x2="12" y1="8" y2="16" />
                <line x1="8" x2="16" y1="12" y2="12" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Description */}
      {displayDesc && (
        <p className="text-sm text-gray-300 mt-2">{displayDesc}</p>
      )}

      {/* Artist + Popularity */}
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-xs text-gray-400">
          {followers?.toLocaleString()} Followers
        </p>
        <div
          className={`inline-flex items-center gap-2 text-sm ${
            popularity < 80 ? "text-yellow-400" : "text-lime-400"
          }`}
        >
          <Award size={16} />
          <span>
            Popularity: {popularity}{" "}
            {popularity >= 80 && <span title="Trending 🔥">🔥</span>}
          </span>
        </div>
      </div>

      {/* Play Button */}
      {trackURI && (
        <button
          onClick={playTrack}
          className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-transform hover:scale-110"
          title="Play on Spotify"
        >
          <PlayCircle size={24} />
        </button>
      )}

      {/* Explicit Tag */}
      {explicit && (
        <span
          title="Explicit Content"
          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
        >
          EXPLICIT
        </span>
      )}
    </div>
  );
};

export default Card;