import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";
import AppBar from "./Components/AppBar";
import Search from "./Components/Search";
import NotificationButton from "./Components/NotificationButton";

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

const SPOTIFY_TOKEN =
  "BQDINxZ_S8oj36NEBFNeLKm_p0rviH1mBRFB1ryH6V9D6CGxrvZ4liwzuC0iWPPURzb11h6fWchBEa5F9UMBWHtX3dgMEAcTIoU2gXm_nwaF0Lxdpv4bdpNaG_tHOq0bVztO7DfV6WQ";

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

  if (!data.tracks.items.length) throw new Error("No tracks found!");

  const track = data.tracks.items[0];
  //   console.log(track);
  //   console.log(track.external_urls.spotify);

  return {
    title: track.name,
    url: track.album.images[0].url,
    artists: track.artists.map((artist) => artist.name).join(", "),
    spoURL: track.external_urls?.spotify || "#",
  };
}

async function fetchSpotifySearchResults(query) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
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
        url: track.album.images[0]?.url,
        artists: track.artists.map((artist) => artist.name).join(", "),
        spoURL: track.external_urls?.spotify || "#",
      }));
  
      setSearchResults(results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setSearchResults([]);
    }
  }
  
  Notification.requestPermission().then(function(permission) {
    if (permission === "granted") {
      console.log("Permission granted for notifications!");
    } else {
      console.log("No soup for you! (Permission denied)");
    }
  });

  function notifyUser() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification("🎧 Ready to vibe?", {
            body: "Your daily track recommendations are here!",
          });
        }
      });
    } else {
      sendNotification("🎧 Music time!", {
        body: "Click to play your favorite jam.",
      });
    }
  }

function App() {
  const [trackData, setTrackData] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedSection, setSection] = useState("Music");
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [musicLanguage, setMusicLanguage] = useState(
    localStorage.getItem("musicLanguage")
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  function handleSearchChange(query) {
    setSearchTerm(query);
  
    if (query.trim() === "") {
      setSearchResults([]); // Clear search results if input is empty
      return;
    }
  
    fetchSpotifySearchResults(query); // Custom function to get 20 results
  }
  

  // Function to handle saving user info
  const handleUserInfo = (name, language) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("musicLanguage", language);
    setUserName(name);
    setMusicLanguage(language);
    setShowLogin(false); // Hide the FirstTimeLogin component after saving info
  };

  useEffect(() => {
    if (!userName || !musicLanguage) {
      setShowLogin(true); // Show login if no user info in localStorage
    }

    // Fetch multiple tracks
    const tracks = [
      "too sweet hozier",
      "SummerTime Sadness",
      "Counting Stars",
      "End of Beginning",
      "As it Was",
      "Night Changes",
      "Die With a smile",
      "beaniw",
      "deathbed",
      "safe and sound",
      "Skyfall",
      "until I found you",
      "Sweater weather",
      "despacito",
      "all the stars",
      "HUMBLE",
      "Not Like Us",
      "perfect",
      "bump heads",
      "Havana",
    ];

    const loadTracks = async () => {
      try {
        const trackPromises = tracks.map((title) => fetchSpotifyData(title));
        const results = await Promise.all(trackPromises);
        setTrackData(results);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
      }
    };

    loadTracks();
  }, [userName, musicLanguage]); // Re-fetch if userName or musicLanguage changes

  const handleChipSelect = async (chipText) => {
    try {
      if (chipText === "Pop") {
        const response = await fetch("/EnglishPopSongs.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Ensure 'song' exists before using it

        // for (let i = 0; i < 20; i++) {
        //     let rand = Math.floor((Math.random() * data.length + 1));
        //     const song = data[rand];
        //     const newTrack = await fetchSpotifyData(song);
        //     setTrackData((prevData) => [newTrack, ...prevData]);
        // }

        // const song = data[0]; // Example: Using the first song in the array
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
              <NotificationButton />
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

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
      {searchResults.map((track, i) => (
        <Card
          key={i}
          title={track.title}
          image={track.url}
          artist={track.artists}
          link={track.spoURL}
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
