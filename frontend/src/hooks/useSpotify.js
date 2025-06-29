import { useState, useEffect } from "react";

async function getSpotifyToken() {
  try {
    const response = await fetch(
      "https://music-recommender-api.onrender.com/token"
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to fetch Spotify token:", error);
    return null;
  }
}

// Fetch Spotify Track Data
async function fetchSpotifyData(title, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      title
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();

  const track = data.tracks.items[0];
  if (!track)
    return {
      title,
      url: "https://placehold.co/300x300?text=No+Image",
      artists: "Unknown",
      spoURL: "#",
      popularity: 0,
    };

        return {
          title: track.name,
          url: track.album.images[0]?.url,
          artists: track.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
          })),
          spoURL: track.external_urls?.spotify,
          popularity: track.popularity,
          type: "track",
          explicit: track.explicit,
        //   next: nextResults,
        //   prev: prevResults,
          trackURI: track.uri,
          albumID: track.album.id,
        };
}

async function fetchSpotifySearchResults(
  query,
  type,
  setSearchResults,
  setLoading
) {
  try {
    setLoading(true); // Optional: only if you need to show loading state

    const spotifyToken = await getSpotifyToken();
    if (!spotifyToken) {
      console.error("No Spotify token found");
      setSearchResults([]);
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=${type}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

    const resultsArray = data[type + "s"]?.items || [];
    const nextResults = data?.previous;
    const prevResults = data?.next;

    if (!resultsArray.length) {
      setSearchResults([]);
      return;
    }

    const results = resultsArray.map((item) => {
      if (type === "track") {
        return {
          title: item.name,
          url: item.album.images[0]?.url,
          artists: item.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
          })),
          spoURL: item.external_urls?.spotify,
          popularity: item.popularity,
          type: "track",
          explicit: item.explicit,
          trackURI: item.uri,
          albumID: item.album.id,
        };
      } else if (type === "artist") {
        return {
          title: item.name,
          url: item.images?.[0]?.url,
          spoURL: item.external_urls?.spotify,
          popularity: item.popularity,
          followers: item.followers.total,
          type: "artist",
          explicit: item.explicit,
          trackURI: item.uri,
          id: item.id,
        };
      } else if (type === "album") {
        return {
          id: item.id,
          title: item.name,
          url: item.images?.[0]?.url,
          artists: item.artists.map((artist) => ({
            name: artist.name,
            id: artist.id,
          })),
          type: "album",
          explicit: item.explicit,
          trackURI: item.uri,
        };
      } else if (type === "playlist") {
        return {
          id: item?.id,
          title: item?.name || "#",
          url: item?.images?.[0]?.url || "#",
          owner: item?.owner?.display_name,
          spoURL: item?.external_urls?.spotify || "#",
          trackURI: item?.uri,
          public: item?.public,
          type: "playlist",
        };
      } else if (type === "show") {
        return {
          title: item.name,
          url: item.images?.[0]?.url,
          artists: item.publisher + item.languages,
          spoURL: item.external_urls?.spotify,
          description: item.description,
          type: "show",
          explicit: item.explicit,
          next: nextResults,
          prev: prevResults,
          // trackURI: item.uri,
        };
      } else if (type === "episode") {
        return {
          title: item.name,
          url: item.images?.[0]?.url,
          artists: item.type + ", " + item.languages,
          spoURL: item.external_urls?.spotify,
          description: item.description,
          type: "episode",
          explicit: item.explicit,
          next: nextResults,
          prev: prevResults,
          // trackURI: item.uri,
        };
      }
    });

    setSearchResults(results);
  } catch (err) {
    console.error("Error fetching search results:", err);
    setSearchResults([]);
  } finally {
    setLoading(false); // Optional, only if used
  }
}

export { getSpotifyToken, fetchSpotifyData, fetchSpotifySearchResults };
