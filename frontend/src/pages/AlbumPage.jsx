// AlbumPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader, Play } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";
import { TrackCard } from "../Components/CardComponents/TracksCard";
import { usePlayer } from "../contexts/PlayerContext";
import { AlbumTrackCard } from "../Components/CardComponents/SmallTracksCard";
import { ShareTrackComponent } from "../Components/CardComponents/ShareTrackComponent";

export default function AlbumPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

  // Color tokens
  const PRIMARY_HEX = "870087";
  const BG_DARK = "010101";

  // safe scroll on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
        window.scrollTo(0, 0);
      }
    } catch (e) {
      console.warn("scrollTo failed", e);
    }
  }, []);

  // Check localStorage save on mount & when album id changes
  useEffect(() => {
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
    const isSaved = savedAlbums.some(a => a.id === id);
    setSaved(isSaved);
  }, [id]);

  const toggleSave = () => {
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
    if (saved) {
      const updated = savedAlbums.filter(a => a.id !== id);
      localStorage.setItem("savedAlbums", JSON.stringify(updated));
      setSaved(false);
    } else if (album) {
      const newAlbum = {
        id: album.id,
        title: album.name,
        artist: album.artists,
        image: album.images[0]?.url,
        spoURL: album.external_urls?.spotify,
        release_date: album.release_date,
        tracksCount: album.total_tracks
      };
      savedAlbums.push(newAlbum);
      localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));
      setSaved(true);
    }
  };

  // Fetch album info & tracks
  useEffect(() => {
    async function fetchAlbumData() {
      try {
        const t = await getSpotifyToken();
        setToken(t);

        const [albumRes, tracksRes] = await Promise.all([
          axios.get(`https://api.spotify.com/v1/albums/${id}`, {
            headers: { Authorization: `Bearer ${t}` }
          }),
          axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
            headers: { Authorization: `Bearer ${t}` }
          })
        ]);

        const albumData = albumRes.data;
        setAlbum(albumData);
        setTracks(tracksRes.data.items || []);

        // set a nice document title
        const artistNames = (albumData.artists || []).map(a => a.name).join(", ");
        document.title = `${albumData.name} — ${artistNames}`;
      } catch (err) {
        console.error("Error fetching album data:", err);
      }
    }
    fetchAlbumData();
  }, [id]);

  if (!album) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Loader className="animate-spin w-8 h-8 mr-3" />
      <span className="text-lg">Loading Album...</span>
    </div>
  );

  // QR URL for album (use higher size; displayed size controlled with CSS)
  const albumUrl = `https://grooveestrella.vercel.app/album/${album.id || id}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(albumUrl)}&color=${PRIMARY_HEX}&bgcolor=${BG_DARK}&format=png`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 text-white" style={{ background: 'linear-gradient(180deg,#07000a 0%, #120019 40%, #030005 100%)' }}>
      {/* Back & Save */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <ArrowLeft size={18} /> Back To Home
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <ShareTrackComponent
              trackId={album.id}
              artist={album.artists}
              explicit={album.explicit}
              title={album.name}
              popularity={album.popularity}
              url={album.images?.[0]?.url}
              type="album"
            />
          </div>
          {saved ? (
            <BookmarkCheck stroke="white" fill="green" onClick={toggleSave} className="cursor-pointer" />
          ) : (
            <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
          )}
        </div>
      </div>

      {/* Album Header: grid with left column reserved for art+QR, right for details */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,420px)_1fr] gap-8 items-start mb-8">
        {/* LEFT: art + QR (stack on mobile, side-by-side on md+) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* album art */}
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            <img src={album.images?.[0]?.url} alt={album.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          {/* QR card */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <div
              className="rounded-xl p-3 flex flex-col items-center w-full md:w-40"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.45)'
              }}
            >
              <div className="text-sm text-gray-300 mb-2">Share this album</div>

              <img
                src={qrApi}
                alt={`QR for ${album.name}`}
                className="w-36 h-36 md:w-36 md:h-36 rounded-sm"
                style={{ background: '#010101' }}
              />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(albumUrl)}
                  className="px-3 py-2 text-sm rounded-md font-medium"
                  style={{ background: `#${PRIMARY_HEX}`, color: '#fff' }}
                >
                  Copy link
                </button>
                <a
                  href={`${qrApi.replace('size=600x600', 'size=1024x1024')}`}
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

        {/* RIGHT: album details */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">{album.name}</h1>

          <p className="text-base sm:text-lg text-gray-300 mb-2">
            {(album.artists || []).map((a, i) => (
              <span
                key={a.id || i}
                className="cursor-pointer hover:underline hover:text-white transition-colors duration-200"
                title={a.name}
                onClick={() => navigate(`/artist/${a.id}`)}
              >
                {a.name}{i < (album.artists || []).length - 1 && ', '}
              </span>
            ))} • {album.release_date}
          </p>

          <p className="text-sm text-gray-400 mt-1">{album.total_tracks} tracks</p>

          <div className="mt-4 flex gap-3">
            <SpotifyButton clickHandle={() => window.open(album.external_urls?.spotify, "_blank")} />
            <YouTubeButton clickHandle={() =>
              window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  album.name + " " + (album.artists || []).map(a => a.name).join(" ")
                )}`,
                "_blank"
              )
            } />
            <button
              onClick={() => showPlayer(album.uri, true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-medium"
              style={{ background: '#870087', color: '#fff' }}
            >
              <Play size={18} />
            </button>
          </div>

          <div className="mt-6 text-gray-300">
            {album.label && <p className="leading-relaxed">Label: <span className="font-medium">{album.label}</span></p>}
            {album?.copyrights?.length ? (
              <p className="mt-2 text-sm opacity-80">{album.copyrights.map((t, i) => <span key={i}>{t.text}{i < album.copyrights.length - 1 ? ", " : ""}</span>)}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((trk, index) => (
            <AlbumTrackCard
              key={trk.id || index}
              title={trk.name}
              artist={trk.artists}
              spoURL={trk.external_urls?.spotify}
              YTURL={trk.YTURL}
              trackURI={trk.uri || album.uri}
              pos={index}
              trackID={trk.id}
            />
          ))}
        </div>

        <div className="text-center my-10">
          {album?.copyrights?.length ? (
            <div className="my-4 text-sm text-gray-500">{album.copyrights.map((t, i) => <div key={i}>{t.text}</div>)}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
