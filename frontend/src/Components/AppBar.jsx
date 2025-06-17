import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, CircleUserRound, ListMusic, Music, Cog, UserCircleIcon, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import '../index.css';

const AppBar = ({ selectedSection, setSection }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Set section based on route path
    useEffect(() => {
        const path = location.pathname;

        if (path === "/") setSection("Music");
        else if (path.startsWith("/search")) setSection("Search");
        else if (path.startsWith("/feedback")) setSection("Account");
        else if (path.startsWith("/settings")) setSection("Settings");
        else if (path.startsWith("/library")) setSection("Playlist");
        else setSection(""); // fallback
    }, [location.pathname]);

    return (
        <nav className="z-100 select-none bg-black text-white px-2 py-2.5 flex justify-center items-center shadow-lg fixed bottom-0 left-0 w-dvw lg:pl-70 lg:pr-70">
            <div className="flex space-x-6">

                <motion.div
                    onClick={() => {
                        setSection("Music");
                        navigate('/');
                        window.scrollTo(0, 0);
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 inline-flex flex-col justify-between items-center p-2 rounded-3xl transition-all duration-400 ${
                        selectedSection === "Music" ? "bg-white text-black rounded-lg" : ""
                    }`}
                >
                    <Music />
                    <p className="text-xs">Music</p>
                </motion.div>

                <motion.div
                    onClick={() => {
                        setSection("Search");
                        navigate('/search');
                        window.scrollTo(0, 0);
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 inline-flex flex-col justify-between items-center p-2 rounded-3xl transition-all duration-400 ${
                        selectedSection === "Search" ? "bg-white text-black rounded-lg" : ""
                    }`}
                >
                    <Search />
                    <p className="text-xs">Explore</p>
                </motion.div>

                <motion.div
                    onClick={() => {
                        setSection("Account");
                        navigate('/feedback');
                        window.scrollTo(0, 0);
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 inline-flex flex-col justify-between items-center p-2 rounded-3xl transition-all duration-400 ${
                        selectedSection === "Account" ? "bg-white text-black rounded-lg" : ""
                    }`}
                >
                    <Newspaper />
                    <p className="text-xs">Review</p>
                </motion.div>

                <motion.div
                    onClick={() => {
                        setSection("Settings");
                        navigate('/settings');
                        window.scrollTo(0, 0);
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 inline-flex flex-col justify-between items-center p-2 rounded-3xl transition-all duration-400 ${
                        selectedSection === "Settings" ? "bg-white text-black rounded-lg" : ""
                    }`}
                >
                    <Cog />
                    <p className="text-xs">Settings</p>
                </motion.div>

                <motion.div
                    onClick={() => {
                        setSection("Playlist");
                        navigate('/library');
                        window.scrollTo(0, 0);
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`w-12 inline-flex flex-col justify-between items-center p-2 rounded-3xl transition-all duration-400 ${
                        selectedSection === "Playlist" ? "bg-white text-black rounded-lg" : ""
                    }`}
                >
                    <ListMusic />
                    <p className="text-xs">Library</p>
                </motion.div>

            </div>
        </nav>
    );
};

export default AppBar;
