import { useEffect, useState } from "react";
import "./App.css";
import Card from "./Components/Card";
import ChipSection from "./Components/ChipSection";

const SPOTIFY_TOKEN = "BQBl1T2I8LPoNSz4Q4qOz1vtrJ4r3EZKiQ_9QXDm4kOkUvwtGdmXnA7V8Qkn0QHeZ4J_LRYhM_lCfhrtbFMPFYNeF8DqwWb3f30RbSNeSl2Xn2fhQ42plhmYiP0yEGUgtQDIGqUdr1E";

// Fetch Spotify Track Data
async function fetchSpotifyData(title) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(title)}&type=track&limit=1`,
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

  useEffect(() => {
    // Fetch multiple tracks
    const tracks = ["despacito", "all the stars", "HUMBLE", "Not Like Us", "perfect", "bump heads"];

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
  }, []);

  return (

    <div>
      <h1 className="font-heavy text-6xl dark:text-white m-2 mb-6 font-boldnblack">Hello, Vincent Adam Brown</h1>
      <ChipSection />
      <div className="flex flex-row flex-wrap justify-center">
        {trackData.map((track, index) => (
          <Card
            key={index}
            url={track.url}
            title={track.title}
            artist={track.artists}
            spoURL={track.external_urls?.spotify || '#'}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
