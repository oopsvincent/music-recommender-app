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

    fetch("https://music-recommender-api.onrender.com/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Spotify Auth failed!");
          console.error(data.details);
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        console.log("Successfully logged in with Spotify:", data);

        navigate("/"); // or to your dashboard
      })
      .catch((err) => {
        console.error("Something went wrong:", err);
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Logging in with Spotify... ⏳</h2>
    </div>
  );
}
