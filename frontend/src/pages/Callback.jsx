// src/pages/Callback.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export default function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthTokens } = useAuth();  // Grab context setter

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (!code) {
      alert("No Spotify code found in URL. Please try logging in again.");
      navigate("/");
      return;
    }

    console.log("🎟 Code received:", code);

    // Step 1: Exchange code → backend (sets session cookie)
    fetch(`https://music-recommender-api.onrender.com/callback?code=${encodeURIComponent(code)}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("✅ Callback success, verifying session...");

        // Step 2: Verify session by calling /me (requires cookie)
        return fetch(`https://music-recommender-api.onrender.com/me`, {
          method: "GET",
          credentials: "include",
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Session verification failed");
        return res.json();
      })
      .then((profileData) => {
        console.log("✅ Session verified, user profile:", profileData);

        // Step 3: Set dummy token to indicate 'authenticated'
        setAuthTokens({ sessionActive: true });  // We're just marking login status

        navigate("/account");
      })
      .catch((error) => {
        console.error("❌ Error during callback/session verification:", error);
        alert("Authentication failed. Please try logging in again.");
        navigate("/");
      });
  }, [location, navigate, setAuthTokens]);

  return <div className='text-white text-center text-xl p-10'>Processing your Spotify login… Please wait.</div>;
}
