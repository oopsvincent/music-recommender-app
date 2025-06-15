// PlaylistPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { Loader, ArrowLeft, Bookmark, BookmarkCheck, Play } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";
import { AlbumTrackCard } from "../Components/CardComponents/SmallTracksCard";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

  useEffect(() => {
    const savedPlaylists = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
    const isSaved = savedPlaylists.some(p => p.id === id);
    setSaved(isSaved);
  }, [id]);

  const toggleSave = () => {
    const savedPlaylists = JSON.parse(localStorage.getItem("savedPlaylists")) || [];
    if (saved) {
      const updated = savedPlaylists.filter(p => p.id !== id);
      localStorage.setItem("savedPlaylists", JSON.stringify(updated));
      setSaved(false);
    } else if (playlist) {
      const newPlaylist = {
        id: playlist.id,
        title: playlist.name,
        image: playlist.images[0]?.url,
        spoURL: playlist.external_urls.spotify,
        owner: playlist.owner.display_name,
        totalTracks: playlist.tracks.total
      };
      savedPlaylists.push(newPlaylist);
      localStorage.setItem("savedPlaylists", JSON.stringify(savedPlaylists));
      setSaved(true);
    }
  };

  useEffect(() => {
    async function fetchPlaylist() {
      const token = await getSpotifyToken();
      try {
        const res = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylist(res.data);
        setTracks(res.data.tracks.items);
        document.title = `${res.data.name} — ${res.data.owner.display_name}`;
      } catch (err) {
        console.error("Error fetching playlist:", err);
      }
    }
    fetchPlaylist();
  }, [id]);

  if (!playlist) return <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <Loader className="animate-spin w-8 h-8 mr-3" />
    <span className="text-lg">Loading Playlist...</span>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-900 to-black p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <ArrowLeft size={18} /> Back To Home
        </Link>
        {saved ? (
          <BookmarkCheck stroke="white" fill="green" onClick={toggleSave} className="cursor-pointer" />
        ) : (
          <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-8">
        <img src={playlist.images[0]?.url} alt={playlist.name} className="w-56 h-56 md:w-64 md:h-64 rounded-lg shadow-lg object-cover" />
        <div>
          <h1 className="text-5xl font-extrabold mb-2">{playlist.name}</h1>
          <p className="text-lg text-gray-300">By {playlist.owner.display_name}</p>
          <p className="text-sm text-gray-400 mt-1">{playlist.tracks.total} tracks</p>
          <div className="flex flex-col md:flex-row justify-center mt-5">
            <SpotifyButton clickHandle={() => window.open(playlist.external_urls.spotify, "_blank")} />
            <YouTubeButton clickHandle={() =>
              window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(playlist.name + " " + playlist.owner.display_name)}`,
                "_blank"
              )
            } />
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => showPlayer(playlist.uri, true)}
              className="bg-green-500 text-black p-4 rounded-full font-medium hover:bg-green-600"
            >
              <Play size={32} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Tracks</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {tracks.map((item, index) => (
            <AlbumTrackCard
              key={index}
              title={item.track.name}
              artist={item.track.artists}
              spoURL={item.track.external_urls.spotify}
              trackURI={playlist.uri}
              pos={index}
              trackID={item.track.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
