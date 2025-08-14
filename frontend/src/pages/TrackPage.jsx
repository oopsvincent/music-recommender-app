// TrackPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader, Play, SpaceIcon } from "lucide-react";
import { SpotifyButton, YouTubeButton } from "../Components/MusicButtons";
import { usePlayer } from "../contexts/PlayerContext";
import { ShareTrackComponent } from "../Components/CardComponents/ShareTrackComponent";

export default function TrackPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Spotify track ID
    const [track, setTrack] = useState(null);
    const [saved, setSaved] = useState(false);
    const { showPlayer } = usePlayer();

    function msToMmSs(ms) {
        // Convert milliseconds to total seconds
        const totalSeconds = Math.floor(ms / 1000);

        // Calculate minutes
        const minutes = Math.floor(totalSeconds / 60);

        // Calculate remaining seconds
        const seconds = totalSeconds % 60;

        // Format to two digits (e.g., 01, 09, 12)
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        // Combine and return
        return (
            <div>
                {paddedMinutes}:{paddedSeconds}
            </div>
        );
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
                // console.log(res.data);

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
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6 text-white">
            {/* Back & Save */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
                    <ArrowLeft size={18} /> Back To Home
                </Link>
                <div className="flex justify-center items-center gap-2">
                    <div>
                        <ShareTrackComponent trackId={track.id} artist={track.artists} explicit={track.explicit} title={track.name} popularity={track.popularity} url={track.album.images[0]?.url} />
                    </div>
                    {saved ? (
                        <BookmarkCheck stroke="white" fill="green" onClick={toggleSave} className="cursor-pointer" />
                    ) : (
                        <Bookmark stroke="white" onClick={toggleSave} className="cursor-pointer" />
                    )}
                </div>
            </div>

            {/* Track Details */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-8">
                <img src={track.album.images[0]?.url} alt={track.name} className="w-56 h-56 md:w-64 md:h-64 rounded-lg shadow-lg object-cover" />
                <div>
                    <h1 className="text-5xl font-extrabold mb-2">{track.name}</h1>
                    <p className="text-lg text-gray-300">
                        {track.artists.map((a, i) => (
                            <span
                                key={a.id}
                                className="cursor-pointer hover:underline hover:text-white transition-colors duration-200 active:underline"
                                title={a.name}
                                onClick={() => navigate(`/artist/${a.id}`)}
                            >
                                {a.name}{i < track.artists.length - 1 && ', '}
                            </span>
                        ))} • {
                            <span
                                className="cursor-pointer hover:underline hover:text-white transition-colors duration-200 active:underline"
                                title={track.album.type}
                                onClick={() => navigate(`/album/${track.album.id}`)}
                            >{track.album.name}</span>
                        }
                    </p>
                    <p>{msToMmSs(track.duration_ms)}</p>
                    <p className="text-sm text-gray-400 mt-1 cursor-default select-none">Popularity: {track.popularity}        {track.popularity >= 80 && <span title="Trending">🔥</span>}</p>
                    <div className="flex flex-col md:flex-row justify-center mt-5">
                        <SpotifyButton clickHandle={() => window.open(track.external_urls.spotify, "_blank")} />
                        <YouTubeButton clickHandle={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(track.name + ' ' + track.artists.map(a => a.name).join(' '))}`, "_blank")} />
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button
                            onClick={() => showPlayer(track.uri, false)}
                            className="bg-green-500 text-black p-4 rounded-full font-medium hover:bg-green-600"
                        >
                            <Play size={32} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
