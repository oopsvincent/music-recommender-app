import React, { useState, useEffect } from "react";
import { PlayCircle, Star, Save, CheckCircle, Circle } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";
import { SmallSpotifyButton, SmallYouTubeButton } from "./MusicButtons";

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
      : [...savedSongs, { title, artist, spoURL, YTURL, url, popularity, explicit, type: "track", trackURI }];
    localStorage.setItem("savedSongs", JSON.stringify(updatedSongs));
    setSaved(!saved);
  };

  const openLink = (link) => window.open(link, "_blank");
  const playTrack = () => {
    if (trackURI?.startsWith("spotify:")) showPlayer(trackURI);
  };

  return (
    <div className="group m-5 relative flex items-center gap-4 w-full max-w-lg p-4 rounded-2xl bg-zinc-900/70 border border-zinc-700 hover:bg-zinc-800/80 backdrop-blur-md shadow-lg transition-all duration-200">
      
      {/* Image */}
      <div className="relative shrink-0">
        <img
          src={url}
          alt={title}
          className="w-16 h-16 rounded-xl object-cover shadow-sm"
        />
        {explicit && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 py-[1px] rounded-md font-bold">
            E
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-white font-semibold truncate">{title}</h2>
        <p className="text-sm text-zinc-400 truncate">{artist}</p>

        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-300">
          {typeof popularity === "number" && (
            <div className="inline-flex items-center gap-1 text-yellow-400">
              <Star size={14} />
              <span>{popularity}</span>
            </div>
          )}
          {saved && (
            <div className="inline-flex items-center gap-1 text-green-400">
              <CheckCircle size={14} />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col justify-between items-end h-full">
        {/* Play */}
        {trackURI && (
          <button
            onClick={playTrack}
            className="text-green-400 hover:text-green-300 transition-transform hover:scale-110"
            title="Play Track"
          >
            <PlayCircle size={28} />
          </button>
        )}

        {/* External Links */}
        <div className="flex gap-1 mt-3">
          {spoURL && (
            <SmallSpotifyButton clickHandle={() => openLink(spoURL)} />
          )}
          {YTURL && (
            <SmallYouTubeButton clickHandle={() => openLink(YTURL)} />
          )}
        </div>

        {/* Save */}
        <button
          onClick={toggleSave}
          title={saved ? "Unsave" : "Save"}
          className="mt-3 text-zinc-400 hover:text-white transition-transform hover:scale-110"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
        </button>
      </div>
    </div>
  );
};

export default TrackCard;
