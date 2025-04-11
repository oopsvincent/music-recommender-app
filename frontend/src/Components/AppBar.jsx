import { useState } from "react";
import '../index.css'
import { Search, CircleUserRound, ListMusic, Music, Cog } from "lucide-react";

const AppBar = ({ selectedSection, setSection }) => {
//   const [selectedSection, setSection] = useState("Music");

  return (
    <nav className="select-none bg-black text-white px-2 py-2.5 flex justify-center items-center shadow-lg fixed bottom-0 left-0 w-dvw lg:pl-70 lg:pr-70">
      {/* Logo */}
      {/* <div className="text-2xl font-bold tracking-wide">🎵 MusicApp</div>
       */}
      {/* Search Bar */}
      {/* <div className="relative w-32">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <svg
            className="absolute right-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M15 10a5 5 0 11-10 0 5 5 0 0110 0z"
            />
          </svg>
        </div> */}

      {/* Navigation */}
      <div className="flex space-x-6">
        <div
          onClick={() => {
            setSection("Music");
          }}
          className={`w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 blck transition-all duration-400 ${
            selectedSection == "Music" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
            <Music/>
          <p className="text-xs">Music</p>
        </div>

        <div
          onClick={() => {
            setSection("Search");
          }}
          className={`blck w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection === "Search" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
            <Search/>
          <p className="text-xs">Explore</p>
        </div>

        <div
          onClick={() => {
            setSection("Account");
          }}
          className={`blck w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Account" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
            <CircleUserRound/>
          <p className="text-xs">Account</p>
        </div>

        <div
          onClick={() => {
            setSection("Settings");
          }}
          className={`blck w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Settings"
              ? "bg-white text-black rounded-lg"
              : ""
          }`}
        >
            <Cog/>
          <p className="text-xs">Settings</p>
        </div>

        <div
          onClick={() => {
            setSection("Playlist");
          }}
          className={`blck w-12 inline-flex flex-col justify-around items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Playlist"
              ? "bg-white text-black rounded-lg"
              : ""
          }`}
        >
            <ListMusic/>
          <p className="text-xs">Playlist</p>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
