import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";
import AppBar from "./Components/AppBar";
import SearchComp from "./Components/Search";
import debounce from "lodash.debounce";
import Account from "./Components/Account";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getSpotifyToken, fetchSpotifyData, fetchSpotifySearchResults } from './hooks/useSpotify';
import loadTracks from "./hooks/useTrackLoader";
import useDebouncedSearch from "./hooks/useDebouncedSearch";
import PWAInstallPrompt from "./Components/PWAInstallPrompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons'



const tracksDaily = [
    "Die With a smile",
    "thats so true",
    "Not Like Us",
    "apt.",
    "sailor's song",
    "luther",
    "Sweater weather",
    "all the stars",
    "take on me",
    "sunflower",
    "Circles",
    "too sweet hozier",
    "SummerTime Sadness",
    "Counting Stars",
    "End of Beginning",
    "As it Was",
    "Night Changes",
    "beaniw",
    "deathbed",
    "safe and sound",
    "Skyfall",
    "until I found you",
    "despacito",
    "HUMBLE",
    "perfect",
    "bump heads",
    "Havana",
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

function removeData() {
    localStorage.clear();
    window.location.reload();
}



function fetchYouTubeData(title) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
        title
    )}`;
}



function App() {
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
    // useEffect(() => {
    //     // pretend you're fetching
    //     fetch().then(() => setLoading(false));
    //   }, []);


    const debouncedSearch = useDebouncedSearch(searchTerm, searchType, setLoading, setSearchResults);

    function handleSearchChange(query, type) {
        setSearchTerm(query);
        setSearchType(type);
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }
        debouncedSearch(query, type); // ✅ Correct
    }


    // Function to handle saving user info
    const handleUserInfo = (name, language) => {
        localStorage.setItem("userName", name);
        localStorage.setItem("musicLanguage", language);
        setUserName(name);
        setMusicLanguage(language);
        setShowLogin(false);
    };

    useEffect(() => {
        const fetchTokenAndLoadTracks = async () => {
            const token = await getSpotifyToken();
            setSpotifyToken(token); // Store token in state

            if (userName && musicLanguage) {
                await loadTracks(tracksDaily, token, setTrackData, setLoading);

            }
        };

        if (!userName || !musicLanguage) {
            setShowLogin(true);
        } else {
            fetchTokenAndLoadTracks();
        }
    }, [userName, musicLanguage]);

    const getDataFromDB = async (key) => {
        setLoading(true);
        const response = await fetch(
            `https://music-recommender-api.onrender.com/songs/${key}?offset=0&limit=20`
        ).then(setLoading(false));
        const data = await response.json();
        const next = data.next_offset;
        const tracks = data["results"] || [];
        await loadTracks(tracks, spotifyToken, setTrackData, setLoading);
    };

    const handleChipSelect = async (chipText) => {
        try {
            if (chipText === "Hip Hop") {
                getDataFromDB("rap_music");
            } else if (chipText === "Pop") {
                getDataFromDB("pop_music");
            } else if (chipText === "Rock") {
                getDataFromDB("rock_music");
            } else if (chipText === "Classical") {
                getDataFromDB("classical_music");
            } else if (chipText === "Country") {
                getDataFromDB("native_music");
            } else if (chipText === "Happy") {
                getDataFromDB("happy_music");
            } else if (chipText === "Sad") {
                getDataFromDB("sad_music");
            } else if (chipText === "Jazz") {
                getDataFromDB("jazz_music");
            } else if (chipText === "R & B") {
                getDataFromDB("rnb_music");
            } else if (chipText === "Electronic") {
                getDataFromDB("party_music");
            } else {
                await loadTracks(tracksDaily, spotifyToken, setTrackData, setLoading);
            }
        } catch (error) {
            console.error("Error fetching track:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const sections = {
        Music: (
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
                            <div key={index} className="p-4">
                                <Skeleton height={200} width={150} />
                                <Skeleton height={30} width={`80%`} style={{ marginTop: 10 }} />
                                <Skeleton height={20} width={`60%`} style={{ marginTop: 5 }} />
                                <Skeleton height={20} width={`100%`} style={{ marginTop: 5 }} />
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
                            />
                        ))
                    )}
                </div>
            </>
        ),
        Search: (
            <div>
                <SearchComp handleChange={handleSearchChange} />
                <p className="text-white p-5">
                    {searchTerm
                        ? `User is searching for: ${searchTerm}`
                        : "Start typing to search for tracks"}
                </p>

                <div className="flex flex-row flex-wrap justify-center mb-5">
                    {loading ? (
                        Array.from({ length: 20 }).map((_, index) => (
                            <div key={index} className="p-4">
                                <Skeleton height={200} width={200} />
                                <Skeleton height={30} width={`80%`} style={{ marginTop: 10 } } />
                                <Skeleton height={20} width={`60%`} style={{ marginTop: 5 }} />
                            </div>
                        ))
                    ) : (
                        (searchTerm ? searchResults : trackData).map((track, index) => (                          
                            <Card
                            followers={track.followers}
                                key={index}
                                url={track.url}
                                title={track.title}
                                artist={track.artists}
                                spoURL={track.spoURL}
                                YTURL={fetchYouTubeData(track.title + " " + track.artists)}
                                popularity={track.popularity}
                                type={track.type}
                                explicit={track.explicit}
                            />
                        ))
                    )}

                </div>
            </div>
        ),
        Settings: (
            <div>
                <h3 className="text-2xl text-white m-3 flex justify-around items-center">
                    Current Music Language: {musicLanguage}
                    <button
                        className="bg-white text-black p-2 ml-5 rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white focus:border-2 transition-all duration-200"
                        onClick={() => setTimeout(() => setShowLogin(true), 500)} // Show the login again when the user wants to change
                    >
                        Change
                    </button>
                </h3>
                <h3 className="font-h text-2xl text-white m-3 flex justify-around items-center">
                    Delete Your Information
                    <button
                        onClick={() => setTimeout(() => removeData(), 1500)}
                        className="bg-black p-3 text-red-500 border-2 rounded-2xl hover:rounded-md hover:border-0 hover:bg-red-500 hover:text-black active:bg-red-400 active:text-white transition-all duration-200"
                    >
                        Delete Account
                    </button>
                </h3>
            </div>
        ),
        Account: (
            <>
                <Account
                    src={"https://placehold.co/120"}
                    username={userName}
                    email={`${userName}@example.com`}
                    followers={Math.floor(Math.random() * Math.random() * 1000)}
                />{" "}

        <button onClick={() => window.open('https://music-recommender-api.onrender.com/login')} className='inline-flex justify-center items-center px-5 py-2 m-5 bg-green-500 text-white text-xl gap-5 hover:text-black hover:scale-110 active:text-black active:scale-90 transition-all duration-200 rounded-2xl'>
            Login with Spotify
            <FontAwesomeIcon icon={faSpotify} className="text-4xl" />
        </button>

                {showInstallButton && (
                    <PWAInstallPrompt />
                )}
            </>
        ),
    };

    return (
        <div
            className={`md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex ${selectedSection === "Search" && "justify-start"
                } flex-col justify-between`}
        >
            {showLogin && (
                <div className="h-dvh flex justify-center items-center">
                    <div className="max-w-[90%] w-full">
                        <FirstTimeLogin onSubmit={handleUserInfo} />
                    </div>
                </div>
            )}

            {!showLogin && (
                <>
                    {selectedSection === "Settings" && sections[selectedSection]}

                    {selectedSection === "Music" && sections[selectedSection]}

                    {selectedSection === "Search" && sections[selectedSection]}

                    {selectedSection === "Account" && sections[selectedSection]}
                    {/*loading && <Skeleton containerClassName="flex flex-row flex-wrap gap-1 m-5" width={170} height={250} count={10} />*/}
                </>
            )}
            <footer className="text-center py-6 px-8 text-white mb-17 relative bottom-0">
                © 2025 Farhan Ali Reza & Soumodip Mondal. All rights reserved. Licensed
                under MIT License.
            </footer>
            {!showLogin && (
                <AppBar selectedSection={selectedSection} setSection={setSection} />
            )}
        </div>
    );
}

export default App;
