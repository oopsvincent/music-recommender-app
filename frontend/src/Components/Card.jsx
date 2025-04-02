import React from 'react'
import { SpotifyButton, YouTubeButton } from './MusicButtons'

const Card = ({ url, title, artist, spoURL}) => {
  // Define truncation logic
  let displayedTitle = title;
  if (title.length > 30) {
    displayedTitle = title.slice(0, 27) + '...'; // Shorten and add ellipsis
  }

  return (
    <div className='m-2 rounded-xl flex flex-col hover:scale-105 transition-all duration-300 w-42 border border-white/30 glassmorpho md:w-64 md:m-4'>

        {/* Image */}
        <img src={url} alt="" className='rounded-t-xl' />

        {/* Content */}
        <div className='flex flex-col flex-grow p-3'>
          <h1 className='text-2xl font-sbold text-white 
                         whitespace-nowrap overflow-scroll scrollb-none max-w-full' title={title}>
            {title}
          </h1>
          <p className='text-xs font-ultralight text-gray-300'>{artist}</p>
        </div>

        {/* Buttons at the bottom */}
        <div className='flex flex-col mt-auto p-0'>
          <SpotifyButton clickHandle={spoURL} />
          <YouTubeButton/>
        </div>

    </div>
  )
}

export default Card
