// src/pages/Callback.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      alert("No Spotify code found in URL. Please try logging in again.");
      navigate("/");
      return;
    }

    console.log("🎟 Code received:", code);

    fetch(`https://music-recommender-api.onrender.com/callback?code=${encodeURIComponent(code)}`, {
      method: "GET",
      credentials: "include",  // Because your backend likely sets cookies
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Server responded with:", data);

        // Optional: If backend returns tokens explicitly and you want to store locally
        if (data.access_token && data.refresh_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          console.log("✅ Tokens stored locally (optional)");
        }

        navigate("/account");
      })
      .catch((error) => {
        console.error("❌ Error during callback exchange:", error);
        // alert("Something went wrong during authentication. Please try again.");
        // navigate("/");
      });
  }, [location, navigate]);

  return <div>Processing your Spotify login… Please wait.</div>;
}
