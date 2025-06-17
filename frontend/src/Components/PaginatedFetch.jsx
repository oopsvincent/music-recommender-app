// PaginatedFetch.jsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import PlaylistsOverview from './PlaylistOverview';

const PaginatedFetch = ({ endpoint, limit = 10, type = 'album', onSelect }) => {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://music-recommender-api.onrender.com${endpoint}?limit=${limit}&offset=${offset}`, {
        credentials: 'include',
      });
      const data = await res.json();

      const fetchedItems = data.items || data.artists?.items || data.shows?.items || [];
      setItems(fetchedItems);

      setHasNext(!!data.next);
      setHasPrev(offset > 0);
    } catch (err) {
      console.error(`[ERROR] Paginated fetch failed for ${endpoint}`, err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offset, endpoint]);

  const handlePrev = () => setOffset(Math.max(offset - limit, 0));
  const handleNext = () => setOffset(offset + limit);

  const extractCardProps = (item) => {
    switch (type) {
      case 'playlist':
        return {
          url: item.images?.[0]?.url,
          title: item.name,
          artist: item.owner?.display_name,
          spoURL: item.external_urls?.spotify,
          trackURI: item.uri,
          type,
        };
      case 'album':
        return {
          url: item.album?.images?.[0]?.url || item.images?.[0]?.url,
          title: item.name,
          artist: item.artists?.map(a => a.name).join(', '),
          spoURL: item.external_urls?.spotify,
          trackURI: item.uri,
          type,
        };
      case 'artist':
        return {
          url: item.images?.[0]?.url,
          title: item.name,
          artist: 'Artist',
          spoURL: item.external_urls?.spotify,
          trackURI: item.uri,
          type,
        };
      case 'show':
        return {
          url: item.images?.[0]?.url,
          title: item.name,
          artist: item.publisher,
          spoURL: item.external_urls?.spotify,
          trackURI: item.uri,
          type,
        };
      default:
        return {};
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-6">
        
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded bg-gray-700 ${!hasPrev ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-600'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`px-4 py-2 rounded bg-green-600 ${!hasNext ? 'opacity-40 cursor-not-allowed' : 'hover:bg-green-500'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedFetch;
