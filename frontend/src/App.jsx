import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";
import SpotifyConnect from "./Components/SpotifyConnect";
import FirstTimeLogin from "./Components/FirstTimeLogin";

const SPOTIFY_TOKEN =
  "BQAxVLPA5rk7rV5AHBR52yjYOcIQ-WyM0gP28HE1sq1oBlRx1LMeDhPklQbHLf3IoSU7nMgIDAehboGjxq_gMfWw2ZGqD835SwgwQsT1rk-zHIfZojCRTAsn6olk5cR7oLeLY2OPoOU";
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
  };
}

function App() {
  const [trackData, setTrackData] = useState([]);
  const [showLogin, setShowLogin] = useState(false); // State to control the display of FirstTimeLogin
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
      "SummerTime Sadness",
      "Skyfall",
      "until I found you",
      "Sweater weather",
      "despacito",
      "all the stars",
      "HUMBLE",
      "Not Like Us",
      "perfect",
      "bump heads",
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
          <h1 className="text-2xl dark:text-white m-1 mb-4 boldonse line-h line-clamp-3 md:text-4xl md:p-4" title={userName}>
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

          <ChipSection />
          <div className="flex flex-row flex-wrap justify-center">
            {trackData.map((track, index) => (
              <Card
                key={index}
                url={track.url}
                title={track.title}
                artist={track.artists}
                spoURL={track.external_urls?.spotify || "#"}
              />
            ))}
          </div>
        </>
      )}

<footer className="text-center py-4 text-gray-400">
  © 2025 Vincent Brown. All rights reserved. Licensed under MIT License.
</footer>

    </div>
  );
}

export default App;
