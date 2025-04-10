const CLIENT_ID = "dfb7849d0239459f9bcc03bf8dd931ca";
const REDIRECT_URI = "http://localhost:5173/callback"; 
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-private",
  "user-read-playback-state",
  "user-modify-playback-state"
].join(" ");

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

const connectToSpotify = () => {
  window.location.href = AUTH_URL; // Redirects user to Spotify login
};


const SpotifyConnect = () => {
  return (
<button onClick={connectToSpotify} className="bg-green-500 text-white px-4 py-2 rounded">
  Connect to Spotify
</button>

  )
}

export default SpotifyConnect