// ArtistPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpotifyToken } from "../hooks/useSpotify";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkCheck, Loader } from "lucide-react";
import { SpotifyButton } from "../Components/MusicButtons";
import { TrackCard } from "../Components/CardComponents/TracksCard";
import { AlbumCard } from "../Components/CardComponents/AlbumsCard";

export default function ArtistPage() {
    const { id } = useParams();
    const [token, setToken] = useState("");
    const [artist, setArtist] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [saved, setSaved] = useState(false);

    window.scrollTo(0, 0)

    // Check localStorage on mount
    useEffect(() => {
        if (!artist) return;

        const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];
        const isSaved = savedArtists.some(a => a.id === artist.id);
        setSaved(isSaved);
    }, [artist]);


    const toggleSave = () => {
        const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];

        if (saved) {
            const updated = savedArtists.filter((a) => a.id !== artist.id);
            localStorage.setItem("savedArtists", JSON.stringify(updated));
            setSaved(false);
        } else {
            const newArtist = {
                id: artist.id,
                title: artist.name,
                spoURL: artist.external_urls.spotify,
                YTURL: "", // Placeholder if needed
                image: artist.images[0]?.url,
                followers: artist.followers.total,
                popularity: artist.popularity,
                uri: artist.uri,
            };
            savedArtists.push(newArtist);
            localStorage.setItem("savedArtists", JSON.stringify(savedArtists));
            setSaved(true);
        }
    };

    const handleSave = () => {
        toggleSave();
    };


    useEffect(() => {
        async function fetchData() {
            const t = await getSpotifyToken();
            setToken(t);

            const [artistRes, topTracksRes, albumsRes, relatedRes] = await Promise.all([
                axios.get(`https://api.spotify.com/v1/artists/${id}`, {
                    headers: { Authorization: `Bearer ${t}` },
                }),
                axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
                    headers: { Authorization: `Bearer ${t}` },
                }),
                axios.get(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&market=US`, {
                    headers: { Authorization: `Bearer ${t}` },
                }),
                // axios.get(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
                //     headers: { Authorization: `Bearer ${t}` },
                // }),
            ]);

            setArtist(artistRes.data);
            setTopTracks(topTracksRes.data.tracks);

            const uniqueAlbums = [];
            const seen = new Set();
            for (const album of albumsRes.data.items) {
                if (!seen.has(album.name)) {
                    uniqueAlbums.push(album);
                    seen.add(album.name);
                }
            }
            setAlbums(uniqueAlbums.slice(0, 12));
            setRelatedArtists(relatedRes.data.artists);

            // Check if artist is saved
            const savedArtists = JSON.parse(localStorage.getItem("savedArtists")) || [];
            setSaved(savedArtists.some(a => a.id === artistRes.data.id));
        }

        fetchData();
    }, [id]);


    if (!artist) return <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader className="animate-spin w-8 h-8 mr-3" />
        <span className="text-lg">Loading the Artist Data...</span>
    </div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
            {/* Breadcrumb */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
                {saved ? (
                    <BookmarkCheck stroke="white" fill="green" onClick={handleSave} className="cursor-pointer" />
                ) : (
                    <Bookmark stroke="white" onClick={handleSave} className="cursor-pointer" />
                )}
            </div>

            {/* Artist Header */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="w-52 h-52 md:w-64 md:h-64 rounded-full ring-4 ring-purple-500/50 object-cover shadow-lg"
                />
                <div className="space-y-3 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold">{artist.name}</h1>
                    <p className="text-lg text-gray-300">{artist.followers.total.toLocaleString()} Followers</p>
                    <p className="text-lg text-yellow-400">Popularity: {artist.popularity}</p>

                    {/* Genre Tags */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                        {artist.genres.map((genre, i) => (
                            <span key={i} className="bg-purple-700/60 px-3 py-1 rounded-full text-sm text-white">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <SpotifyButton clickHandle={() => window.open(artist.external_urls.spotify, "_blank")} />
                </div>
            </div>

            {/* Top Tracks */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Top Tracks</h2>
                <div className="flex flex-row flex-wrap justify-center gap-5">
                    {topTracks.map((track, index) => (
                        <TrackCard
                            key={index}
                            url={track.album.images[0]?.url}
                            title={track.name}
                            artist={track.artists.map((artist) => ({
                                name: artist.name,
                                id: artist.id
                            }))}
                            spoURL={track.external_urls.spotify}
                            YTURL={""} // You can plug this from YouTube API if needed
                            popularity={track.popularity}
                            explicit={track.explicit}
                            trackURI={track.uri}
                            albumID={track.album.id}
                        />
                    ))}

                </div>
            </div>

            {/* Discography */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Discography</h2>
                <div className="flex flex-row flex-wrap justify-center gap-5">
                    {albums.map((album, index) => (
                        <AlbumCard
                            key={index}
                            url={album.images[0]?.url}
                            title={album.name}
                            artist={album.artists.map((artist) => ({
                                name: artist.name,
                                id: artist.id
                            }))}
                            trackURI={album.uri}
                            id={album.id}
                        />
                    ))}

                </div>
            </div>

            {/* Related Artists */}
            {/* <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Related Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {relatedArtists.slice(0, 8).map(ra => (
                        <Link to={`/artist/${ra.id}`} key={ra.id}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 p-4 rounded-xl text-center"
                            >
                                <img
                                    src={ra.images[0]?.url}
                                    alt={ra.name}
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                                />
                                <h4 className="text-white font-medium">{ra.name}</h4>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div> */}
        </div>
    );
}
