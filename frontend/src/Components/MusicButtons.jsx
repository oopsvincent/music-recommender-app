import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons' // ✅ Added YouTube icon

export const SpotifyButton = ({ clickHandle }) => {
  return (
    <button onClick={clickHandle} className='text-md m-2 justify-center align-middle font-heavy text-center bg-green-500 text-white px-1 py-1.5 md:px-3 md:py-2 md:text-lg rounded flex items-center gap-2 hover:text-black active:text-black active:scale-90 transition-all duration-200 p-5'>
      Play on Spotify
      <FontAwesomeIcon icon={faSpotify} className="text-2xl" />
    </button>
  )
}

export const YouTubeButton = ({ clickHandle }) => {
  return (
    <button onClick={clickHandle} className='text-md m-2 justify-center align-middle font-heavy text-center bg-red-500 text-white px-1 py-1.5 md:px-3 md:py-2 md:text-lg rounded flex items-center gap-2 hover:text-black active:text-black active:scale-90 transition-all duration-200'>
      Watch on YouTube
      <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
    </button>
  )
}

const MusicButtons = () => {
  return (
    <div className="flex gap-4">
      <SpotifyButton />
      <YouTubeButton />
    </div>
  )
}

export const SmallSpotifyButton = ({ clickHandle }) => {
    return (
        <button onClick={clickHandle} className='text-xs  mx-2 my-1 justify-center align-middle font-heavy text-center bg-green-500 text-white px-2.5 py-2 md:px-3.5 md:py-2 md:text-lg rounded flex items-center gap-2 hover:scale-105 hover:text-black active:text-black active:scale-90 transition-all duration-300'>
            <FontAwesomeIcon icon={faSpotify} className="text-4xl" />
        </button>
    )
}

export const SmallYouTubeButton = ({ clickHandle }) => {
    return (
      <button onClick={clickHandle} className='text-xs mx-2 my-1 justify-center align-middle font-heavy text-center bg-red-500 text-white px-2 py-2 md:px-3 md:py-2 md:text-lg rounded flex items-center gap-2 hover:scale-105 hover:text-black active:text-black active:scale-90 transition-all duration-200'>
        <FontAwesomeIcon icon={faYoutube} className="text-4xl" />
      </button>
    )
  }

export default MusicButtons
