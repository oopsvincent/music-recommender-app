import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";
import AppBar from "./Components/AppBar";
import Search from "./Components/Search";
import debounce from "lodash.debounce";

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

async function getSpotifyToken() {
    try {
      const response = await fetch('https://flask-app-practice-api.onrender.com/token');
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to fetch Spotify token:", error);
      return null;
    }
  }
  

const SPOTIFY_TOKEN = getSpotifyToken();

function fetchYouTubeData(title) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    title
  )}`;
}

// Fetch Spotify Track Data
async function fetchSpotifyData(title) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      title
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${SPOTIFY_TOKEN}`,
      },
    }
  );

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();

  const track = data.tracks.items[0];
  
  return {
    title: track.name,
    url: track.album.images[0].url,
    artists: track.artists.map((artist) => artist.name).join(", "),
    spoURL: track.external_urls?.spotify || "#",
    popularity: track.popularity,
  };
}

function App() {
  const [trackData, setTrackData] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedSection, setSection] = useState("Music");
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [musicLanguage, setMusicLanguage] = useState(
    localStorage.getItem("musicLanguage")
  );
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadTracks = async (tracks) => {
    try {
        const trackPromises = await tracks.map((title) => fetchSpotifyData(title));
        const results = await Promise.all(trackPromises);
        setTrackData(results);
    } catch (error) {
        console.log(error);
        
    }
};
  
  async function fetchSpotifySearchResults(query) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=28`,
        {
          headers: {
            Authorization: `Bearer ${SPOTIFY_TOKEN}`, // define this in your .env or file
          },
        }
      );
  
      if (!response.ok) throw new Error(`Spotify Error: ${response.status}`);
      const data = await response.json();
  
      if (!data.tracks.items.length) {
        setSearchResults([]); // no results
        return;
      }
  
      const results = data.tracks.items.map((track) => ({
        title: track.name,
        url: track.album.images[0].url,
        artists: track.artists.map((artist) => artist.name).join(", "),
        spoURL: track.external_urls?.spotify || "#",
        popularity: track.popularity,
      }));
      console.log(results);
      
  
      setSearchResults(results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setSearchResults([]);
    }
  }


  const debouncedSearch = useMemo(() => debounce(fetchSpotifySearchResults, 1000), []);

  function handleSearchChange(query) {
    setSearchTerm(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    debouncedSearch(query);
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
    if (!userName || !musicLanguage) {
      setShowLogin(true); // Show login if no user info in localStorage
    }

    loadTracks(tracksDaily);
  }, [userName, musicLanguage]); // Re-fetch if userName or musicLanguage changes

  const handleChipSelect = async (chipText) => {
    try {
        if (chipText === "Hip Hop") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/rap_music");
            const data = await response.json();
            const tracks = data.rap_music || [];
            await loadTracks(tracks);
          } 
          else if (chipText === "Pop") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/pop_music");
            const data = await response.json();
            const tracks = data.pop_music || [];
            await loadTracks(tracks);
          }
          else if (chipText === "Rock") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/rock_music");
            const data = await response.json();
            const tracks = data.rock_music || [];
            await loadTracks(tracks);
          }
          else if (chipText === "Classical") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/classical_music");
            const data = await response.json();
            const tracks = data.classical_music || [];
            await loadTracks(tracks);
          }
          else if (chipText === "Country") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/native_music");
            const data = await response.json();
            const tracks = data.native_music || [];
            await loadTracks(tracks);
          }
          else if (chipText === "Happy") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/happy_music");
            const data = await response.json();
            const tracks = data.happy_music || [];
            await loadTracks(tracks);
          }
          else if (chipText === "Sad") {
            const response = await fetch("https://flask-app-practice-api.onrender.com/songs/sad_music");
            const data = await response.json();
            const tracks = data.sad_music || [];
            await loadTracks(tracks);
          }
           else {
        await loadTracks(tracksDaily);
      }
    } catch (error) {
      console.error("Error fetching track:", error.message);
    }
  };


  return (
    <div
      className={`md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex ${
        selectedSection === "Search" && "justify-start"
      } flex-col justify-between`}
    >
      {/* Render the FirstTimeLogin component if showLogin is true */}
      {showLogin && (
        <div className="h-dvh flex justify-center items-center">
  <div className="max-w-[90%] w-full">
    <FirstTimeLogin onSubmit={handleUserInfo} />
  </div>
</div>

      )}

      {!showLogin && (
        <>
          {/* <div className="flex flex-col justify-around md:flex-row"> */}

          {selectedSection === "Settings" && (
            <>
              <h3 className="boldonse text-xs text-white m-3 flex justify-around items-center">
                Current Music Language: {musicLanguage}
                <button
                  className="bg-white text-xs text-black p-2 ml-5 rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white focus:border-2 transition-all duration-200"
                  onClick={() => setTimeout(() => setShowLogin(true), 500)} // Show the login again when the user wants to change
                >
                  Change
                </button>
              </h3>
            </>
          )}
          {/* </div> */}

          {/* <hr className="text-white m-2" /> */}

          {selectedSection === "Music" && (
            
            <>

              <h1
                className="pt-5 pl-5 text-xl dark:text-white m-1 mb-4 boldonse line-h line-clamp-3 md:text-4xl md:p-4"
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
                  />
                ))}
              </div>
            </>
          )}

{selectedSection === "Search" && (
  <div>
    <Search handleChange={handleSearchChange} />
    <p className="text-white p-5">
      {searchTerm ? `User is searching for: ${searchTerm}` : "Start typing to search for tracks"}
    </p>

    <div className="flex flex-row flex-wrap justify-center mb-5">
      {searchResults.map((track, i) => (
        <Card
          key={i}
          url={track.url}
          title={track.title}
          image={track.url}
          artist={track.artists}
          link={track.spoURL}
          YTURL={fetchYouTubeData(track.title + " " + track.artists)}
          popularity={track.popularity}
        />
      ))}
    </div>
  </div>
)}

        </>
      )}
      <footer className="text-center py-6 px-8 text-white mb-17 relative bottom-0">
        © 2025 Farhan Ali Reza & Soumodip Mondal. All rights reserved. Licensed
        under MIT License.
      </footer>
      <AppBar selectedSection={selectedSection} setSection={setSection} />
    </div>
  );
}

export default App;
