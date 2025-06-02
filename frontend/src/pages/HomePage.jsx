import React, { useEffect, useState } from "react";
import '../App.css';
import Card from "../Components/Card";
import TrackCard from "../Components/TracksCard";
import ChipSection from "../Components/ChipSection";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getSpotifyToken } from '../hooks/useSpotify';
import loadTracks from "../hooks/useTrackLoader";
import fetchYouTubeData from "../hooks/useYoutubeSearch";
import DataNoticeModal from "../Components/DataNoticeModal";
import Greet from "../Components/Greet";
import RandomTrackButton from "../Components/RandomTrackButton";
import Pagination from "../Components/Pagination";
import chipMap from "../modules/chipText";
import { handleChipSelect } from "../modules/chipSelector";
import { fetchTracksFromDB } from "../modules/trackFetcher";
import dailyTracks from "../modules/dailyTracks";
// import SpotifyPlayer from "../Components/SpotifyPlayer";

function HomePage({ userName }) {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [trackData, setTrackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ nextUrl: null, prevUrl: null, totalCount: 0, currentPage: 1 });
  const [chipKey, setChipKey] = useState('');
  const limit = 10;

  useEffect(() => {
    const fetchTokenAndLoadTracks = async () => {
      const token = await getSpotifyToken();
      setSpotifyToken(token);
      if (userName) {
        await loadTracks(dailyTracks, token, setTrackData, setLoading);
      }
    };
    fetchTokenAndLoadTracks();
  }, [userName]);

  const getDataFromDB = (keyOrUrl) =>
    fetchTracksFromDB({
      keyOrUrl,
      limit,
      spotifyToken,
      setTrackData,
      setPaginationStates: setPagination,
      setLoading,
    });
    
  return (
    <div className="md:pl-10 md:pr-10 lg:pl-40 lg:pr-40 h-at-min relative flex flex-col justify-between select-none">
      <DataNoticeModal />
      <Greet />
      <ChipSection onChipSelect={(chipText) => handleChipSelect({
        chipText,
        chipMap,
        setChipKey,
        spotifyToken,
        setTrackData,
        setPaginationStates: setPagination,
        setLoading,
      })} />

      {chipKey && <RandomTrackButton categoryBaseUrl={`https://music-recommender-api.onrender.com/songs/${chipKey}`} />}

      <div className="flex flex-row flex-wrap justify-center mb-5">
        {loading ? Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} height={250} width={160} className="m-2 rounded-xl glassmorpho" />
        )) : trackData.map((track, index) => {
  const isArtist = track.type === 'artist';
  return (
    <TrackCard
      key={index}
      title={track.title}
      artist={track.artists}
      url={track.url}
      spoURL={track.spoURL}
      YTURL={fetchYouTubeData(`${track.title} ${track.artists}`)}
      popularity={track.popularity}
      type={track.type}
      explicit={track.explicit}
      trackURI={track.trackURI}
      // Only pass followers for artists
      {...(isArtist && { followers: track.followers })}
      handleSave={() => {}}
    />
  );
})}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={Math.ceil(pagination.totalCount / limit)}
        prevUrl={pagination.prevUrl}
        nextUrl={pagination.nextUrl}
        getDataFromDB={getDataFromDB}
      />
      {/* <SpotifyPlayer /> */}
    </div>
  );
}

export default HomePage;
