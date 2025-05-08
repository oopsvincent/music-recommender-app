// // // src/components/SpotifyCallbackHandler.jsx

// // import { useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const SpotifyCallbackHandler = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     // Extract `code` param from URL
// //     const params = new URLSearchParams(location.search);
// //     const code = params.get("code");

// //     if (code) {
// //       console.log("Authorization code found:", code);

// //       // Send POST request to backend
// //       fetch(`https://music-recommender-api.onrender.com/callback?code=${encodeURIComponent(code)}`, {
// //         method: "GET",
// //         credentials: "include",  // if using cookies or auth
// //       })
// //         .then((response) => {
// //           if (!response.ok) {
// //             throw new Error(`HTTP error! Status: ${response.status}`);
// //           }
// //           return response.json();
// //         })
// //         .then((data) => {
// //           console.log("Server response:", data);

// //           // Clean up URL (remove code param)
// //           navigate(".", { replace: true });
// //         })
// //         .catch((error) => {
// //           console.error("Error during fetch:", error);
// //         });
// //     } else {
// //       console.warn("No 'code' param found in URL.");
// //     }
// //   }, [location, navigate]);

// //   return null; // No UI needed
// // };

// // export default SpotifyCallbackHandler;

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
