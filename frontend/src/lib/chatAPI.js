// lib/api.js
export async function getMoodSuggestions(message) {
  try {
    const response = await fetch('https://music-recommender-api.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (err) {
    console.error('Error fetching mood suggestions:', err);
    return null;
  }
}
