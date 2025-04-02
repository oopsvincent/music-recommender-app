import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";
import AppBar from "./Components/AppBar";

const SPOTIFY_TOKEN =
  "BQDVOx4Mfc1Dz0kVat7p03OsWYWzeMeDhMu5XPHaeun99uW8TZ1Lh1_2IuEU09Nw-kJ6my5Oz3At6Vh349XdxvVK2xidyFWaQiXxmjzxfl47QbFO7FxzPrO-ukKwcHF9tdQrFmA8omo";
// async function getUserPlaylists(accessToken) {
//   const response = await fetch("https://api.spotify.com/v1/me/playlists", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch playlists");
//   }

//   const data = await response.json();
//   console.log(data); 
//   console.log(data.items);
//   return data.items; 
// }

// getUserPlaylists(SPOTIFY_TOKEN);

async function fetchYouTubeData(title) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      title
    )}&key=YOUR_YOUTUBE_API_KEY`
  );

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();

  if (!data.items.length) throw new Error("No videos found!");

  // Get the first video URL
  const videoId = data.items[0].id.videoId;
  return `https://www.youtube.com/watch?v=${videoId}`;
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
  console.log(track);

  return {
    title: track.name,
    url: track.album.images[0].url,
    artists: track.artists.map((artist) => artist.name).join(", "),
    spoURL: track.external_urls?.spotify || "#",
  };
}

function App() {
  const [trackData, setTrackData] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [musicLanguage, setMusicLanguage] = useState(
    localStorage.getItem("musicLanguage")
  );

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
    "too sweet",
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
    <div className="md:ml-40 md:mr-40">
      {/* Render the FirstTimeLogin component if showLogin is true */}
      {showLogin && (
        <div className="h-dvh md:flex md:justify-center md:items-center">
          <FirstTimeLogin onSubmit={handleUserInfo} />
        </div>
      )}

      {!showLogin && (
        <>
        <div className="flex flex-col justify-around md:flex-row">
          <h1 className="pt-5 pl-5 text-2xl dark:text-white m-1 mb-4 boldonse line-h line-clamp-3 md:text-4xl md:p-4" title={userName}>
            Hello, {userName}
          </h1>
          <h3 className="boldonse text-xs text-white m-3 flex justify-around items-center">
            Current Music Language: {musicLanguage}
            <button
              className="bg-white text-xs text-black p-2 ml-5 rounded-lg"
              onClick={() => setShowLogin(true)} // Show the login again when the user wants to change
            >
              Change
            </button>
          </h3>
        </div>
          <hr className="text-white m-2" />

          <ChipSection onChipSelect={handleChipSelect} />


          <div className="flex flex-row flex-wrap justify-center">
            {trackData.map((track, index) => (
              <Card
                key={index}
                url={track.url}
                title={track.title}
                artist={track.artists}
                spoURL={track.spoURL}
              />
            ))}
          </div>
        </>
      )}
<footer className="text-center py-6 px-8 text-gray-400 mb-20">
  © 2025 Farhan Ali Reza & Soumodip Mondal. All rights reserved. Licensed under MIT License.
</footer>
      <AppBar />


    </div>
  );
}

export default App;
