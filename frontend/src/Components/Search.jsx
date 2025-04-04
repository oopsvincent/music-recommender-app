import React, { useState } from "react";

const Search = ({ handleChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    handleChange(query); // Pass the search input to App.jsx
  }

  return (
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
  );
};

export default Search;
