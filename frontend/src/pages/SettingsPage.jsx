import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import TracksDaily from '../Components/TracksDaily';

function removeData() {
    localStorage.clear();
    window.location.reload();
}

const SettingsPage = () => {
  return (
    <div className='h-[80vh] flex flex-col items-center p-5'>
        <h1 className='text-4xl text-white boldonse py-5'>Settings</h1>
    {/* <h3 className="text-2xl text-white m-3 flex justify-around items-center">
        Current Music Language: {musicLanguage}
        <button
            className="bg-white text-black p-2 ml-5 rounded-lg hover:bg-black hover:text-white focus:bg-black focus:text-white focus:border-2 transition-all duration-200"
            onClick={() => setTimeout(() => setShowLogin(true), 500)} // Show the login again when the user wants to change
        >
            Change
        </button>
    </h3> */}
    <h3 className="font-h text-2xl text-white m-3 flex justify-around items-center gap-5 my-2 py-4">
        Delete Your Information
        <motion.button
            onClick={() => setTimeout(() => removeData(), 1500)}
            whileTap={{ scale: 0.9, background: "#D40000" }}
            whileHover={{ scale: 1.05, backgroundColor: "#D40000" }}
            className="bg-black p-3 text-white border-2 rounded-2xl hover:rounded-md hover:border-0 transition-all duration-200"
            // className="bg-black p-3 text-red-500 border-2 rounded-2xl hover:rounded-md hover:border-0 hover:bg-red-500 hover:text-black active:bg-red-400 active:text-white transition-all duration-200"
        >
            Delete Account
        </motion.button>
    </h3>

    <h3 className="font-h text-2xl text-white m-3 flex justify-around items-center gap-5 my-2 py-4">
        Clear Your Saved Music
        <motion.button
            onClick={() => setTimeout(() => {
                localStorage.setItem("savedSongs", null)
                window.location.reload();
            }, 1500)}
            whileTap={{ scale: 0.9, background: "white", color: "black" }}
            whileHover={{ scale: 1.05, backgroundColor: "white" }}
            className="bg-black p-3 text-white border-2 rounded-2xl hover:rounded-md hover:border-0 hover:bg-red-500 hover:text-black transition-all duration-200"
            // className="bg-black p-3 text-white border-2 rounded-2xl hover:rounded-md hover:border-0 hover:bg-white hover:text-black active:bg-white active:text-black transition-all duration-200"
        >
            Clear Playlist
        </motion.button>
    </h3>
    {/* <TracksDaily categoriesBaseUrls={'https://music-recommender-api.onrender.com/songs/'} /> */}
</div>
  )
}

export default SettingsPage