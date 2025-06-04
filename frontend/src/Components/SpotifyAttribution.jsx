import React from 'react';

const SpotifyAttribution = () => {
  return (
    <div className="w-full flex justify-center mt-4">
      <div className="flex items-center gap-4 px-6 py-3 bg-black rounded-2xl shadow-sm w-full justify-center">
        <img
          src="/2024-spotify-full-logo/Full_Logo_White_CMYK.svg"
          alt="Spotify"
          className="w-24 object-contain"
        />
        <div className="flex-1">
          <p className="text-sm text-white/80 font-medium tracking-wide">
            Content powered by <span className="text-[#1DB954] font-semibold">Spotify</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyAttribution;