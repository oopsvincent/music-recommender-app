// src/api/musicApi.js

export async function fetchAllSongs(categoryBaseUrl) {
  if (!categoryBaseUrl || categoryBaseUrl.endsWith('/songs/') || categoryBaseUrl.endsWith('/songs')) {
    console.warn('Invalid categoryBaseUrl:', categoryBaseUrl);
    throw new Error('Invalid categoryBaseUrl — missing category key');
  }

  const url = `${categoryBaseUrl}?offset=0&limit=1000`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network error');

  const data = await response.json();
  return data.results;
}

  
  export function getRandomSongFromList(songsList) {
    const randomIndex = Math.floor(Math.random() * songsList.length);
    return songsList[randomIndex];
  }
  
  export async function fetchMultipleRandomSongsFromAllCategories(categoriesBaseUrls, count = 20) {
    const allSongs = [];
  
    // Fetch all songs from all categories first
    const fetchPromises = categoriesBaseUrls.map(baseUrl => fetchAllSongs(baseUrl));
    const resultsArrays = await Promise.all(fetchPromises);
  
    resultsArrays.forEach(songs => {
      allSongs.push(...songs);
    });
  
    // Shuffle and pick `count` tracks
    const shuffled = allSongs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  