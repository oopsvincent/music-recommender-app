import React, { useState, useEffect } from "react";
import { UserRound, Flame, ExternalLink, PlayCircle } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify,faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePlayer } from "../contexts/PlayerContext"; // Assuming this hook exists

const ArtistCard = ({
  title,
  url,
  spoURL,
  popularity,
  followers,
  artistURI,
}) => {
  const { showPlayer } = usePlayer();

  const playArtistRadio = () => {
    if (artistURI?.startsWith("spotify:")) {
      showPlayer(artistURI);
    }
  };

  return (
    <div className="group mb-5 mx-5 px-10 relative flex items-center gap-4 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.015] transition-all duration-200">
      <img
        src={url}
        alt={title}
        className="w-16 h-16 min-w-16 min-h-16 object-cover rounded-full border-2 border-zinc-700 shadow-sm"
      />

      <div className="flex flex-col justify-center flex-grow min-w-0">
        <div className="text-white font-semibold text-sm truncate">
          {title}
        </div>
        <div className="text-xs text-zinc-400 flex items-center gap-1">
          <UserRound size={14} className="text-zinc-400" />
          {followers.toLocaleString()} followers
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={playArtistRadio}
            className="text-green-400 hover:scale-110 transition-transform"
            title="Play Artist Radio"
          >
            <PlayCircle size={20} />
          </button>
          <button
            onClick={() => window.open(spoURL, "_blank")}
            className="text-green-500 hover:text-green-400 transition-colors"
            title="Open Spotify Profile"
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
            <Flame size={14} />
            {popularity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
