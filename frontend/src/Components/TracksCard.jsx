import React, { useState, useEffect } from "react";
import { PlayCircle, Heart, HeartOff, ExternalLink, Flame } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePlayer } from "../contexts/PlayerContext"; // assuming you have this custom hook

const TrackCard = ({
  url,
  title,
  artist,
  spoURL,
  YTURL,
  popularity,
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
    const updatedSongs = saved
      ? savedSongs.filter((s) => !(s.title === title && s.artist === artist))
      : [
          ...savedSongs,
          { title, artist, spoURL, YTURL, url, popularity, explicit, type: "track", trackURI },
        ];
    localStorage.setItem("savedSongs", JSON.stringify(updatedSongs));
    setSaved(!saved);
  };

  const openLink = (link) => window.open(link, "_blank");
  const playTrack = () => {
    if (trackURI?.startsWith("spotify:")) showPlayer(trackURI);
  };

  return (
    <div className="relative mb-5 mx-5 px-10 w-80 overflow-scroll flex gap-4 items-center bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 rounded-2xl p-4 shadow-md group">
      <img
        src={url}
        alt={title}
        className="w-16 h-16 rounded-lg object-cover shadow-sm"
      />
      <div className="flex flex-col justify-between flex-grow min-w-0">
        <div className="flex items-center gap-2 text-sm text-white font-semibold truncate">
          {title}
          {explicit && (
            <span className="text-xs bg-red-600 text-white px-1 py-0.5 rounded-sm">
              E
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-400 truncate">{artist}</div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={playTrack}
            className="text-green-400 hover:scale-110 transition-transform"
            title="Play"
          >
            <PlayCircle size={22} />
          </button>

          <button
            onClick={toggleSave}
            className="text-pink-500 hover:scale-110 transition-transform"
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? <HeartOff size={20} /> : <Heart size={20} />}
          </button>

          <button
            onClick={() => openLink(spoURL)}
            title="Open on Spotify"
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <FontAwesomeIcon icon={faSpotify} size="lg" />
          </button>

          <button
            onClick={() => openLink(YTURL)}
            title="Open on YouTube"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </button>

          <div
            className="ml-auto flex items-center gap-1 text-xs text-yellow-400"
            title={`Popularity: ${popularity}`}
          >
            <Flame size={16} />
            <span>{popularity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
