import { useState } from "react";
import '../index.css'
import { Search, CircleUserRound, ListMusic, Music, Cog } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AppBar = ({ selectedSection, setSection }) => {
    const navigate = useNavigate();

  return (
    <nav className="select-none bg-black text-white px-2 py-2.5 flex justify-center items-center shadow-lg fixed bottom-0 left-0 w-dvw lg:pl-70 lg:pr-70 z-50">


      {/* Navigation */}
      <div className="flex space-x-6">
        <div
          onClick={() => {
            setSection("Music");
            window.scrollTo(0,0);
            navigate('/');
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
            window.scrollTo(0,0);
            navigate('/search');
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
            navigate('/account');
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
            navigate('/settings');
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
            navigate('/playlist');
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
