// // src/modules/randomTracks.js
// import chipMap from './chiptext';
// import { fetchAllSongs } from './musicApi';
// const randomGenre = getRandomItem(genres);
// const categoryKey = chipMap[randomGenre];

// if (!categoryKey) {
//   console.error(`Invalid category key for genre: ${randomGenre}`);
//   return [];  // abort and return empty
// }

// console.log("Selected Genre:", randomGenre);
// console.log("Category Key:", categoryKey);
// console.log("Fetch URL:", categoryBaseUrl);


// const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

// const generateRandomTracks = async () => {
//   const genres = Object.keys(chipMap);
//   const randomGenre = getRandomItem(genres);
//   const categoryKey = chipMap[randomGenre];

//   const categoryBaseUrl = `https://music-recommender-api.onrender.com/songs/${categoryKey}?offset=0&limit=100`;
//   const allTracks = await fetchAllSongs(categoryBaseUrl);

//   const shuffled = shuffleArray(allTracks);
//   return shuffled.slice(0, 10);
// };

// // Export a PROMISE
// const randomTracksPromise = generateRandomTracks();

// export default randomTracksPromise;
