// ArtistPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SpotifyButton } from "../Components/MusicButtons";
import { Link } from "react-router-dom";

export default function ArtistPage() {
    const { id, redirected_from } = useParams();
    const [artist, setArtist] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [token, setToken] = useState("");

    console.log(redirected_from);
    

    useEffect(() => {
        async function fetchData() {
            const t = await getSpotifyToken();
            setToken(t);

            const artistRes = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            setArtist(artistRes.data);

            const tracksRes = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            setTopTracks(tracksRes.data.tracks);
        }

        fetchData();
    }, [id]);

    if (!artist) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white mb-6">
                <ArrowLeft /> Back
            </Link>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="w-52 h-52 md:w-64 md:h-64 rounded-full ring-4 ring-purple-500/50 object-cover shadow-lg"
                />
                <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold">{artist.name}</h1>
                    <p className="text-lg text-gray-300">{artist.followers.total.toLocaleString()} Followers</p>
                    <p className="text-lg text-yellow-400">Popularity: {artist.popularity}</p>
                    <SpotifyButton clickHandle={() => window.open(artist.external_urls.spotify, "_blank")} />
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Top Tracks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topTracks.map(track => (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            key={track.id}
                            className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <img src={track.album.images[0]?.url} alt={track.name} className="w-16 h-16 rounded-md" />
                                <div>
                                    <h3 className="font-bold text-lg">{track.name}</h3>
                                    <p className="text-gray-300 text-sm">{track.album.name}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <SpotifyButton clickHandle={() => window.open(track.external_urls.spotify, "_blank")} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
