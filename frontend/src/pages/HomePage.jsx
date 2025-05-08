import React, { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import '../App.css'
import Card from "../Components/Card";
import ChipSection from "../Components/ChipSection";
import SpotifyConnect from "../Components/SpotifyConnect";
import FirstTimeLogin from "../Components/FirstTimeLogin";
import AppBar from "../Components/AppBar";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getSpotifyToken, fetchSpotifyData, fetchSpotifySearchResults } from '../hooks/useSpotify';
import loadTracks from "../hooks/useTrackLoader";
import useDebouncedSearch from "../hooks/useDebouncedSearch";
import PWAInstallPrompt from "../Components/PWAInstallPrompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import fetchYouTubeData from "../hooks/useYoutubeSearch";
import { motion } from "framer-motion";
import DataNoticeModal from "../Components/DataNoticeModal";

const tracksDaily = [
    "Bruno Mars - Die With A Smile",
    "take me to church",
    "As it Was",
    "Not Like Us",
    "too sweet hozier",
    "thats so true",
    "apt.",
    "sailor's song",
    "luther",
    "Sweater weather",
    "all the stars",
    "take on me",
    "sunflower",
    "Circles",
    "perfect",
    "SummerTime Sadness",
    "Counting Stars",
    "End of Beginning",
    "Night Changes",
    "beaniw",
    "deathbed",
    "safe and sound",
    "Skyfall",
    "until I found you",
    "despacito",
    "HUMBLE",
];

function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning, ";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon, ";
    } else {
        return "Good Evening, ";
    }
}








function HomePage() {
    const [spotifyToken, setSpotifyToken] = useState(null);
    const [trackData, setTrackData] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [selectedSection, setSection] = useState("Music");
    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [musicLanguage, setMusicLanguage] = useState(
        localStorage.getItem("musicLanguage")
    );
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    //   const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("track");

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState('');
    const [userData, setUserData] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(10); // default limit
    const [selectedTrack, setSelectedTrack] = useState(null); // Assuming you're selecting a track to add to the playlist
    const [isSaved, setIsSaved] = useState(false);

    // Function to handle saving user info
    const handleUserInfo = (name, language) => {
        localStorage.setItem("userName", name);
        // localStorage.setItem("musicLanguage", language);
        setUserName(name);
        // setMusicLanguage(language);
        setShowLogin(false);
    };

    useEffect(() => {
        const fetchTokenAndLoadTracks = async () => {
            const token = await getSpotifyToken();
            setSpotifyToken(token); // Store token in state

            if (userName) {
                await loadTracks(tracksDaily, token, setTrackData, setLoading);

            }
        };

        if (!userName) {
            setShowLogin(true);
        } else {
            fetchTokenAndLoadTracks();
        }
    }, [userName]);

    const getDataFromDB = async (keyOrUrl) => {
        try {
            setLoading(true);
            let url;

            if (keyOrUrl.startsWith("http")) {
                url = keyOrUrl;
            } else {
                url = `https://music-recommender-api.onrender.com/songs/${keyOrUrl}?offset=0&limit=${limit}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            const tracks = data.results || [];

            // ✅ Important: total count is 'total_items', not 'count'
            const totalItems = data.total_items || 0;

            // ✅ Extract offset from URL to calculate current page
            const parsedUrl = new URL(url);
            const offset = parseInt(parsedUrl.searchParams.get("offset")) || 0;

            // ✅ Set pagination states
            setNextUrl(data.next);
            setPrevUrl(data.prev);
            setTotalCount(totalItems);
            setCurrentPage(Math.floor(offset / limit) + 1);

            await loadTracks(tracks, spotifyToken, setTrackData, setLoading);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };



    const chipMap = {
        "Hip Hop": "rap_music",
        "Pop": "pop_music",
        "K-Pop": "k_pop_music",
        "Rock": "rock_music",
        "Classical": "classical_music",
        "Country": "native_music",
        "Blues": "blues_music",
        "Happy": "happy_music",
        "Sad": "sad_music",
        "Jazz": "jazz_music",
        "R & B": "rnb_music",
        "Electronic": "electronic_music",
        "Romantic": "romantic_music",
        "Melancholy": "melancholy_music",
        "Focus": "focus_music",
        "Workout": "workout_music",
        "Motivational": "motivational_music",
        "Instrumental": "instrumental_music",
        "Trending": "trending_music",
        "New Releases": "latest_music",
        "Top 10": "top_music",
        "Hidden Gems": "hidden_gems_music",
        "Developer's Choice": "developers_choice_music",
    };

    const handleChipSelect = async (chipText) => {
        const key = chipMap[chipText];
        try {
            if (key) {
                await getDataFromDB(key);
            } else {
                await loadTracks(tracksDaily, spotifyToken, setTrackData, setLoading);
            }
        } catch (error) {
            console.error("Error fetching track:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex flex-col justify-between`}
        >
            <DataNoticeModal />

            );
            {showLogin && (
                <div className="h-dvh flex justify-center items-center">
                    <div className="max-w-[90%] w-full">
                        <FirstTimeLogin onSubmit={handleUserInfo} />
                    </div>
                </div>
            )}

            {!showLogin && (
                <>
                    <h1
                    className="text-white pt-5 pl-5 text-xl dark:text-white m-1 mb-4 boldonse line-h line-clamp-3 md:text-4xl md:p-4"
                    title={userName}
                >
                    {greetBasedOnTime()} {userName}
                </h1>
                <ChipSection onChipSelect={handleChipSelect} />

                <div className="flex flex-row flex-wrap justify-center mb-5">
                    {loading ? (
                        Array.from({ length: 20 }).map((_, index) => (
                            <div key={index} className="p-2 glassmorpho m-3 rounded-xl">
                                <Skeleton height={200} width={150} />
                                <Skeleton height={25} width={`80%`} style={{ marginTop: 10 }} />
                                <Skeleton height={15} width={`60%`} style={{ marginTop: 5 }} />
                                <Skeleton height={35} width={`100%`} style={{ marginTop: 40 }} />
                                <Skeleton height={35} width={`100%`} style={{ marginTop: 5 }} />
                                <Skeleton height={10} width={`40%`} style={{ marginTop: 5 }} />
                            </div>
                        ))
                    ) : (
                        trackData.map((track, index) => (
                            <Card
                                key={index}
                                url={track.url}
                                title={track.title}
                                artist={track.artists}
                                spoURL={track.spoURL}
                                YTURL={fetchYouTubeData(track.title + " " + track.artists)}
                                popularity={track.popularity}
                                type={track.type}
                                explicit={track.explicit}
                                handleSave={() => {
                                }}
                            />
                        ))
                    )}
                </div>


                <div className="pagination-wrapper flex flex-col items-center gap-3 mt-4">


                    <div className="flex justify-center items-center mb-3">
                        <div className="w-25 h-0.5 bg-white md:w-50 lg:w-75 xl:w-100"></div>
                        <div className="mx-5 text-white">PAGINATION</div>
                        <div className="w-25 h-0.5 bg-white md:w-50 lg:w-75 xl:w-100"></div>
                    </div>

                    {/* First Row: Prev - Page Info - Next */}
                    <div className="flex items-center gap-4">
                        <button
                            className="text-black bg-white rounded-lg px-4 py-2 disabled:opacity-50"
                            disabled={!prevUrl}
                            onClick={() => getDataFromDB(prevUrl)}
                        >
                            ⬅ Prev
                        </button>

                        <p className="text-white text-center">
                            Page <span className="font-bold">{currentPage}</span> of{" "}
                            <span className="font-bold">{Math.ceil(totalCount / limit)}</span>
                        </p>

                        <button
                            className="text-black bg-white rounded-lg px-4 py-2 disabled:opacity-50"
                            disabled={!nextUrl}
                            onClick={() => getDataFromDB(nextUrl)}
                        >
                            Next ➡
                        </button>
                    </div>

                    {/* Second Row: Numbered Pagination Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 text-white m-5">
                        {Array.from({ length: Math.ceil(totalCount / limit) }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => {
                                    const offset = (pageNum - 1) * limit;
                                    const url = new URL(nextUrl || prevUrl || `https://music-recommender-api.onrender.com/songs?offset=${offset}&limit=${limit}`);
                                    url.searchParams.set("offset", offset);
                                    url.searchParams.set("limit", limit);
                                    getDataFromDB(url.toString());
                                }}
                                className={`px-3 py-1 rounded-md font-semibold transition-all duration-200 ${currentPage === pageNum
                                    ? "bg-yellow-400 text-black"
                                    : "bg-gray-800 text-white hover:bg-gray-600"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                </div>

                </>
            )}

            {!showLogin && (
                <AppBar selectedSection={selectedSection} setSection={setSection} />
            )}
            {showInstallButton && (
                <PWAInstallPrompt />
            )}
        </div>
    );
}

export default HomePage;