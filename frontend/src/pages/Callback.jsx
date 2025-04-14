import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');

    console.log("🌈 Spotify Code from URL:", code); // Log it loud

    if (!code) {
      alert("❌ No Spotify code found. Login again!");
      navigate("/");
      return;
    }

    // Talk to the backend
    fetch(`https://music-recommender-api.onrender.com/callback?${code}`, {
      method: "GET"
    })
      .then(async (res) => {
        console.log("📡 Backend responded with status:", res.status);

        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error("⚠️ Failed to parse JSON from backend:", err);
          throw new Error("Bad JSON format from backend");
        }

        console.log("🧾 Backend response data:", data);

        if (data.error || !data.access_token) {
          alert("❌ Spotify Auth failed! Check console.");
          console.error("🚨 Error details:", data);
          return;
        }

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        console.log("✅ Logged in successfully!", data);

        navigate("/");
      })
      .catch((err) => {
        console.error("🔥 FATAL ERROR during Spotify login:", err);
        alert("Something went wrong during Spotify login.");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Logging in with Spotify... ⏳</h2>
    </div>
  );
}
