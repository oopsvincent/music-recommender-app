import { useState } from "react";

const AppBar = ({ selectedSection, setSection }) => {
//   const [selectedSection, setSection] = useState("Music");

  return (
    <nav className="select-none bg-black text-white px-6 py-4 flex justify-center items-center shadow-lg fixed bottom-0 left-0 w-dvw lg:pl-70 lg:pr-70">
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
          className={`w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Music" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-music-icon lucide-music"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <p className="text-xs">Music</p>
        </div>

        <div
          onClick={() => {
            setSection("Search");
          }}
          className={`w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection === "Search" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search-icon lucide-search"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <p className="text-xs">Search</p>
        </div>

        <div
          onClick={() => {
            setSection("Artist");
          }}
          className={`w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Artist" ? "bg-white text-black rounded-lg" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
          >
            <path d="M18 20a6 6 0 0 0-12 0" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="text-xs">Account</p>
        </div>

        <div
          onClick={() => {
            setSection("Settings");
          }}
          className={`w-12 inline-flex flex-col justify-between items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Settings"
              ? "bg-white text-black rounded-lg"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-cog-icon lucide-cog"
          >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M12 2v2" />
            <path d="M12 22v-2" />
            <path d="m17 20.66-1-1.73" />
            <path d="M11 10.27 7 3.34" />
            <path d="m20.66 17-1.73-1" />
            <path d="m3.34 7 1.73 1" />
            <path d="M14 12h8" />
            <path d="M2 12h2" />
            <path d="m20.66 7-1.73 1" />
            <path d="m3.34 17 1.73-1" />
            <path d="m17 3.34-1 1.73" />
            <path d="m11 13.73-4 6.93" />
          </svg>
          <p className="text-xs">Settings</p>
        </div>

        <div
          onClick={() => {
            setSection("Playlist");
          }}
          className={`w-12 inline-flex flex-col justify-around items-center hover:text-gray-400 p-2 rounded-3xl active:scale-90 transition-all duration-400 ${
            selectedSection == "Playlist"
              ? "bg-white text-black rounded-lg"
              : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-list-music-icon lucide-list-music"
          >
            <path d="M21 15V6" />
            <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            <path d="M12 12H3" />
            <path d="M16 6H3" />
            <path d="M12 18H3" />
          </svg>
          <p className="text-xs">Playlist</p>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;
