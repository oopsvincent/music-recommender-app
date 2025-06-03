import React, { useState, useEffect, useRef } from "react";
import { SpotifyButton, YouTubeButton, SmallSpotifyButton, SmallYouTubeButton } from "./MusicButtons";
import { Bookmark, BookmarkPlus, Check, CirclePlay, Award, Handshake } from "lucide-react"; // Adjust imports if needed
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { motion, AnimatePresence, scale } from "framer-motion";
import { usePlayer } from "../contexts/PlayerContext";

const Card = ({
    url,
    title,
    artist,
    spoURL,
    YTURL,
    popularity,
    type,
    followers,
    description,
    explicit,
    trackURI,
    handleSave, // Function passed from parent to handle saving
}) => {

    // Inside your component:
    const [saved, setSaved] = useState(false);
    const { showPlayer } = usePlayer();
    const handlePlayClick = () => {

    if (trackURI && trackURI.startsWith("spotify:")) {
        showPlayer(trackURI);
    } else {
        console.warn("Invalid Spotify URI:", trackURI);
    }
};

    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];
        const isAlreadySaved = savedSongs.some(song => song.title === title && song.artist === artist);
        setSaved(isAlreadySaved);
    }, [title, artist]);

    function toggleSave() {
        const savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || [];

        if (saved) {
            // REMOVE the song
            const updated = savedSongs.filter(song => !(song.title === title && song.artist === artist));
            localStorage.setItem("savedSongs", JSON.stringify(updated));
            setSaved(false);
        } else {
            // ADD the song
            const newSong = {
                title,
                artist,
                followers,
                spoURL,
                YTURL,
                image: url,
                description,
                popularity,
                explicit,
                type,
                trackURI,
            };
            savedSongs.push(newSong);
            localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
            setSaved(true);
        }
    }

    function handleClick(url) {
        console.log(url);

        setTimeout(() => {
            window.open(url, "_blank");
        }, 500);
    }

    let displayedDesc = description;
    if (description && description.length > 150) {
        displayedDesc = description.slice(0, 147) + "...";
    }

    const sections = {
        Artist: (
            <div className="m-2 rounded-xl flex flex-col items-start justify-center transition-all duration-300 w-90 h-max border border-white/30 glassmorpho md:w-100 md:m-4 hover:bg-black/100 active:bg-black/100">
                <div className="flex items-center justify-around">
                    <img src={url} alt="" className="w-4/12 mt-5 ml-5 rounded-2xl group active:scale-110 hover:scale-110 transition-all duration-200" />
                    <div className="mx-2 mt-5.5">
                        <SmallSpotifyButton clickHandle={() => handleClick(spoURL)} />
                        <SmallYouTubeButton clickHandle={(() => handleClick(YTURL))} />
                    </div>
                </div>
                <div className="flex flex-col flex-grow p-3 relative">
                    <h1
                        className="text-4xl text-white 
                         whitespace-wrap scrollb-none max-w-full pt-2 font-semibold font-stretch-115% mx-0 py-0 px-2"
                        title={title}
                    >
                        {title}
                    </h1>
                </div>
                <p className="px-5 text-md font-ultralight text-gray-300">{`${followers?.toLocaleString()} Followers`}</p>
                <div
                    className={`mx-auto mb-2 text-xs inline-flex justify-center items-center md:text-lg ${popularity < 80 ? "text-yellow-400" : "text-lime-400"
                        }`}
                >
                    <Award />
                    <p>{`Popularity: ${popularity}`}</p>
                    {popularity >= 80 ? <span title="Trending RIght Now 🔥">🔥</span> : <span></span>}
                </div>
            </div>
        ),
        Popularity: (
            <div
                className={`ml-1 mb-1 text-xs inline-flex justify-center items-center md:text-lg ${popularity < 80 ? "text-yellow-400" : "text-lime-400"
                    }`}
            >
                <Award />
                <p title={popularity >= 80 ? "Trending right now 🔥" : `${popularity}`}>{`Popularity: ${popularity}`}</p>
                {popularity >= 80 ? <span title="Trending RIght Now 🔥">🔥</span> : <span></span>}
            </div>
        ),
                controls: (
            <div className="absolute top-2 right-2 flex gap-3 items-center z-20">
                {/* Play Button */}
                <button
                    onClick={handlePlayClick}
                    title="Play on Spotify"
                    className="text-white bg-black/50 hover:bg-green-600 transition-colors p-1.5 rounded-full hover:scale-110 active:scale-95"
                >
                    <CirclePlay size={24} strokeWidth={2.5} />
                </button>

                {/* Save Button */}
                <div className="relative w-6 h-6 inline-flex justify-center items-center group">
                    <button
                        onClick={toggleSave}
                        className="relative w-full h-full hover:scale-110 transition-transform duration-300 ease-in-out"
                    >
                        {/* Saved Icon */}
                        <svg
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${saved ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="rgb(0, 255, 106)"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>

                        {/* Unsaved Icon */}
                        <svg
                            className={`absolute inset-0 transition-all duration-500 ease-in-out ${saved ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                            <line x1="12" x2="12" y1="8" y2="16" />
                            <line x1="8" x2="16" y1="12" y2="12" />
                        </svg>

                        <span className="absolute bottom-full mt-1 left-1/2 w-20 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 group-hover:scale-100 transition-all duration-300 bg-black text-white px-2 py-1 rounded text-sm">
                            {saved ? "Saved!" : "Save it bro"}
                        </span>
                    </button>
                </div>
            </div>
        ),

        ExplicitTag: (<div className="absolute top-33 md:top-55 bg-black right-0 m-2 rounded-xs" title="EXPLICIT"><svg xmlns="http://www.w3.org/2000/svg" fill="white" width="20" height="20" viewBox="0 0 24 24" id="explicit">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 6h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
        </svg></div>),
    }


    return type === "artist" ? sections["Artist"] :
        <motion.div
            onClick={handlePlayClick}
            animate={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}

            initial={{ opacity: 0, scale: 0.8, translateY: 100, translateX: 0 }}
            whileInView={{ opacity: 1, scale: 1, translateY: 0, translateX: 0 }}
            whileTap={{ scale: 0.95, }}
            exit={{ opacity: 0, scale: 1, translateY: 300 }}
            title={artist + " - " + title} className="h-auto m-1 rounded-xl flex flex-col transition-all duration-300 w-42 border border-white/30 glassmorpho md:w-64 md:m-4 hover:bg-black/100 active:bg-black/100">
            {explicit && sections["ExplicitTag"]}
            {/* Image */}
            { }
            {url ? (
                <img src={url} alt={title} className="rounded-t-xl group" />
            ) : (
                <Skeleton height={200} className="rounded-t-xl" />
            )}

            {/* Content */}
            <div className="flex flex-col flex-grow p-3 relative">
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileDrag={{ scale: 1.2 }}
                    className="text-2xl font-sbold text-white whitespace-nowrap overflow-scroll scrollb-none max-w-full font-semibold font-stretch-120%"
                    title={title}
                >
                    {title}
                </motion.div>

                <p title={artist} className="text-md font-ultralight text-gray-300">
                    {type === "artist"
                        ? `${followers?.toLocaleString() ?? "?"} Followers`
                        : artist || "Unknown Artist"}
                </p>

                {type === "show" && <div className="text-white">{displayedDesc}</div>}
                {type === "album" && <div className="text-white">{description}</div>}
                {type === "episode" && <div className="text-white">{displayedDesc}</div>}
            </div>


            {/* Buttons at the bottom */}
            <div className="flex flex-col mt-auto p-0">
                <SpotifyButton clickHandle={() => handleClick(spoURL)} />
                <YouTubeButton clickHandle={() => handleClick(YTURL)} />
            </div>
            <div className="flex justify-between items-center pb-2">
                {type === "artist" && sections["Popularity"]}
                {type === "track" && sections["Popularity"]}
                {type === "album" && <p className="text-white pl-3 pr-3">Released: {popularity}</p>}
                {type === "playlist" && <p className="text-white pl-3 pr-3">Owner: {popularity}</p>}

                        {sections.controls}

            </div>
        </motion.div>
}

export default Card;