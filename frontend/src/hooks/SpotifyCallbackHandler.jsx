// // src/components/SpotifyCallbackHandler.jsx
// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function SpotifyCallbackHandler() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const code = new URLSearchParams(location.search).get("code");

//     if (!code) {
//       console.warn("No 'code' param found in URL.");
//       return;
//     }

//     console.log("Authorization code found:", code);

//     fetch(`https://music-recommender-api.onrender.com/callback?code=${encodeURIComponent(code)}`, {
//       method: "GET",
//       credentials: "include",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Server response:", data);
//         navigate(".", { replace: true });
//       })
//       .catch((err) => {
//         console.error("Error during fetch:", err);
//       });

//   }, [location, navigate]);

//   return null; // No UI needed
// }
