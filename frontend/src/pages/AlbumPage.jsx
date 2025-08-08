// AlbumPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";
import { TrackCard } from "../Components/CardComponents/TracksCard";
import { usePlayer } from "../contexts/PlayerContext";
import { AlbumTrackCard } from "../Components/CardComponents/SmallTracksCard";
import { Play } from "lucide-react";

export default function AlbumPage() {
    const { id } = useParams();
    const [token, setToken] = useState("");
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [saved, setSaved] = useState(false);
    const { showPlayer } = usePlayer();


    window.scrollTo(0, 0)
    // Check localStorage save on mount & album load
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
                spoURL: album.external_urls.spotify,
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
            const t = await getSpotifyToken();
            setToken(t);
            try {
                const [albumRes, tracksRes] = await Promise.all([
                    axios.get(`https://api.spotify.com/v1/albums/${id}`, {
                        headers: { Authorization: `Bearer ${t}` }
                    }),
                    axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
                        headers: { Authorization: `Bearer ${t}` }
                    })
                ]);
                setAlbum(albumRes.data);
                setTracks(tracksRes.data.items);

                document.title = `${albumRes.data.name} — • ${albumRes.data.artists.map((a) => a.name)}`;

            } catch (err) {
                console.error("Error fetching album data:", err);
            }
        }
        fetchAlbumData();
    }, [id]);

    if (!album) return <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader className="animate-spin w-8 h-8 mr-3" />
        <span className="text-lg">Loading Album...</span>
    </div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black p-6 text-white">
            {/* Back & Save */}
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

            {/* Album Header */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-8">
                <img src={album.images[0]?.url} alt={album.name}
                    className="w-56 h-56 md:w-64 md:h-64 rounded-lg shadow-lg object-cover" />
                <div>
                    <h1 className="text-5xl font-extrabold mb-2">{album.name}</h1>
                    <p className="text-lg text-gray-300">
                        {album.artists.map(a => a.name).join(", ")} • {album.release_date}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{album.total_tracks} tracks</p>
                    <div className="flex flex-col md:flex-row justify-center mt-5">
                        <SpotifyButton clickHandle={() => window.open(album.external_urls.spotify, "_blank")} />
                        <YouTubeButton clickHandle={() =>
                            window.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(
                                    album.name + " " + album.artists.map(a => a.name).join(" ")
                                )}`,
                                "_blank"
                            )
                        } />
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={() => showPlayer(album.uri, true)}
                            className="bg-green-500 text-black p-4 rounded-full font-medium hover:bg-green-600"
                        >
                            <Play size={32} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tracks */}
            <div>
                <h2 className="text-3xl font-bold mb-4">Tracks</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {tracks.map((track, index) => (
                        <AlbumTrackCard
                            key={index}
                            title={track.name}
                            artist={track.artists} // [{name, id}]
                            spoURL={track.external_urls.spotify}
                            YTURL={track.YTURL}
                            trackURI={album.uri}
                            pos={index}
                            trackID={track.id}
                        />
                    ))}

                </div>
                <div className="text-center my-10">
                    <h1 className="my-5 text-2xl">Label: {album.label}</h1>
                    <h1 className="my-5 text-2xl text-gray-600">{album?.copyrights.map(t => t.text).join(", ")}</h1>
                </div>
            </div>
        </div>
    );
}
