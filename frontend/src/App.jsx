import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";
import AppBar from "./Components/AppBar";
import Search from "./Components/Search";
import debounce from "lodash.debounce";
import Account from "./Components/Account";

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

async function getSpotifyToken() {
  try {
    const response = await fetch(
      "https://flask-app-practice-api.onrender.com/token"
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to fetch Spotify token:", error);
    return null;
  }
}

// const SPOTIFY_TOKEN = getSpotifyToken().then(token => {
//   SPOTIFY_TOKEN = token
// });

function fetchYouTubeData(title) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    title
  )}`;
}

// Fetch Spotify Track Data
async function fetchSpotifyData(title, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      title
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();

  const track = data.tracks.items[0];
  if (!track)
    return {
      title,
      url: "https://placehold.co/300x300?text=No+Image",
      artists: "Unknown",
      spoURL: "#",
      popularity: 0,
    };

  return {
    title: track.name,
    url: track.album.images[0].url,
    artists: track.artists.map((artist) => artist.name).join(", "),
    spoURL: track.external_urls?.spotify || "#",
    popularity: track.popularity,
    type: "track",
    explicit: track.explicit,
  };
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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // block auto-prompt
      setDeferredPrompt(e);
      setShowInstallButton(true); // show custom "Install" button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const loadTracks = async (tracks, token) => {
    try {
      const trackPromises = tracks.map((title) =>
        fetchSpotifyData(title, token)
      );
      const results = await Promise.all(trackPromises);
      setTrackData(results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  async function fetchSpotifySearchResults(query, type) {
    try {
      if (!spotifyToken) return;
  
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=${type}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
      });
  
      const data = await response.json();
      console.log("API Response:", data);
      
      const resultsArray = data[type + "s"]?.items || [];
  
      if (!resultsArray.length) {
        setSearchResults([]);
        return;
      }
      console.log(searchResults);
      
    //   console.log(data[type + "s"].items[0].external_urls.spotify);
    // const validPlaylists = data.playlists.items.filter(p => p !== null);
    // setSearchResults(validPlaylists);
    
      // You can later switch logic per type
      const results = resultsArray.map((item) => {
        if (type === "track") {
          return {
            title: item.name,
            url: item.album.images[0]?.url,
            artists: item.artists.map((artist) => artist.name).join(", "),
            SPOurl: item.external_urls?.spotify,
            popularity: item.popularity,
            type: "track",
            explicit: item.explicit,
          };
        } else if (type === "artist") {
          return {
            title: item.name,
            url: item.images?.[0]?.url,
            SPOurl: item.external_urls?.spotify,
            popularity: item.popularity,
            followers: item.followers.total,
            type: "artist",
            explicit: item.explicit,
          };
        }
         else if (type === "album") {
            return {
                title: item.name,
                url: item.images?.[0]?.url,
                artists: item.artists.map((artist) => artist.name).join(", "),
                SPOurl: item.external_urls?.spotify,
                description: item.album_type + ", tracks: " + item.total_tracks,
                popularity: item.release_date,
                type: "album",
                explicit: item.explicit,
            }
        }
         else if (type === "playlist") {
            return{
                title: item?.name || "#",
                url: item?.images?.[0]?.url || "#",
                artists: item?.type,
                SPOurl: item?.external_urls?.spotify || "#",
                // description: item.album_type + ", tracks: " + item.total_tracks,
                popularity: item?.owner?.display_name,
                type: "playlist",
                // explicit: item.explicit,
            }
         } else if (type === "show") {
            return {
                title: item.name,
                url: item.images?.[0]?.url,
                artists: item.publisher + item.languages,
                SPOurl: item.external_urls?.spotify,
                description: item.description,
                type: "show",
                explicit: item.explicit,
            }
        } else if (type === "episode") {
            return {
                title: item.name,
                url: item.images?.[0]?.url,
                artists: item.type + ", " + item.languages,
                SPOurl: item.external_urls?.spotify,
                description: item.description,
                type: "episode",
                explicit: item.explicit,
            }
        }
      });
  
      setSearchResults(results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }
  
  const debouncedSearch = useMemo(() => {
    return debounce((query, type) => {
      if (spotifyToken) {
        fetchSpotifySearchResults(query, type);
      }
    }, 1000);
  }, [spotifyToken]);
  

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
        await loadTracks(tracksDaily, token);
      }
    };

    if (!userName || !musicLanguage) {
      setShowLogin(true);
    } else {
      fetchTokenAndLoadTracks();
    }
  }, [userName, musicLanguage]);

  const getDataFromDB = async (key) => {
    const response = await fetch(
      `https://flask-app-practice-api.onrender.com/songs/${key}`
    );
    const data = await response.json();
    const tracks = data[key] || [];
    await loadTracks(tracks, spotifyToken);
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
        await loadTracks(tracksDaily, spotifyToken);
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
          {trackData.map((track, index) => (
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
          ))}
        </div>
      </>
    ),
    Search: (
      <div>
        <Search handleChange={handleSearchChange} />
        <p className="text-white p-5">
          {searchTerm
            ? `User is searching for: ${searchTerm}`
            : "Start typing to search for tracks"}
        </p>

        <div className="flex flex-row flex-wrap justify-center mb-5">
          {searchResults.map((track, i) => (
            <Card
              key={i}
              url={track.url}
              title={track.title}
              image={track.url}
              artist={track.artists}
              link={track.url}
              spoURL={track.SPOurl}
              YTURL={searchType !== 'track' ? fetchYouTubeData(track.title) : fetchYouTubeData(track.title + " " + track.artists)}
              popularity={track.popularity}
              type={track.type}
              followers={track.followers}
              description={track.description}
              explicit={track.explicit}
            />
          ))}
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
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className="install-btn bg-black p-5 text-2xl text-white"
          >
            Install this fire app
          </button>
        )}
      </>
    ),
  };

  return (
    <div
      className={`md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex ${
        selectedSection === "Search" && "justify-start"
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
          {loading && <p className="text-white text-3xl">Loading</p>}
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
