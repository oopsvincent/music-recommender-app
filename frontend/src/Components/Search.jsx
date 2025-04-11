import React, { useState } from "react";

const Search = ({ handleChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("track");
  
    function handleSearch(e) {
      const query = e.target.value;
      setSearchQuery(query);
      handleChange(query, searchType); // Pass both query and type
    }
  
    function handleTypeChange(e) {
      const type = e.target.value;
      setSearchType(type);
      handleChange(searchQuery, type); // Also pass both
    }


  return (
    <>
      <div className="flex justify-center items-center bg-black w-at-min">
        <input
          className="p-5 text-white text-2xl outline-0 w-at-min"
          type="text"
          placeholder="Search any music"
          value={searchQuery}
          onChange={handleSearch}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search-icon lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <select
        className="bg-black border-2 text-white text-2xl rounded-2xl p-4"
        onChange={handleTypeChange}
        value={searchType}
      >
        <option value="track">Music</option>
        <option value="artist">Artist</option>
        <option value="album">Album</option>
        <option value="playlist">Playlist</option>
        <option value="show">Show</option>
        <option value="episode">Podcast Episode</option>
      </select>

    </>
  );
};

export default Search;
