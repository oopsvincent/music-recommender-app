// ArtistPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader, Play } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";
import { TrackCard } from "../Components/CardComponents/TracksCard";
import { AlbumCard } from "../Components/CardComponents/AlbumsCard";
import { usePlayer } from "../contexts/PlayerContext";
import { ArtistTrackCard } from "../Components/CardComponents/SmallTracksCard";
import { ShareArtistComponent } from "../Components/ArtistShareComponent";

export default function ArtistPage() {
  const { id } = useParams();
  const [token, setToken] = useState("");
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [saved, setSaved] = useState(false);
  const { showPlayer } = usePlayer();

  // color tokens
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

  // Check localStorage on artist load
  useEffect(() => {
    if (!artist) return;
    const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];
    const isSaved = savedArtists.some(a => a.id === artist.id);
    setSaved(isSaved);
  }, [artist]);

  const toggleSave = () => {
    const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];

    if (saved && artist) {
      const updated = savedArtists.filter((a) => a.id !== artist.id);
      localStorage.setItem("savedArtists", JSON.stringify(updated));
      setSaved(false);
    } else if (artist) {
      const newArtist = {
        id: artist.id,
        title: artist.name,
        spoURL: artist.external_urls?.spotify,
        YTURL: "",
        image: artist.images?.[0]?.url,
        followers: artist.followers?.total ?? 0,
        popularity: artist.popularity,
        uri: artist.uri,
      };
      savedArtists.push(newArtist);
      localStorage.setItem("savedArtists", JSON.stringify(savedArtists));
      setSaved(true);
    }
  };

  // Fetch artist data, top tracks and albums
  useEffect(() => {
    async function fetchData() {
      try {
        const t = await getSpotifyToken();
        setToken(t);

        const [artistRes, topTracksRes, albumsRes] = await Promise.all([
          axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
          axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
          axios.get(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&market=US&limit=50`, {
            headers: { Authorization: `Bearer ${t}` },
          }),
        ]);

        setArtist(artistRes.data || null);
        setTopTracks((topTracksRes.data && topTracksRes.data.tracks) || []);
        document.title = `${artistRes.data?.name || "Artist"} | GrooveEstrella`;

        // dedupe albums by name (keep first appearance) and limit
        const uniqueAlbums = [];
        const seen = new Set();
        for (const a of (albumsRes.data?.items || [])) {
          if (!seen.has(a.name)) {
            uniqueAlbums.push(a);
            seen.add(a.name);
          }
        }
        setAlbums(uniqueAlbums.slice(0, 12));

        // set saved state
        const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];
        setSaved(savedArtists.some(a => a.id === artistRes.data.id));
      } catch (err) {
        console.error("Error fetching artist data:", err);
      }
    }

    fetchData();
  }, [id]);

  if (!artist) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Loader className="animate-spin w-8 h-8 mr-3" />
      <span className="text-lg">Loading the Artist Data...</span>
    </div>
  );

  // QR for artist (non-overlapping card)
  const artistUrl = `https://grooveestrella.vercel.app/artist/${artist.id}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(artistUrl)}&color=${PRIMARY_HEX}&bgcolor=${BG_DARK}&format=png`;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 text-white" style={{ background: 'linear-gradient(180deg,#07000a 0%, #120019 40%, #030005 100%)' }}>
      {/* Breadcrumb / actions */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="flex items-center gap-3">
          <ShareArtistComponent
            artistId={artist.id}
            name={artist.name}
            imageUrl={artist.images?.[0]?.url}
            followers={artist.followers?.total}
            popularity={artist.popularity}
            genres={artist.genres}
          />

          {saved ? (
            <BookmarkCheck stroke="white" fill="green" onClick={toggleSave} className="cursor-pointer" />
          ) : (
            <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
          )}
        </div>
      </div>

      {/* Header: image + QR (left), details (right) */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,420px)_1fr] gap-8 items-start">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-52 h-52 md:w-64 md:h-64 rounded-full ring-4 ring-purple-500/40 object-cover overflow-hidden shadow-lg flex-shrink-0">
            <img src={artist.images?.[0]?.url} alt={artist.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          {/* QR card beside on md+, below on mobile */}
          <div className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
            <div
              className="rounded-xl p-3 flex flex-col items-center w-full md:w-40"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.45)'
              }}
            >
              <div className="text-sm text-gray-300 mb-2">Share artist</div>
              <img
                src={qrApi}
                alt={`QR for ${artist.name}`}
                className="w-36 h-36 md:w-36 md:h-36 rounded-sm"
                style={{ background: '#010101' }}
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(artistUrl)}
                  className="px-3 py-2 text-sm rounded-md font-medium"
                  style={{ background: `#${PRIMARY_HEX}`, color: '#fff' }}
                >
                  Copy link
                </button>
                <a
                  href={qrApi.replace('size=600x600', 'size=1024x1024')}
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

        {/* Details */}
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">{artist.name}</h1>
          <p className="text-lg text-gray-300">{(artist.followers?.total ?? 0).toLocaleString()} Followers</p>
          <p className="text-lg text-yellow-400">Popularity: {artist.popularity}</p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
            {(artist.genres || []).map((genre, i) => (
              <span key={i} className="bg-purple-700/60 px-3 py-1 rounded-full text-sm text-white">
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start mt-5">
            <SpotifyButton clickHandle={() => window.open(artist.external_urls?.spotify, "_blank")} />
            <YouTubeButton clickHandle={() =>
              window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name)}`,
                "_blank"
              )
            } />
            <button
              onClick={() => showPlayer(artist.uri, true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full font-medium"
              style={{ background: '#870087', color: '#fff' }}
            >
              <Play size={18} /> Play
            </button>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Top Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(topTracks || []).map((track) => (
            <TrackCard
              key={track.id}
              url={track.album?.images?.[0]?.url}
              title={track.name}
              artist={track.artists.map(a => ({ name: a.name, id: a.id }))}
              spoURL={track.external_urls?.spotify}
              popularity={track.popularity}
              explicit={track.explicit}
              trackURI={track.uri}
              albumID={track.album?.id}
            />
          ))}
        </div>
      </div>

      {/* Discography */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Discography</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(albums || []).map((alb) => (
            <AlbumCard
              key={alb.id}
              url={alb.images?.[0]?.url}
              title={alb.name}
              artist={alb.artists.map(a => ({ name: a.name, id: a.id }))}
              trackURI={alb.uri}
              id={alb.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
