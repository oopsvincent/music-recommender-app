import React, { useState, useEffect } from 'react';

export default function TracksDaily({ categoriesBaseUrls }) {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadTracks = async () => {
        try {
          const { fetchMultipleRandomSongsFromAllCategories } = await import('../modules/musicApi');
          const songs = await fetchMultipleRandomSongsFromAllCategories(categoriesBaseUrls, 20);
          setTracks(songs);
          console.log(songs);
          
        } catch (error) {
          console.error('Error loading tracks daily:', error);
        }
        setLoading(false);
      };
  
      loadTracks();
    }, [categoriesBaseUrls]);
  
    if (loading) {
      return <p className="text-gray-600">Loading tracks...</p>;
    }
    



    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tracks.map((track, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded shadow">
            {track}
          </div>
        ))}
      </div>
    );
  }
  