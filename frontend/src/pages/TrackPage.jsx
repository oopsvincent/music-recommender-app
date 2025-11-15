// TrackPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader, Play } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";
import { usePlayer } from "../contexts/PlayerContext";
import { ShareTrackComponent } from "../Components/CardComponents/ShareTrackComponent";

export default function TrackPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Spotify track ID
  const [track, setTrack] = useState(null);
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

  // Primary color for the QR / accents (without '#')
  const PRIMARY_HEX = "870087";
  const BG_DARK = "010101";

  // QR URL (we keep the same API; displayed size controlled with CSS)
  const urlForQR = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https://grooveestrella.vercel.app/track/${id}&color=${PRIMARY_HEX}&bgcolor=${BG_DARK}&format=png`;

  function msToMmSs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    return <div>{paddedMinutes}:{paddedSeconds}</div>;
  }

  useEffect(() => {
    const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
    const isSaved = savedSongs.some(song => song.trackURI === `spotify:track:${id}`);
    setSaved(isSaved);
  }, [id]);

  const toggleSave = () => {
    const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];

    if (saved) {
      const updated = savedSongs.filter(song => song.trackURI !== `spotify:track:${id}`);
      localStorage.setItem("savedSongs", JSON.stringify(updated));
      setSaved(false);
    } else if (track) {
      const newTrack = {
        title: track.name,
        artist: track.artists,
        image: track.album.images[0]?.url,
        spoURL: track.external_urls.spotify,
        YTURL: `https://www.youtube.com/results?search_query=${encodeURIComponent(track.name + ' ' + track.artists.map(a => a.name).join(' '))}`,
        popularity: track.popularity,
        explicit: track.explicit,
        trackURI: track.uri,
        albumID: track.album.id
      };
      savedSongs.push(newTrack);
      localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
      setSaved(true);
    }
  };

  useEffect(() => {
    async function fetchTrackData() {
      const token = await getSpotifyToken();
      try {
        const res = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrack(res.data);
      } catch (err) {
        console.error("Error fetching track data:", err);
      }
    }
    fetchTrackData();
  }, [id]);

  if (!track) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Loader className="animate-spin w-8 h-8 mr-3" />
      <span className="text-lg">Loading Track...</span>
    </div>
  );

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-10 text-white"
      style={{ background: 'linear-gradient(180deg,#07000a 0%, #120019 40%, #030005 100%)' }}
    >
      {/* Header row: Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <ArrowLeft size={18} /> Back To Home
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ShareTrackComponent
              trackId={track.id}
              artist={track.artists}
              explicit={track.explicit}
              title={track.name}
              popularity={track.popularity}
              url={track.album.images[0]?.url}
            />
          </div>

          <div className="flex items-center gap-2">
            {saved ? (
              <BookmarkCheck stroke="white" fill="#16a34a" onClick={toggleSave} className="cursor-pointer" />
            ) : (
              <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
            )}
          </div>
        </div>
      </div>

      {/* Grid: left = art + QR (no overlap), right = details */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,420px)_1fr] gap-8 items-start">
        {/* LEFT: album art + QR side-by-side on md+, stacked on mobile */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Album art */}
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* QR card: sits beside on md+, below on mobile */}
          <div className="flex-shrink-0">
            <div
              className="rounded-xl p-3 flex flex-col items-center"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.45)'
              }}
            >
              <div className="text-sm text-gray-300 mb-2">Share this track</div>
              <img
                src={urlForQR}
                alt={`QR for ${track.name}`}
                className="w-36 h-36 md:w-44 md:h-44 rounded-sm"
                style={{ background: '#010101' }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(`https://grooveestrella.vercel.app/track/${id}`)}
                  className="px-3 py-2 text-sm rounded-md font-medium"
                  style={{ background: `#${PRIMARY_HEX}`, color: '#fff' }}
                >
                  Copy link
                </button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=https://grooveestrella.vercel.app/track/${id}&color=${PRIMARY_HEX}&bgcolor=${BG_DARK}&format=png`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-sm rounded-md font-medium border border-white/10 text-gray-100"
                >
                  Open QR
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: track details */}
        <div className="pl-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2" style={{ color: '#ffffff', lineHeight: 1.05 }}>{track.name}</h1>

          <p className="text-base sm:text-lg text-gray-300 mb-2">
            {track.artists.map((a, i) => (
              <span
                key={a.id}
                className="cursor-pointer hover:underline hover:text-white transition-colors duration-200"
                title={a.name}
                onClick={() => navigate(`/artist/${a.id}`)}
              >
                {a.name}{i < track.artists.length - 1 && ', '}
              </span>
            ))} • {
              <span
                className="cursor-pointer hover:underline hover:text-white transition-colors duration-200"
                title={track.album.type}
                onClick={() => navigate(`/album/${track.album.id}`)}
              >{track.album.name}</span>
            }
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <div>{msToMmSs(track.duration_ms)}</div>
            <div className="opacity-80">•</div>
            <div className="select-none">Popularity: {track.popularity} {track.popularity >= 80 && <span title="Trending">🔥</span>}</div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
            <SpotifyButton clickHandle={() => window.open(track.external_urls.spotify, "_blank")} />
            <YouTubeButton clickHandle={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(track.name + ' ' + track.artists.map(a => a.name).join(' '))}`, "_blank")} />
            <button
              onClick={() => showPlayer(track.uri, false)}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-medium"
              style={{
                background: `#${PRIMARY_HEX}`,
                color: '#fff'
              }}
            >
              <Play size={18} /> Play
            </button>

            {/* small action group on the right on larger screens */}
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block">
                {/* keep share visible on larger screens as well */}
                <ShareTrackComponent
                  trackId={track.id}
                  artist={track.artists}
                  explicit={track.explicit}
                  title={track.name}
                  popularity={track.popularity}
                  url={track.album.images[0]?.url}
                />
              </div>

              {saved ? (
                <BookmarkCheck stroke="white" fill="#16a34a" onClick={toggleSave} className="cursor-pointer" />
              ) : (
                <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
              )}
            </div>
          </div>

          {/* description / placeholder for extra content */}
          <div className="mt-6 text-gray-300">
            <p className="leading-relaxed">Album: <span className="font-medium">{track.album.name}</span></p>
            <p className="mt-2 text-sm opacity-80">Released: {track.album.release_date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
