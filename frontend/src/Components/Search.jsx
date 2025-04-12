import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchComp = ({ handleChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("track");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(query.trim().length > 0);
        handleChange(query, searchType);
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSearchType(type);
        handleChange(searchQuery, type);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        handleChange("", searchType);
    };

    return (
        <>
            <div className="flex justify-center items-center bg-black w-at-min">
                <input
                    className="p-5 text-white text-2xl outline-0 w-at-min"
                    type="text"
                    placeholder="Search any music"
                    value={searchQuery}
                    onChange={handleSearch}
                    id="searchBar"
                />
                <button onClick={isSearching ? clearSearch : null}>
                    {isSearching ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    ) : (
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
                    )}
                </button>
            </div>

            <div className="flex text-white gap-2 justify-between items-center px-5 bg-black py-3 rounded-b-3xl">
                <h2 className="text-2xl">Sort By</h2>
                <select
                    className="bg-black border-2 text-white text-2xl rounded-2xl px-2"
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
            </div>
        </>
    );
};

export default SearchComp;
