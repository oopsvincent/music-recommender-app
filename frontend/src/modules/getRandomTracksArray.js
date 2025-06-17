import chipMap from "./ChipMap.js";

/**
 * Gets a specified number of random keys from an object.
 * @param {Object} obj - The object to pick keys from.
 * @param {number} numberOfKeys - Number of keys to pick.
 * @returns {Array} An array of selected random keys.
 */
function getRandomKeysFromObject(obj, numberOfKeys) {
  const keys = Object.keys(obj);
  const shuffled = keys.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfKeys);
}

/**
 * Fetches 2 songs from each of 5 random genres from chipMap.
 * @returns {Promise<Array>} Flattened array of fetched songs (max 10 total).
 */
export async function getArrayOFRandomTracks() {
  const selectedGenres = getRandomKeysFromObject(chipMap, 5); // 5 genres
  const fetchedBlocks = await Promise.all(
    selectedGenres.map(async (genreKey) => {
      const genreId = chipMap[genreKey];
      try {
        const initRes = await fetch(`https://music-recommender-api.onrender.com/songs/${genreId}?limit=1`);
        if (!initRes.ok) throw new Error(`Initial fetch failed: ${initRes.statusText}`);

        const initData = await initRes.json();
        const totalItems = initData.total_items;

        if (!totalItems || totalItems < 1) return null;

        const maxOffset = Math.max(totalItems - 2, 0); // avoid empty fetch
        const offset = Math.floor(Math.random() * (maxOffset + 1));

        const finalRes = await fetch(`https://music-recommender-api.onrender.com/songs/${genreId}?limit=2&offset=${offset}`);
        if (!finalRes.ok) throw new Error(`Final fetch failed: ${finalRes.statusText}`);

        const finalData = await finalRes.json();
        return finalData?.results || [];

      } catch (err) {
        console.error(`Error fetching genre "${genreKey}":`, err.message);
        return null;
      }
    })
  );

  return fetchedBlocks.filter(Boolean).flat(); // flatten and remove nulls
}
