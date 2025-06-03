import { Play } from "lucide-react";

export const PlayButton = ({ onPlay }) => (
  <button
    onClick={onPlay}
    title="Play on Spotify"
    className="text-white bg-black/60 hover:bg-green-600 transition-all duration-300 p-2 rounded-full hover:scale-110 active:scale-95 backdrop-blur-sm"
  >
    <Play size={20} strokeWidth={2.5} />
  </button>
);