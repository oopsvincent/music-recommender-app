// src/components/RandomTrackButton.jsx
import { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import Card from './Card';
import { getSpotifyToken } from '../hooks/useSpotify';
import loadTracks from '../hooks/useTrackLoader';
import fetchYouTubeData from '../hooks/useYoutubeSearch';
import { motion } from 'framer-motion';

export default function RandomTrackButton({ categoryBaseUrl }) {
    const [loading, setLoading] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [spotifyToken, setSpotifyToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getSpotifyToken();
            setSpotifyToken(token);
        };
        fetchToken();
    }, []);

    const handleClick = async () => {
        setLoading(true);
        try {
            if (!categoryBaseUrl || categoryBaseUrl.endsWith('/songs/')) {
                alert('Please select a genre first!');
                setLoading(false);
                return;
            }

            const { fetchAllSongs, getRandomSongFromList } = await import('../modules/musicApi');
            const songsList = await fetchAllSongs(categoryBaseUrl);
            const randomSong = getRandomSongFromList(songsList);
            console.log(randomSong);


            let enrichedTrack = [];
            await loadTracks([randomSong], spotifyToken, (data) => {
                enrichedTrack = data;
            });

            // Merge enriched Spotify data + original API data
            const enrichedTracks = await loadTracks([randomSong], spotifyToken);
            setSelectedTrack({
                ...enrichedTracks[0],
                explicit: randomSong.explicit !== undefined ? randomSong.explicit : enrichedTracks[0].explicit,
                popularity: randomSong.popularity !== undefined ? randomSong.popularity : enrichedTracks[0].popularity,
                type: "track",
            });
        } catch (error) {
            console.error('Error fetching random song:', error);
        }
        setLoading(false);
    };

    return (
        <>

            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClick}
                className="px-4 py-2 w-auto my-2 mt-3 mx-auto block bg-[#D40000] text-white rounded hover:bg-[] disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Random Track'}
            </motion.button>

            <ModalWrapper isOpen={!!selectedTrack} onClose={() => setSelectedTrack(null)}>
                {selectedTrack && (
                    <Card
                        title={selectedTrack.title}
                        artist={selectedTrack.artists}
                        explicit={selectedTrack.explicit}
                        popularity={selectedTrack.popularity}
                        url={selectedTrack.url}
                        spoURL={selectedTrack.spoURL}
                        YTURL={fetchYouTubeData(selectedTrack.title + " " + selectedTrack.artists)}
                        type={selectedTrack.type}
                        trackURI={selectedTrack.trackURI}
                        handleSave={() => { }}
                    />
                )}
            </ModalWrapper>
        </>
    );
}
