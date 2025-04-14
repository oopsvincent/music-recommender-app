// src/pages/Callback.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      alert("No Spotify code found. Login again!");
      navigate("/");
      return;
    }

    // Send code to backend to exchange it for tokens
    fetch("https://music-recommender-api.onrender.com/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.access_token) {
          alert("Spotify Auth failed!");
          console.error("Error details:", data);
          return;
        }

        // Store tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        console.log("Successfully logged in with Spotify:", data);

        // Navigate to your dashboard or home
        navigate("/");
      })
      .catch((err) => {
        console.error("Something went wrong:", err);
        alert("Something went wrong during Spotify login.");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Logging in with Spotify... ⏳</h2>
    </div>
  );
}
