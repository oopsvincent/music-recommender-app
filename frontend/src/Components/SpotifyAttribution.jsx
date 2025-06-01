import React from 'react';
// import { cn } from "@/lib/utils"; // Optional: ut Tailwind+ShadCN

const SpotifyAttribution = ({ className }) => {
  return (
    <div
      className=
        "flex items-center justify-center gap-2 p-4 bg-black rounded-lg shadow-md border border-[#1DB954]/30 text-[#1DB954]"
    >
      <img src="/2024-spotify-full-logo/Full_Logo_White_CMYK.svg" width={100} alt="Spotify" />
      <span className="text-sm font-medium">
        Content powered by Spotify
      </span>
    </div>
  );
};

export default SpotifyAttribution;
