import React, { useState, useEffect } from "react";
import { PlayCircle, Star, Save, CheckCircle, AlertCircle } from "lucide-react";
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
    <div className="w-full m-5 rounded-2xl bg-zinc-900/80 border border-zinc-700 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-md hover:bg-zinc-800/90 transition-all duration-200">
      
      {/* Cover Image */}
      <div className="relative w-80 h-auto sm:w-24 sm:h-24 flex-shrink-0">
        <img
          src={url}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Info + Actions */}
      <div className="flex-1 w-full">
        {/* Title + Artist */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <div>
            <h2 className="text-lg font-semibold text-white line-clamp-1">{title}</h2>
            <p className="text-sm text-zinc-400 line-clamp-1">{artist}</p>
          {explicit && (
            <span className="relative top-0 right-0 bg-red-600 text-white text-XL px-1 py-[1px] rounded-bl font-bold">
              EXPLICIT
            </span>
          )}
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            {typeof popularity === "number" && (
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                <Star size={14} />
                <span>{popularity}</span>
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-1 text-green-500 text-xs">
                <CheckCircle size={14} />
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-3 flex flex-wrap gap-3 items-center">
          {/* Play */}
          {trackURI && (
            <button
              onClick={playTrack}
              className="text-green-400 hover:text-green-300 transition-transform hover:scale-110"
              title="Play Track"
            >
              <PlayCircle size={30} />
            </button>
          )}

          {/* Save */}
          <button
            onClick={toggleSave}
            title={saved ? "Unsave" : "Save"}
            className="text-zinc-400 hover:text-white transition-transform hover:scale-110"
          >
            {saved ? <CheckCircle size={22} /> : <Save size={22} />}
          </button>

          {/* Spotify & YouTube */}
          <div className="flex gap-2 ml-auto">
            {spoURL && (
              <SmallSpotifyButton clickHandle={() => openLink(spoURL)} />
            )}
            {YTURL && (
              <SmallYouTubeButton clickHandle={() => openLink(YTURL)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
