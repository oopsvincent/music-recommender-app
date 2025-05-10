// src/components/RandomTrackButton.jsx
import { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import Card from './Card';
import { getSpotifyToken } from '../hooks/useSpotify';
import loadTracks from '../hooks/useTrackLoader';
import fetchYouTubeData from '../hooks/useYoutubeSearch';

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
                explicit: randomSong.explicit,
                type: randomSong.type,
                followers: randomSong.followers,
                description: randomSong.description,
            });


            // setSelectedTrack(enrichedWithExtras);

        } catch (error) {
            console.error('Error fetching random song:', error);
        }
        setLoading(false);
    };

    return (
        <>

            <button
                onClick={handleClick}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Random Track'}
            </button>

            <ModalWrapper isOpen={!!selectedTrack} onClose={() => setSelectedTrack(null)}>
                {selectedTrack && (
                    <Card
                        title={selectedTrack.title}
                        artist={selectedTrack.artists}
                        url={selectedTrack.url}
                        spoURL={selectedTrack.spoURL}
                        YTURL={fetchYouTubeData(selectedTrack.title + " " + selectedTrack.artists)}
                        popularity={selectedTrack.popularity}
                        type={selectedTrack.type}
                        explicit={selectedTrack.explicit}
                        followers={selectedTrack.followers}
                        description={selectedTrack.description}
                        handleSave={() => { }}
                    />
                )}
            </ModalWrapper>
        </>
    );
}
