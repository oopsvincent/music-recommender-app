//   // Define truncation logic
//   let displayedTitle = title;
//   if (title.length > 30) {
//     displayedTitle = title.slice(0, 27) + "..."; // Shorten and add ellipsis
//   }
import React, { useState } from "react";
import { SpotifyButton, YouTubeButton } from "./MusicButtons";

const Card = ({ url, title, artist, spoURL, YTURL }) => {
  const [saved, setSaved] = useState(false);
  const [like, saveLike] = useState(0);

  function handleClick(url) {
    setTimeout(() => {
      window.open(url, "_blank");
    }, 500);
  }

  return (
    <div className="m-2 rounded-xl flex flex-col transition-all duration-300 w-42 border border-white/30 glassmorpho md:w-64 md:m-4">
      {/* Image */}
      <img src={url} alt="" className="rounded-t-xl" />

      {/* Content */}
      <div className="flex flex-col flex-grow p-3">
        <h1
          className="text-2xl font-sbold text-white 
                         whitespace-nowrap overflow-scroll scrollb-none max-w-full"
          title={title}
        >
          {title}
        </h1>
        <p className="text-xs font-ultralight text-gray-300">{artist}</p>
      </div>

      {/* Buttons at the bottom */}
      <div className="flex flex-col mt-auto p-0">
        <SpotifyButton clickHandle={() => handleClick(spoURL)} />
        <YouTubeButton clickHandle={() => handleClick(YTURL)} />
      </div>
      <div className="flex justify-between items-center pb-2">
        <div className="inline-flex justify-center items-center ml-3">
          <button className="p-2" onClick={() => saveLike(1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={`${like === 1 ? "blue" : "none"}`}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-thumbs-up-icon lucide-thumbs-up"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </button>
          <button className="p-2" onClick={() => saveLike(2)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={`${like === 2 ? "red" : "none"}`}
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-thumbs-down-icon lucide-thumbs-down"
            >
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
            </svg>
          </button>
        </div>
        <div className="mr-3 inline-flex justify-center items-center transition-all duration-1000">
          <button
            onClick={() => {
              setSaved(!saved);
            }}
          >
            {saved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="rgb(0, 255, 106)"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-badge-check-icon lucide-badge-check"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />

                <path d="m9 12 2 2 4-4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-badge-plus-icon lucide-badge-plus"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />

                <line x1="12" x2="12" y1="8" y2="16" />

                <line x1="8" x2="16" y1="12" y2="12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
