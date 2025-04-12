import React, { useState } from "react";
import { SpotifyButton, YouTubeButton,SmallSpotifyButton, SmallYouTubeButton } from "./MusicButtons";
import { Bookmark, BookmarkPlus, Check, CirclePlay, Award, Handshake } from "lucide-react"; // Adjust imports if needed
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
}) => {
    const [saved, setSaved] = useState(false);

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
                    <SmallSpotifyButton clickHandle={()=> handleClick(spoURL)}/>
                    <SmallYouTubeButton clickHandle={(() => handleClick(YTURL))}/>
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
                <p>{`Popularity: ${popularity}`}</p>
                {popularity >= 80 ? <span title="Trending RIght Now 🔥">🔥</span> : <span></span>}
            </div>
        ),
        save: (
            <div className="relative w-6 h-6 mr-3 inline-flex justify-center items-center group">
                <button
                    onClick={() => {
                        setSaved(!saved);
                    }}
                    className="relative w-full h-full hover:scale-110 transition-transform duration-300 ease-in-out"
                >

                    {/* Saved Icon */}
                    <svg
                        className={`absolute inset-0 transition-all duration-500 ease-in-out ${saved ? 'opacity-100 scale-100' : 'opacity-0 scale-75'} `}
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


                    <span className="absolute bottom-full mt-1 left-1/2 w-20 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 group-hover:scale-100 transition-all duration-300 bg-black text-white px-2 py-1 rounded text-sm">
                        {saved ? "Saved!" : "Save it bro"}
                    </span>


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
                </button>
            </div>

        ),
        ExplicitTag: (<div className="absolute bottom-2 right-1" title="EXPLICIT (contains offensive and vulgar words)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="explicit">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 6h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
        </svg></div>),
    }


    return type === "artist" ? sections["Artist"] : 
        <div className="m-2 rounded-xl flex flex-col transition-all duration-300 w-42 border border-white/30 glassmorpho md:w-64 md:m-4 hover:bg-black/100 active:bg-black/100">
            {/* Image */}
            {}
            {url ? (
                <img src={url} alt="" className="rounded-t-xl group" />
            ) : (
                <Skeleton height={200} className="rounded-t-xl" />
            )}

            {/* Content */}
            <div className="flex flex-col flex-grow p-3 relative">
                {/* <span className="absolute w-15 h-15 text-center bottom-full mt-1 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-active:scale-100 transition-all duration-300 bg-black text-white px-2 py-1 rounded-4xl text-sm">
    {<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play-icon lucide-circle-play"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>}
  </span> */}
                <h1
                    className="text-2xl font-sbold text-white 
                         whitespace-nowrap overflow-scroll scrollb-none max-w-full"
                    title={title}
                >
                    {title}
                </h1>
                <p className="text-md font-ultralight text-gray-300">{artist ? artist : `${followers?.toLocaleString()} Followers`}</p>
                {type === "show" ? <div className="text-white">{displayedDesc}</div> : null}
                {type === "album" ? <div className="text-white">{description}</div> : null}
                {type === "episode" ? <div className="text-white">{displayedDesc}</div> : null}
                {explicit && sections["ExplicitTag"]}
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

                {type !== "show" && sections["save"]}

            </div>
        </div>
}

export default Card;
