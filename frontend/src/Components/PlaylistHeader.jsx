// PlaylistHeader.jsx
import React from 'react';
import { ChevronLeft, Play } from 'lucide-react';

const PlaylistHeader = ({ handleBack, handlePlayAll, data }) => {
  if (!data) return null;

  return (
    <div className="w-full mb-10">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6"
      >
        <ChevronLeft className="w-5 h-5" /> Back
      </button>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Image */}
        <img
          src={data.image}
          alt={data.name}
          className="w-44 h-44 rounded-xl object-cover shadow-2xl"
        />

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {data.name}
          </h2>
          {data.owner && (
            <p className="text-gray-400 text-lg mb-2">By {data.owner}</p>
          )}
          {data.total_tracks && (
            <p className="text-gray-400 text-sm mb-2">
              {data.total_tracks} Tracks
            </p>
          )}

          {/* Play Button */}
          <button
            onClick={handlePlayAll}
            className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-md font-medium"
          >
            <Play size={20} /> Play All
          </button>

          {/* Metadata */}
          <div className="mt-6 text-sm text-gray-400 space-y-1">
            {data.label && (
              <p>
                <span className="font-semibold text-white">Label:</span>{' '}
                {data.label}
              </p>
            )}
            {data.release_date && (
              <p>
                <span className="font-semibold text-white">Release Date:</span>{' '}
                {data.release_date}
              </p>
            )}
            {data.copyrights && data.copyrights.length > 0 && (
              <p>
                <span className="font-semibold text-white">Copyright:</span>{' '}
                {data.copyrights.map((c) => c.text).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
