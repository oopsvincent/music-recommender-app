// src/components/RandomTrackButton.jsx
import { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { TrackCard } from './CardComponents/TracksCard';
import { getSpotifyToken } from '../hooks/useSpotify';
import loadTracks from '../hooks/useTrackLoader';
import fetchYouTubeData from '../hooks/useYoutubeSearch';
import { motion } from 'framer-motion';
import { RefreshCcw, Dice5, Dice1, Dice2, Dice3, Dice4, Dice6 } from 'lucide-react';

export default function RandomTrackButton({ categoryBaseUrl }) {
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spin, setSpin] = useState(false);

  let randomNum = Math.floor((Math.random * 6) + 1)

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getSpotifyToken();
      setSpotifyToken(token);
    };
    fetchToken();
  }, []);

  const fetchRandomTrack = async () => {
    if (!categoryBaseUrl || categoryBaseUrl.endsWith('/songs/')) {
      console.warn('No genre selected.');
      return null;
    }

    const { fetchAllSongs, getRandomSongFromList } = await import('../modules/musicApi');
    const songsList = await fetchAllSongs(categoryBaseUrl);
    const randomSong = getRandomSongFromList(songsList);
    const enrichedTracks = await loadTracks([randomSong], spotifyToken);

    return {
      ...enrichedTracks[0],
      explicit: randomSong.explicit ?? enrichedTracks[0].explicit,
      popularity: randomSong.popularity ?? enrichedTracks[0].popularity,
      type: 'track',
    };
  };

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setSpin(true);

    try {
      const track = await fetchRandomTrack();
      if (track) setSelectedTrack(track);
    } catch (error) {
      console.error('Error fetching track:', error);
    }

    setTimeout(() => setSpin(false), 700); // Reset spin after animation
    setLoading(false);
  };

  return (
    <>
      {/* 🔘 Compact Icon-Only Random Track Button */}
      <motion.button
        onClick={handleClick}
        disabled={loading}
        className={`bg-[#D40000] ${selectedTrack ? "z-151" : "z-50"} rounded-full p-3 fixed md:bottom-22 bottom-40 right-8 text-white shadow-lg hover:bg-red-700 active:scale-90 transition-transform`}
        title="Random Track"
      >
        <motion.div
          animate={spin ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <Dice5 size={24} />
        </motion.div>
      </motion.button>

      {/* 🎵 Modal with Random Track */}
      <ModalWrapper isOpen={!!selectedTrack} onClose={() => setSelectedTrack(null)}>
        {selectedTrack && (
          <>
            <TrackCard
              title={selectedTrack.title}
              artist={selectedTrack.artists}
              explicit={selectedTrack.explicit}
              popularity={selectedTrack.popularity}
              url={selectedTrack.url}
              spoURL={selectedTrack.spoURL}
              YTURL={fetchYouTubeData(`${selectedTrack.title} ${selectedTrack.artists}`)}
              type={selectedTrack.type}
              trackURI={selectedTrack.trackURI}
              handleSave={() => {}}
            />

            {/* 🔁 Modal Refresh Button */}
            {/* <motion.button
              onClick={handleClick}
              disabled={loading}
              className="absolute bottom-5 right-5 bg-[#D40000] text-white rounded-full p-3 shadow-lg hover:bg-red-700"
              title="Refresh Track"
            >
              <motion.div
                animate={spin ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <RefreshCcw size={20} />
              </motion.div>
            </motion.button> */}
          </>
        )}
      </ModalWrapper>
    </>
  );
}
